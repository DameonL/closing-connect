import vendorRoutes from "./vendor";
import openVendor from "./openVendor";
import search from "./search";
import { AzureHttpRoute, AzureCosmosRoute } from "../AzureRoutes";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...vendorRoutes,
  ...openVendor,
  ...search
];
export default routes;
