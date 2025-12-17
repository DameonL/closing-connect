import { AzureCosmosRoute, AzureHttpRoute } from "../AzureRoutes";
import openVendor from "./openVendor";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...openVendor,
];
export default routes;
