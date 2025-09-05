import {
  CosmosDBFunctionOptions,
  CosmosDBHandler,
  HttpFunctionOptions,
  HttpHandler,
  HttpMethod,
  HttpTriggerOptions,
} from "@azure/functions";

declare type AzureRouteName = "vendor" | "openVendor";

declare interface AzureHttpRoute {
  trigger: (name: string, options: HttpFunctionOptions) => void;
  route: AzureRouteName;
  method: HttpMethod;
  handler: HttpHandler;
  authLevel?: HttpTriggerOptions["authLevel"]
}

declare interface AzureCosmosRoute {
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