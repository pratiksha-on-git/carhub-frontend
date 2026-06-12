import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

import PublicLayout from "@/layouts/PublicLayout";
import DealerLayout from "@/layouts/DealerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

import Home from "@/pages/public/Home";
import Cars from "@/pages/public/Cars";
import CarDetails from "@/pages/public/CarDetails";
import Dealers from "@/pages/public/Dealers";
import SubscriptionPlans from "@/pages/public/SubscriptionPlans";
import Contact from "@/pages/public/Contact";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";

import DealerDashboard from "@/pages/dealer/Dashboard";
import DealerVehicles from "@/pages/dealer/Vehicles";
import DealerVehicleForm from "@/pages/dealer/VehicleForm";
import DealerLeads from "@/pages/dealer/Leads";
import DealerProfile from "@/pages/dealer/Profile";
import DealerAnalytics from "@/pages/dealer/Analytics";
import DealerSubscription from "@/pages/dealer/Subscription";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDealers from "@/pages/admin/Dealers";
import AdminVehicles from "@/pages/admin/Vehicles";
import AdminLeads from "@/pages/admin/Leads";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminAdvertisements from "@/pages/admin/Advertisements";
import AdminReports from "@/pages/admin/Reports";

/**
 * Demo helper: when arriving at /dealer or /admin without a session,
 * auto-sign-in as the matching role so the dashboards are explorable.
 */
function DemoAuthBridge({ role, children }: { role: "dealer" | "admin"; children: React.ReactNode }) {
  const { user, loginAsDealer, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      if (role === "dealer") loginAsDealer();
      else loginAsAdmin();
    } else if (user.role !== role) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, role, loginAsDealer, loginAsAdmin, navigate]);
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car/:slug" element={<CarDetails />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Dealer (demo-auto-login for showcase) */}
          <Route path="/dealer" element={<DemoAuthBridge role="dealer"><DealerLayout /></DemoAuthBridge>}>
            <Route index element={<Navigate to="/dealer/dashboard" replace />} />
            <Route path="dashboard" element={<DealerDashboard />} />
            <Route path="vehicles" element={<DealerVehicles />} />
            <Route path="vehicles/add" element={<DealerVehicleForm />} />
            <Route path="vehicles/edit/:id" element={<DealerVehicleForm />} />
            <Route path="leads" element={<DealerLeads />} />
            <Route path="profile" element={<DealerProfile />} />
            <Route path="analytics" element={<DealerAnalytics />} />
            <Route path="subscription" element={<DealerSubscription />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<DemoAuthBridge role="admin"><AdminLayout /></DemoAuthBridge>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="dealers" element={<AdminDealers />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="advertisements" element={<AdminAdvertisements />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Real protected (used after explicit login) */}
          <Route element={<ProtectedRoute allow={["dealer"]} />}>
            {/* future protected dealer-only routes */}
          </Route>

          <Route path="*" element={
            <PublicLayout>
              {/* fallback inside layout via outlet not used; render NotFound via element-only */}
            </PublicLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
