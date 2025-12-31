import { AzureCosmosRoute, AzureHttpRoute } from "../AzureRoutes";
import vendor from "./vendor";
import search from "./search";

const routes: (AzureHttpRoute | AzureCosmosRoute)[] = [
  ...vendor,
  ...search
];
export default routes;
