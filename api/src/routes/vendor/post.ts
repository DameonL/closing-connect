import { CosmosClient } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  AzureKeyCredential,
  SearchClient,
  SearchIndexerClient,
} from "@azure/search-documents";
import getFirstLetter from "../../common/Utilities/getFirstLetter";

const writeKey = process.env.PayoffSearchWriteKey;
const searchEndpoint = "https://payoff-search.search.windows.net";

function removeIllegalChars(id: string) {
  return id.replace(/[\/\\?#]/g, "");
}

export default async function vendor(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const vendorId =
      req.query.get("id") && req.query.get("id") !== ""
        ? req.query.get("id")
        : undefined;
    let firstLetter = req.query.get("firstLetter");
    if (firstLetter) {
      firstLetter = firstLetter.toLowerCase();
    }

    const client = new CosmosClient(process.env.CosmosDbConnectionString);
    const database = client.database("Payoffs");
    const container = database.container("Vendors");

    const body = (await req.json()) as { vendor: PayoffVendor };
    let existingVendor =
      vendorId && vendorId !== ""
        ? container.item(vendorId, firstLetter)
        : undefined;
    const existingVendorResource = existingVendor
      ? (await existingVendor.read()).resource
      : undefined;
    const newVendor: PayoffVendor = body.vendor;
    newVendor.name = removeIllegalChars(newVendor.name);
    if (!newVendor) {
      return {
        status: 400,
      };
    }

    const newFirstLetter = getFirstLetter(newVendor.name);
    if (
      existingVendor &&
      (newFirstLetter !== newVendor.firstLetter ||
        newVendor.name !== existingVendorResource.name)
    ) {
      newVendor.firstLetter = newFirstLetter;
      const searchClient = new SearchClient<{ id: string; name: string }>(
        searchEndpoint,
        "payoffs-index",
        new AzureKeyCredential(writeKey)
      );

      await searchClient.deleteDocuments([
        { id: existingVendorResource.id, name: existingVendorResource.name },
      ]);
      await existingVendor.delete();
      existingVendor = undefined;
    }

    let updatedVendor: PayoffVendor | undefined;

    newVendor.firstLetter = newVendor.firstLetter.toLowerCase();
    if (existingVendor) {
      const response = await existingVendor.replace(newVendor);
      updatedVendor = response.resource;
    } else {
      const response = await container.items.upsert<PayoffVendor>(newVendor);
      updatedVendor = response.resource;
    }

    try {
      const indexerClient = new SearchIndexerClient(
        searchEndpoint,
        new AzureKeyCredential(writeKey)
      );
      await indexerClient.runIndexer("payoffs-indexer");
    } catch (error) {}
    return {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendor: updatedVendor }),
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({ error }),
    };
  }
}
