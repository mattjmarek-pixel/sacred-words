import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export const AUTH_TOKEN_KEY = "auth_session_token";

export const tokenStore = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
const ISSUER_URL = process.env.EXPO_PUBLIC_ISSUER_URL ?? "https://replit.com/oidc";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
  }
  return "";
}

function getClientId(): string {
  return process.env.EXPO_PUBLIC_REPL_ID || "";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isWeb = Platform.OS === "web";

  const discovery = AuthSession.useAutoDiscovery(ISSUER_URL);

  const redirectUri = AuthSession.makeRedirectUri(
    isWeb ? {} : { scheme: "sacredwords" },
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      scopes: ["openid", "email", "profile", "offline_access"],
      redirectUri: isWeb ? "" : redirectUri,
      prompt: AuthSession.Prompt.Login,
    },
    isWeb ? null : discovery,
  );

  const exchangedCode = useRef<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const token = await tokenStore.get(AUTH_TOKEN_KEY);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      } else {
        await tokenStore.remove(AUTH_TOKEN_KEY);
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isWeb) return;
    if (response?.type !== "success" || !request?.codeVerifier) return;

    const { code, state } = response.params;
    if (exchangedCode.current === code) return;
    exchangedCode.current = code;

    (async () => {
      try {
        const apiBase = getApiBaseUrl();
        if (!apiBase) {
          console.error("API base URL is not configured.");
          return;
        }

        const exchangeRes = await fetch(`${apiBase}/api/mobile-auth/token-exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            code_verifier: request.codeVerifier,
            redirect_uri: redirectUri,
            state,
            nonce: (request as unknown as Record<string, unknown>).nonce as string | undefined,
          }),
        });

        if (!exchangeRes.ok) {
          console.error("Token exchange failed:", exchangeRes.status);
          setIsLoading(false);
          return;
        }

        const data = await exchangeRes.json();
        if (data.token) {
          await tokenStore.set(AUTH_TOKEN_KEY, data.token);
          setIsLoading(true);
          await fetchUser();
        }
      } catch (err) {
        console.error("Token exchange error:", err);
        setIsLoading(false);
      }
    })();
  }, [isWeb, response, request, redirectUri, fetchUser]);

  const login = useCallback(async () => {
    if (isWeb) {
      const apiBase = getApiBaseUrl();
      if (!apiBase) {
        console.error("[auth] EXPO_PUBLIC_DOMAIN is not set — web login will not work.");
        return;
      }

      return new Promise<void>((resolve) => {
        const loginUrl = `${apiBase}/api/login?mode=popup`;
        const popup = window.open(loginUrl, "sacred-words-login", "width=520,height=640");

        if (!popup) {
          console.error("[auth] Popup was blocked — ask the user to allow popups for this site.");
          resolve();
          return;
        }

        const trustedOrigin = new URL(apiBase).origin;

        function handleMessage(event: MessageEvent) {
          if (event.origin !== trustedOrigin) return;
          if (event.source !== popup) return;
          if (
            !event.data ||
            event.data.type !== "auth-complete" ||
            typeof event.data.token !== "string"
          ) {
            return;
          }
          cleanup();
          tokenStore.set(AUTH_TOKEN_KEY, event.data.token).then(() => {
            setIsLoading(true);
            fetchUser().then(resolve);
          });
        }

        function cleanup() {
          window.removeEventListener("message", handleMessage);
          clearInterval(closedPoll);
        }

        const closedPoll = setInterval(() => {
          if (popup.closed) {
            cleanup();
            resolve();
          }
        }, 500);

        window.addEventListener("message", handleMessage);
      });
    }

    try {
      await promptAsync();
    } catch (err) {
      console.error("Login error:", err);
    }
  }, [isWeb, promptAsync, fetchUser]);

  const logout = useCallback(async () => {
    try {
      const token = await tokenStore.get(AUTH_TOKEN_KEY);
      if (token) {
        const apiBase = getApiBaseUrl();
        await fetch(`${apiBase}/api/mobile-auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
    } finally {
      await tokenStore.remove(AUTH_TOKEN_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
