import {
  CosmosDBFunctionOptions,
  CosmosDBHandler,
  HttpFunctionOptions,
  HttpHandler,
  HttpMethod,
  HttpTriggerOptions,
} from "@azure/functions";

export type AzureRouteName = "vendor" | "search";

export interface AzureHttpRoute {
  trigger: (name: string, options: HttpFunctionOptions) => void;
  route: AzureRouteName;
  method: HttpMethod;
  handler: HttpHandler;
  authLevel?: HttpTriggerOptions["authLevel"]
}

export interface AzureCosmosRoute {
  trigger: (name: string, options: CosmosDBFunctionOptions) => void;
  route: AzureRouteName;
  connection: {
    connection: string;
    databaseName: string;
    containerName: string;
    createLeaseContainerIfNotExists: boolean;
  };
  handler: CosmosDBHandler;
}