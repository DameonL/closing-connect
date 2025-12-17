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
  const searchTerm = req.query.get("search");

  if (!searchTerm) {
    return {
      status: 400,
      body: "Please include a search term in your request."
    }
  }

  const start = req.query.get("start");
  const limit = Number(req.query.get("limit"));
  const startIndex = start ? Number(start) : undefined;
  const searchClient = new SearchClient<{ id: string; name: string }>(
    searchEndpoint,
    "vendor-search-index",
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

}
