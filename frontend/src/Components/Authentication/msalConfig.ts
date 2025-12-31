const isDevelopment = (import.meta as any).env.MODE === "development";

export const msalConfig = {
  auth: {
    clientId: isDevelopment ? "7a31ed6d-49fa-44a8-b592-1edc1d046073" : "36148247-7edd-499a-b4d2-6f37380a4f57",
    // clientId: "7a31ed6d-49fa-44a8-b592-1edc1d046073", -- New tenant clientId
    authority: isDevelopment ? "https://closingconnect.ciamlogin.com/closingconnect.onmicrosoft.com/v2.0/" : "https://login.microsoftonline.com/f02557e2-0f9a-4a24-8388-cac48fdc9332",
    // authority: "https://closingconnect.ciamlogin.com/closingconnect.onmicrosoft.com/v2.0/",
    redirectUri: isDevelopment ? `${window.location.origin}/LoginSuccess` : "https://www.closing-connect.com/LoginSuccess",
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
  isDevelopment ? "api://7a31ed6d-49fa-44a8-b592-1edc1d046073/ClosingConnect" : "api://36148247-7edd-499a-b4d2-6f37380a4f57/Invoke"
];

export const loginRequest = { scopes };

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};