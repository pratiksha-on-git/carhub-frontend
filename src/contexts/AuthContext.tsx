import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";
import apiClient from "@/lib/apiClient";

interface AuthContextValue {
  user: AuthUser | null;
  /** Called after a successful real API login — builds AuthUser from decoded JWT */
  setUserFromToken: (role: AuthUser["role"], decoded: Record<string, unknown>) => void;
  /** Patch specific fields in localStorage + in-memory user (e.g. after profile update) */
  updateUserFields: (fields: Partial<Record<string, unknown>>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Build an AuthUser from a decoded JWT payload */
function buildUser(
  role: AuthUser["role"],
  decoded: Record<string, unknown>,
): AuthUser {
  return {
    id: String(decoded.id ?? decoded.sub ?? ""),
    name: String(
      decoded.businessName ??
      decoded.ownerName ??
      decoded.name ??
      decoded.email ??
      role,
    ),
    email: String(decoded.email ?? decoded.sub ?? ""),
    role,
    dealerId: decoded.dealerId ? String(decoded.dealerId) : undefined,
  };
}

/** Try to restore session from localStorage on page load */
function restoreUser(): AuthUser | null {
  try {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      const adminData = localStorage.getItem("adminData");
      if (adminData) return buildUser("admin", JSON.parse(adminData));
    }
    const dealerData = localStorage.getItem("dealerData");
    if (dealerData) return buildUser("dealer", JSON.parse(dealerData));
    const adminData = localStorage.getItem("adminData");
    if (adminData) return buildUser("admin", JSON.parse(adminData));
  } catch { /* corrupted storage */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreUser);

  // Keep session alive across refreshes
  useEffect(() => {
    const restored = restoreUser();
    if (restored) setUser(restored);
  }, []);

  const updateUserFields = useCallback((fields: Partial<Record<string, unknown>>) => {
    const key = user?.role === "admin" ? "adminData" : "dealerData";
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      const merged = { ...existing, ...fields };
      localStorage.setItem(key, JSON.stringify(merged));
      setUser((prev) => prev ? { ...prev, name: String(fields.businessName ?? fields.ownerName ?? prev.name) } : prev);
    } catch { /* ignore */ }
  }, [user?.role]);

  const setUserFromToken = useCallback(
    (role: AuthUser["role"], decoded: Record<string, unknown>) => {
      // Always set the in-memory user to the one just logged in
      setUser(buildUser(role, decoded));
    },
    [],
  );

  const logout = useCallback(async () => {
    const isAdmin = user?.role === "admin";
    const token = isAdmin
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("dealerToken");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { /* ignore network errors — clear session regardless */ }
    if (isAdmin) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    } else {
      localStorage.removeItem("dealerToken");
      localStorage.removeItem("dealerData");
    }
    setUser(null);
  }, [user?.role]);

  return (
    <AuthContext.Provider value={{ user, setUserFromToken, updateUserFields, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
