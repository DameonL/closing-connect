export const msalConfig = {
  auth: {
    clientId: "36148247-7edd-499a-b4d2-6f37380a4f57",
    // clientId: "7a31ed6d-49fa-44a8-b592-1edc1d046073",
    authority: "https://login.microsoftonline.com/f02557e2-0f9a-4a24-8388-cac48fdc9332",
    // authority: "https://closingconnect.ciamlogin.com/closingconnect.onmicrosoft.com/v2.0/",
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
  "api://7a31ed6d-49fa-44a8-b592-1edc1d046073/ClosingConnect",
]; // Not currently used, here in preparation for update. After update switch loginRequest to use these scopes.

export const loginRequest = {
 scopes: ["User.Read", "offline_access", "api://36148247-7edd-499a-b4d2-6f37380a4f57/Invoke"]
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};