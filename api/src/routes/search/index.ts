import { HTTPMethod } from "@azure/cosmos";
import { app } from "@azure/functions";
import { AzureHttpRoute } from "../../AzureRoutes";
import searchGet from "./get";

const route = "search";
const routes: AzureHttpRoute[] = [
  {
    trigger: app.http,
    route,
    method: HTTPMethod.get,
    handler: searchGet,
    authLevel: "anonymous"
  },
];

export default routes;
