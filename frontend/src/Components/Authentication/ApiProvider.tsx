import objectHash from "object-hash";
import { createContext, h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { useAuth } from "./AuthenticationProvider";

export enum ApiRoute {
  OpenVendor = "openVendor",
  Vendor = "vendor",
}

export enum ApiMethod {
  get = "GET",
  post = "POST",
  delete = "DELETE",
  put = "PUT",
  patch = "PATCH",
}

export interface ApiRequest<T = any> {
  route: ApiRoute;
  method: ApiMethod;
  query?: URLSearchParams;
  body?: T;
}

type ApiContextType = {
  sendRequest: <T>(request: ApiRequest) => Promise<T | undefined>;
  invalidateCache: (
    request:
      | ApiRequest
      | {
          route: ApiRoute;
          invalidateItem: (item: Response) => boolean | Promise<boolean>;
        }
  ) => Promise<void>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const parseCacheControl = (cacheControl: string | null) => {
  if (!cacheControl) return null;

  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  if (!maxAgeMatch) return null;

  return parseInt(maxAgeMatch[1], 10);
};

function hasBody(response: Response) {
  return response.headers.get("Content-Type")?.includes("application/json");
}

async function tryGetBody(response: Response) {
  if (hasBody(response)) return await response.json();
}

const CACHE_VERSION = 1;

export function ApiProvider({ children }: { children: preact.ComponentChildren }) {
  const { getToken } = useAuth();
  const backendURL = "https://payoffs.azurewebsites.net/api/";

  const getRouteUrl = useCallback((request: ApiRequest) => {
    if (request.query) {
      request.query.sort();
    }
    return `${backendURL}${request.route}${request.query ? `?${request.query}` : ""}`;
  }, []);

  const getHeaders = useCallback(async () => {
    const headers = new Headers();
    const apiToken = await getToken();
    if (apiToken) {
      headers.append("Authorization", `Bearer ${apiToken}`);
    }
    return headers;
  }, [getToken]);

  const invalidateCache = useCallback(
    async (
      request:
        | ApiRequest
        | {
            route: ApiRoute;
            invalidateItem: (item: Response) => boolean | Promise<boolean>;
          }
    ) => {
      if (!caches) return;

      const cache = await caches.open(`${request.route}_v${CACHE_VERSION}`);

      if ("invalidateItem" in request) {
        const cached = await cache.matchAll();
        for (const item of cached) {
          if (await request.invalidateItem(item)) {
            cache.delete(item.url);
          }
        }
      } else {
        const routeUrl = getRouteUrl(request);
        await cache.delete(routeUrl);
      }
    },
    [getRouteUrl]
  );

  const sendRequest = useCallback(
    async <T,>(request: ApiRequest): Promise<T | undefined> => {
      const routeUrl = getRouteUrl(request);
      const cacheUrl = `${routeUrl}${request.body ? `_${objectHash(request.body)}` : ""}`;
      const cache = caches ? await caches.open(`${request.route}_v${CACHE_VERSION}`) : undefined;

      let cachedResponse: Response | undefined;
      if (cache) {
        cachedResponse = await cache.match(cacheUrl);
        if (cachedResponse) {
          const cacheControl = cachedResponse.headers.get("Cache-Control");
          const cachedAtHeader = cachedResponse.headers.get("Date");
          const maxAge = parseCacheControl(cacheControl);

          if (maxAge !== null) {
            const cachedAt = cachedAtHeader ? new Date(cachedAtHeader).valueOf() : Date.now();
            const expiresAt = cachedAt + maxAge * 1000;
            if (expiresAt > Date.now()) {
              return await tryGetBody(cachedResponse);
            }
          }
        }
      }

      let response: Response | undefined;
      let responseJson: T | undefined;
      let retries = 3;

      while (retries > 0) {
        try {
          const headers = await getHeaders();
          const requestOptions: RequestInit = {
            method: request.method,
            headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
          };

          // Revalidation for no-cache
          if (cachedResponse) {
            const etag = cachedResponse.headers.get("ETag");
            const lastModified = cachedResponse.headers.get("Last-Modified");

            if (etag) {
              headers.append("If-None-Match", etag);
            }
            if (lastModified) {
              headers.append("If-Modified-Since", lastModified);
            }
          }

          response = await fetch(routeUrl, requestOptions);

          if (response.status === 304) {
            // Not Modified, return the cached body
            if (cachedResponse) {
              return await tryGetBody(cachedResponse);
            }
          }

          if (response.status === 401 && retries > 1) {
            await getToken();
            retries--;
            continue;
          }

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          if (hasBody(response)) {
            responseJson = await response.clone().json();
          }

          const cacheControl = response.headers.get("Cache-Control");
          if (cache && cacheControl && !/no-store/i.test(cacheControl)) {
            const headers = new Headers(response.headers);
            if (!headers.has("Date")) {
              headers.append("Date", new Date().toUTCString());
            }

            const cacheResponse = response.clone();
            const body = await cacheResponse.blob();

            const responseToCache = new Response(body, {
              status: response.status,
              statusText: response.statusText,
              headers: headers,
            });

            await cache.put(cacheUrl, responseToCache);
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
    invalidateCache,
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
