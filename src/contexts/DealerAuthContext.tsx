import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@/types";

interface DealerAuthContextValue {
  user: AuthUser | null;
  setUserFromToken: (decoded: Record<string, unknown>) => void;
  updateUserFields: (fields: Partial<Record<string, unknown>>) => void;
  logout: () => Promise<void>;
}

const DealerAuthContext = createContext<DealerAuthContextValue | null>(null);

function buildDealer(decoded: Record<string, unknown>): AuthUser {
  return {
    id: String(decoded.id ?? decoded.sub ?? ""),
    name: String(decoded.businessName ?? decoded.ownerName ?? decoded.name ?? decoded.email ?? "Dealer"),
    email: String(decoded.email ?? decoded.sub ?? ""),
    role: "dealer",
    dealerId: decoded.dealerId ? String(decoded.dealerId) : undefined,
  };
}

function restoreDealer(): AuthUser | null {
  try {
    const raw = localStorage.getItem("dealerData");
    if (raw) return buildDealer(JSON.parse(raw));
  } catch { /* ignore */ }
  return null;
}

export function DealerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreDealer);

  const setUserFromToken = useCallback((decoded: Record<string, unknown>) => {
    setUser(buildDealer(decoded));
  }, []);

  const updateUserFields = useCallback((fields: Partial<Record<string, unknown>>) => {
    try {
      const existing = JSON.parse(localStorage.getItem("dealerData") || "{}");
      const merged = { ...existing, ...fields };
      localStorage.setItem("dealerData", JSON.stringify(merged));
      setUser((prev) => prev ? { ...prev, name: String(fields.businessName ?? fields.ownerName ?? prev.name) } : prev);
    } catch { /* ignore */ }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("dealerToken") ?? "";
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { /* ignore */ }
    localStorage.removeItem("dealerToken");
    localStorage.removeItem("dealerData");
    setUser(null);
  }, []);

  return (
    <DealerAuthContext.Provider value={{ user, setUserFromToken, updateUserFields, logout }}>
      {children}
    </DealerAuthContext.Provider>
  );
}

export function useDealerAuth() {
  const ctx = useContext(DealerAuthContext);
  if (!ctx) throw new Error("useDealerAuth must be used within DealerAuthProvider");
  return ctx;
}
