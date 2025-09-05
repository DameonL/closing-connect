import { app } from "@azure/functions";
import routes from "./routes";
import { AzureCosmosRoute, AzureHttpRoute } from "closing-connect/AzureRoutes";

const usedRoutes: { [id: string]: AzureHttpRoute | AzureCosmosRoute } = {};

for (const route of routes) {
  const routeId = "method" in route ? `${route.route}${route.method}` : route.route;
  if (routeId in usedRoutes) {
    console.error(`Route and method are used twice: "${routeId}"`);
    continue;
  }

  usedRoutes[routeId] = route;
  if ("method" in route) {
    app.http(routeId, {
      methods: [route.method],
      handler: route.handler,
      route: route.route,
      authLevel: route.authLevel ?? "anonymous",
    });
  } else {
    app.cosmosDB(routeId, { ...route.connection, handler: route.handler });
  }
}
