import { HTTPMethod } from "@azure/cosmos";
import { app } from "@azure/functions";
import vendorGet from "./get";
import { AzureHttpRoute } from "closing-connect/AzureRoutes";

const route = "openVendor";
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
