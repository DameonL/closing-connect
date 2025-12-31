const isDevelopment = (import.meta as any).env.MODE === "development";

export const msalConfig = {
  auth: {
    clientId: "7a31ed6d-49fa-44a8-b592-1edc1d046073",
    authority: "https://closingconnect.ciamlogin.com/closingconnect.onmicrosoft.com/v2.0/",
    redirectUri: "https://www.closing-connect.com/LoginSuccess",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

export const scopes = [
  "openid",
  "profile",
  "offline_access",
  "api://7a31ed6d-49fa-44a8-b592-1edc1d046073/ClosingConnect"
];

export const loginRequest = { scopes };

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};