import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { AuthRole } from "@/types";

/** Read the current user's role from localStorage tokens */
function getCurrentRole(): AuthRole | null {
  if (localStorage.getItem("adminToken")) return "admin";
  if (localStorage.getItem("dealerToken")) return "dealer";
  return null;
}

export function ProtectedRoute({ allow }: { allow: AuthRole[] }) {
  const location = useLocation();
  const role = getCurrentRole();

  if (!role || !allow.includes(role)) {
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
