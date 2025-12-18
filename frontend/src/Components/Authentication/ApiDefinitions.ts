export const ApiDefinitions = {
  public: {
    url: "https://api-public-degsd2eqfke0d7gm.westus2-01.azurewebsites.net/",
    routes: ["openVendor", "search"]
  },
  private: {
    url: "https://api.closing-connect.com/",
    routes: ["openVendor", "vendor", "search"]
  }
} as const;

export type PublicRoutes = typeof ApiDefinitions.public.routes[number];
export type PrivateRoutes = typeof ApiDefinitions.private.routes[number];

export type ApiRoute = PublicRoutes | PrivateRoutes;
