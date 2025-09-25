import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  PublicClientApplication,
} from "@azure/msal-browser";
import { createContext, h } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";
import { loginRequest, msalConfig } from "./msalConfig";

export type AuthContextType = {
  account: AccountInfo | undefined;
  token: string | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | undefined;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthenticationProvider({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  const [account, setAccount] = useState<AccountInfo | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const msalInstance = useMemo(
    () => new PublicClientApplication(msalConfig),
    []
  );

  const acquireAccessTokenSilently = async (
    instance: PublicClientApplication
  ): Promise<string | undefined> => {
    if (!account) return undefined;

    try {
      const result = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      setToken(result.accessToken);
      return result.accessToken;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return undefined;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await msalInstance.initialize();
        const activeAccount = msalInstance.getActiveAccount();
        if (activeAccount) {
          msalInstance.setActiveAccount(activeAccount);
          setAccount(activeAccount);
          await acquireAccessTokenSilently(msalInstance);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [msalInstance]);

  const login = async () => {
    if (!msalInstance) return;
    let account = msalInstance.getAllAccounts()[0];
    if (account) {
      msalInstance.setActiveAccount(account);
    }

    setIsLoading(true);
    setError(undefined);

    try {
      let result: AuthenticationResult | undefined;
      if (account) {
        try {
          result = await msalInstance.acquireTokenSilent(loginRequest);
        } catch (silentError) { }
      }

      if (!result) {
        result = await msalInstance.loginPopup(loginRequest);
      }

      msalInstance.setActiveAccount(result.account);
      setAccount(result.account);
      setToken(result.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!msalInstance) return;

    setIsLoading(true);
    try {
      await msalInstance.logoutPopup();
      msalInstance.setActiveAccount(null);
      setAccount(undefined);
      setToken(undefined);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (token) {
      return token;
    }
    if (!account || !msalInstance) return undefined;
    const newToken = await acquireAccessTokenSilently(msalInstance);
    return newToken;
  }, [token, account, msalInstance]);

  const value: AuthContextType = {
    account,
    token,
    login,
    logout,
    getToken,
    isAuthenticated: !!account,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
