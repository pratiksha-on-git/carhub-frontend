import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { AuthRole } from "@/types";

/** Check if a specific role's token exists in localStorage */
function hasRoleToken(role: AuthRole): boolean {
  if (role === "admin") return !!localStorage.getItem("adminToken");
  if (role === "dealer") return !!localStorage.getItem("dealerToken");
  return false;
}

export function ProtectedRoute({ allow }: { allow: AuthRole[] }) {
  const location = useLocation();

  // Allow access if ANY of the required roles has a valid token
  const isAllowed = allow.some(hasRoleToken);

  if (!isAllowed) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}
