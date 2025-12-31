import { createContext, h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { useAuth } from "./AuthenticationProvider";
import { ApiDefinitions, PrivateRoutes, PublicRoutes } from "./ApiDefinitions";

export enum ApiMethod {
  get = "GET",
  post = "POST",
  delete = "DELETE",
  put = "PUT",
  patch = "PATCH",
}

export type ApiRequest<T = any> =
  | {
    route: PublicRoutes;
    method: ApiMethod;
    query?: URLSearchParams;
    body?: T;
    isPrivate?: false; // Optional, defaults to public
  }
  | {
    route: PrivateRoutes;
    method: ApiMethod;
    query?: URLSearchParams;
    body?: T;
    isPrivate: true; // Explicitly required for private routes
  };

type ApiContextType = {
  sendRequest: <T>(request: ApiRequest) => Promise<T | undefined>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

function hasBody(response: Response) {
  return response.headers.get("Content-Type")?.includes("application/json");
}

export function ApiProvider({ children }: { children: preact.ComponentChildren }) {
  const { getToken } = useAuth();

  const getRouteUrl = useCallback((request: ApiRequest) => {
    if (request.query) {
      request.query.sort();
    }
    return `${request.isPrivate ? ApiDefinitions.private.url : ApiDefinitions.public.url}${request.route}${request.query ? `?${request.query}` : ""}`;
  }, []);

  const getHeaders = useCallback(async (request: ApiRequest) => {
    const headers = new Headers();
    if (request.isPrivate) {
      const apiToken = await getToken();
      if (apiToken) {
        headers.append("Authorization", `Bearer ${apiToken}`);
      }
    }
    return headers;
  }, [getToken]);

  const sendRequest = useCallback(
    async <T,>(request: ApiRequest): Promise<T | undefined> => {
      const routeUrl = getRouteUrl(request);

      let response: Response | undefined;
      let responseJson: T | undefined;
      let retries = 3;

      while (retries > 0) {
        try {
          const headers = await getHeaders(request);
          const requestOptions: RequestInit = {
            method: request.method,
            headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
            cache: "no-store"
          };

          response = await fetch(routeUrl, requestOptions);

          if (response.status === 401 && retries > 1) {
            await getToken();
            retries--;
            continue;
          }

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          if (hasBody(response)) {
            responseJson = await response.json();
          }

          return responseJson;
        } catch (error) {
          console.error(error);
          retries--;
          if (retries === 0) {
            throw error instanceof Error ? error : new Error(String(error));
          }
        }
      }
    },
    [getRouteUrl, getHeaders, getToken]
  );

  const value = {
    sendRequest,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
