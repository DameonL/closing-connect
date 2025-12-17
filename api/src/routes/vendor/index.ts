import { HTTPMethod } from "@azure/cosmos";
import { app } from "@azure/functions";
import vendorDelete from "./delete";
import vendorGet from "./get";
import vendorPost from "./post";
import { AzureHttpRoute } from "../../AzureRoutes";

const route = "vendor";
const routes: AzureHttpRoute[] = [
  {
    trigger: app.http,
    route,
    method: HTTPMethod.get,
    handler: vendorGet,
  },
  {
    trigger: app.http,
    route,
    method: HTTPMethod.post,
    handler: vendorPost
  },
  {
    trigger: app.http,
    route,
    method: HTTPMethod.delete,
    handler: vendorDelete
  },
];

export default routes;
