import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  /** Called after a successful real API login — builds AuthUser from decoded JWT */
  setUserFromToken: (role: AuthUser["role"], decoded: Record<string, unknown>) => void;
  logout: () => void;
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
    // Try admin first
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      return buildUser("admin", JSON.parse(adminData));
    }
    // Then dealer
    const dealerData = localStorage.getItem("dealerData");
    if (dealerData) {
      return buildUser("dealer", JSON.parse(dealerData));
    }
  } catch {
    // corrupted storage
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreUser);

  // Keep session alive across refreshes
  useEffect(() => {
    const restored = restoreUser();
    if (restored) setUser(restored);
  }, []);

  const setUserFromToken = useCallback(
    (role: AuthUser["role"], decoded: Record<string, unknown>) => {
      setUser(buildUser(role, decoded));
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("dealerToken");
    localStorage.removeItem("dealerData");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUserFromToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
