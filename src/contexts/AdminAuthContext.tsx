import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@/types";

interface AdminAuthContextValue {
  user: AuthUser | null;
  setUserFromToken: (decoded: Record<string, unknown>) => void;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function buildAdmin(decoded: Record<string, unknown>): AuthUser {
  return {
    id: String(decoded.id ?? decoded.sub ?? ""),
    name: String(decoded.fullName ?? decoded.name ?? decoded.email ?? "Admin"),
    email: String(decoded.email ?? decoded.sub ?? ""),
    role: "admin",
  };
}

function restoreAdmin(): AuthUser | null {
  try {
    const raw = localStorage.getItem("adminData");
    if (raw) return buildAdmin(JSON.parse(raw));
  } catch { /* ignore */ }
  return null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreAdmin);

  const setUserFromToken = useCallback((decoded: Record<string, unknown>) => {
    setUser(buildAdmin(decoded));
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("adminToken") ?? "";
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { /* ignore */ }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, setUserFromToken, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
