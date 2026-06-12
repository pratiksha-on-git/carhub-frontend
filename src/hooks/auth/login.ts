import * as React from "react";

type LoginPayload = {
  email: string;
  password: string;
};

/** Shape of the API response wrapper */
type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

/** Shape of the login data inside the response */
type LoginData = {
  token: string;
};

export class LoginError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "LoginError";
    this.status = status;
  }
}

/** Decode a JWT payload without any external library */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export function useLogin() {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  /**
   * Unified login — hits POST /api/auth/login.
   * Decodes the JWT to determine role ("ADMIN" or "DEALER")
   * and stores the token + decoded data in localStorage.
   */
  const login = React.useCallback(async (payload: LoginPayload) => {
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body: ApiResponse<LoginData> | null = null;
      try {
        body = await response.json();
      } catch {
        throw new LoginError("Server returned an invalid response.", response.status);
      }

      if (!response.ok || !body?.data?.token) {
        throw new LoginError(
          body?.message ?? "Login failed",
          body?.status ?? response.status,
        );
      }

      const token = body.data.token;
      const decoded = decodeJwtPayload(token);

      // Role is stored as "ADMIN" or "DEALER" (or "ROLE_ADMIN" etc.) in the JWT
      const rawRole = String(
        decoded.role ?? decoded.roles ?? decoded.authority ?? "",
      ).toUpperCase();

      const isAdmin =
        rawRole.includes("ADMIN") ||
        (Array.isArray(decoded.roles) &&
          (decoded.roles as string[]).some((r) =>
            r.toUpperCase().includes("ADMIN"),
          ));

      if (isAdmin) {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(decoded));
        // Clear any stale dealer session
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerData");
        return { role: "admin" as const, token, data: decoded };
      } else {
        localStorage.setItem("dealerToken", token);
        localStorage.setItem("dealerData", JSON.stringify(decoded));
        // Clear any stale admin session
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        return { role: "dealer" as const, token, data: decoded };
      }
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { isLoggingIn, login };
}
