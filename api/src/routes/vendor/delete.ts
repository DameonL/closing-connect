import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AzureKeyCredential, SearchClient, SearchIndexerClient } from "@azure/search-documents";

const writeKey = process.env.PayoffSearchWriteKey;

const searchEndpoint = "https://payoff-search.search.windows.net";
const searchClient = new SearchClient<{ id: string; name: string }>(
  searchEndpoint,
  "payoffs-index",
  new AzureKeyCredential(writeKey)
);
const indexerClient = new SearchIndexerClient(searchEndpoint, new AzureKeyCredential(writeKey));

export default async function route(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const vendorId = req.query.get("id") && req.query.get("id") !== "" ? req.query.get("id") : undefined;
  let firstLetter = req.query.get("firstLetter");
  if (firstLetter) {
    firstLetter = firstLetter.toLowerCase();
  }

  const client = new CosmosClient(process.env.CosmosDbConnectionString);
  const database = client.database("Payoffs");
  const container = database.container("Vendors");

  const vendorItem = vendorId ? container.item(vendorId, firstLetter) : undefined;
  const vendorRead = vendorItem ? await vendorItem.read<PayoffVendor>() : undefined;
  const vendor = vendorRead ? vendorRead.resource : undefined;

  if (!vendor) {
    return {
      status: 404,
    };
  }

  await searchClient.deleteDocuments([{ id: vendor.id, name: vendor.name }]);
  await vendorItem.delete();

  try {
    await indexerClient.runIndexer("payoffs-indexer");
  } catch (error) {}

  return {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  };
}
