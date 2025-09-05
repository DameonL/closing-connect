import vendorRoutes from "./vendor";
import openVendor from "./openVendor";
import { AzureHttpRoute, AzureCosmosRoute } from "../AzureRoutes";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...vendorRoutes,
  ...openVendor
];
export default routes;
