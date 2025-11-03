export const msalConfig = {
  auth: {
    clientId: "36148247-7edd-499a-b4d2-6f37380a4f57",
    authority: "https://login.microsoftonline.com/f02557e2-0f9a-4a24-8388-cac48fdc9332",
    redirectUri: "https:/www.closing-connect.com/LoginSuccess",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
 scopes: ["User.Read", "offline_access", "api://36148247-7edd-499a-b4d2-6f37380a4f57/Invoke"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};