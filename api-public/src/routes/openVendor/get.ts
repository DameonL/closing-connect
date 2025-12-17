import { CosmosClient } from "@azure/cosmos";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export default async function vendor(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const vendorId =
    req.query.get("id") && req.query.get("id") !== ""
      ? req.query.get("id")
      : undefined;
  let firstLetter = req.query.get("firstLetter");
  if (firstLetter) {
    firstLetter = firstLetter.toLowerCase();
  }

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

  return {
    status: 404,
  };
}
