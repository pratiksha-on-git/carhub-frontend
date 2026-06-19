import * as React from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

// ── JWT decoder (no external lib) ────────────────────────────────────────────
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CustomerUser {
  customerName: string;
  mobile: string;
  customerCity: string;
  email: string;
  token: string;
  decoded: Record<string, unknown>;
}

const STORAGE_KEY = "customerUser";

// ── Storage helpers ───────────────────────────────────────────────────────────
export function getStoredCustomer(): CustomerUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerUser) : null;
  } catch {
    return null;
  }
}

export function clearCustomer() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Register — only hits API, stores NOTHING ──────────────────────────────────
type RegisterPayload = {
  customerName: string;
  mobile: string;
  customerCity: string;
  email: string;
  password: string;
};

export function useCustomerRegister() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const register = React.useCallback(async (payload: RegisterPayload): Promise<void> => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/customer/register", payload);
      // ✅ No localStorage writes here — user must login after registering
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new Error(body?.message ?? "Registration failed");
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, register };
}

// ── Login — hits API, decodes JWT, stores everything ─────────────────────────
type LoginPayload = { email: string; password: string };

export function useCustomerLogin() {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const login = React.useCallback(async (payload: LoginPayload): Promise<CustomerUser> => {
    setIsLoggingIn(true);
    try {
      const { data: body } = await apiClient.post<{
        status: number;
        message: string;
        data: { token: string; customerName?: string; mobile?: string; customerCity?: string };
      }>("/api/auth/login", payload);

      const token = body?.data?.token;
      if (!token) throw new Error(body?.message ?? "Login failed — no token received");

      const decoded = decodeJwt(token);

      const user: CustomerUser = {
        customerName:
          body.data?.customerName ??
          (decoded.customerName as string) ??
          (decoded.name as string) ??
          (decoded.sub as string) ??
          "",
        mobile:
          body.data?.mobile ??
          (decoded.mobile as string) ??
          "",
        customerCity:
          body.data?.customerCity ??
          (decoded.customerCity as string) ??
          (decoded.city as string) ??
          "",
        email: payload.email,
        token,
        decoded,
      };

      // ✅ Store token + decoded data + profile only on login
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("customerToken", token);
      localStorage.setItem("customerDecoded", JSON.stringify(decoded));

      return user;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new Error(body?.message ?? "Login failed");
      }
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { isLoggingIn, login };
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
const WISHLIST_KEY = "customerWishlist";

export function getWishlist(): number[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(id: number): number[] {
  const list = getWishlist();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  return next;
}
