import { AzureCosmosRoute, AzureHttpRoute } from "../AzureRoutes";
import openVendor from "./openVendor";
import search from "./search";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...openVendor,
  ...search
];
export default routes;
