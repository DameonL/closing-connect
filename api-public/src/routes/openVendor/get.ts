import { CosmosClient } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { AzureKeyCredential, SearchClient } from "@azure/search-documents";

const writeKey = process.env.PayoffSearchWriteKey;

const searchEndpoint = "https://api-vendor-search.search.windows.net";
export default async function vendor(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const vendorId =
    req.query.get("id") && req.query.get("id") !== ""
      ? req.query.get("id")
      : undefined;
  const searchTerm = req.query.get("search");
  let firstLetter = req.query.get("firstLetter");
  if (firstLetter) {
    firstLetter = firstLetter.toLowerCase();
  }

  if (searchTerm) {
    const start = req.query.get("start");
    const limit = Number(req.query.get("limit"));
    const startIndex = start ? Number(start) : undefined;
    const searchClient = new SearchClient<{ id: string; name: string }>(
      searchEndpoint,
      "search-1765581731545",
      new AzureKeyCredential(writeKey)
    );

    const search = await searchClient.search(searchTerm, {
      select: ["id", "name"],
      top: isNaN(limit) ? 10 : Number(limit),
      skip: startIndex,
      includeTotalCount: true,
      orderBy: ["search.score() desc, name asc"],
    });
    const results = [];
    for await (const result of search.results) {
      results.push(result);
    }

    const response: SearchResponse = {
      search: searchTerm,
      results,
      count: search.count,
      limit,
      start: startIndex ? startIndex : 0,
    };

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } else {
    const client = new CosmosClient(process.env.CosmosDbConnectionString);
    const database = client.database("ClosingConnect");
    const container = database.container("Vendors");

    const queryIterator = container.items.query<PayoffVendor>({
      query: `SELECT * FROM Vendors e WHERE e.id = @id`,
      parameters: [{ name: "@id", value: vendorId }],
    });

    if (!queryIterator.hasMoreResults) {
      return {
        status: 404,
      };
    }

    const response = await queryIterator.fetchNext();
    const vendor = response.resources[0];

    if (vendor) {
      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, must-revalidate"
        },
        body: JSON.stringify({ vendor }),
      };
    }
  }

  return {
    status: 404,
  };
}
