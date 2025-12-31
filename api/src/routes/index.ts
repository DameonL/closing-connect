import vendorRoutes from "./vendor";
import { AzureHttpRoute, AzureCosmosRoute } from "../AzureRoutes";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...vendorRoutes,
];
export default routes;
