const isDevelopment = (import.meta as any).env.MODE === "development";

export const ApiDefinitions = {
  public: {
    url: "https://api-public.closing-connect.com/",
    routes: ["vendor", "search"]
  },
  private: {
    url: "https://api-private.closing-connect.com/",
    routes: ["vendor"]
  }
} as const;

export type PublicRoutes = typeof ApiDefinitions.public.routes[number];
export type PrivateRoutes = typeof ApiDefinitions.private.routes[number];

export type ApiRoute = PublicRoutes | PrivateRoutes;
