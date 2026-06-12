import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthRole } from "@/types";

export function ProtectedRoute({ allow }: { allow: AuthRole[] }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}
