import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loginAsDealer: () => void;
  loginAsAdmin: () => void;
  login: (email: string, password: string) => { ok: boolean; role?: AuthUser["role"] };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginAsDealer = useCallback(() => {
    setUser({ id: "u-dealer", name: "Rajesh Sharma", email: "dealer@autohub.in", role: "dealer", dealerId: "d1" });
  }, []);
  const loginAsAdmin = useCallback(() => {
    setUser({ id: "u-admin", name: "Admin", email: "admin@autohub.in", role: "admin" });
  }, []);

  const login = useCallback((email: string, _password: string) => {
    if (email === "admin@autohub.in") {
      setUser({ id: "u-admin", name: "Admin", email, role: "admin" });
      return { ok: true, role: "admin" as const };
    }
    setUser({ id: "u-dealer", name: "Rajesh Sharma", email, role: "dealer", dealerId: "d1" });
    return { ok: true, role: "dealer" as const };
  }, []);

  const logout = useCallback(() => setUser(null), []);
  return (
    <AuthContext.Provider value={{ user, loginAsDealer, loginAsAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
