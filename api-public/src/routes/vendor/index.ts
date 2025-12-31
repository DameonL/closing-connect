import { HTTPMethod } from "@azure/cosmos";
import { app } from "@azure/functions";
import { AzureHttpRoute } from "../../AzureRoutes";
import vendorGet from "./get";

const route = "vendor";
const routes: AzureHttpRoute[] = [
  {
    trigger: app.http,
    route,
    method: HTTPMethod.get,
    handler: vendorGet,
    authLevel: "anonymous"
  },
];

export default routes;
