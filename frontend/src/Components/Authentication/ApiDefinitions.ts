const isDevelopment = (import.meta as any).env.MODE === "development";

export const ApiDefinitions = {
  public: {
    url: "https://api-public-degsd2eqfke0d7gm.westus2-01.azurewebsites.net/",
    routes: ["vendor", "search"]
  },
  private: {
    url: isDevelopment ? "https://api-private-enezg8cye2dcfkdh.westus2-01.azurewebsites.net/" : "https://api.closing-connect.com/",
    routes: ["vendor", "search"]
  }
} as const;

export type PublicRoutes = typeof ApiDefinitions.public.routes[number];
export type PrivateRoutes = typeof ApiDefinitions.private.routes[number];

export type ApiRoute = PublicRoutes | PrivateRoutes;
