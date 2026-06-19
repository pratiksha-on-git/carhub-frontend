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
import DealerVehicles from "@/pages/dealer/vehicle/Vehicles";
import DealerVehicleDetails from "@/pages/dealer/vehicle/VehicleDetails";
import DealerLeads from "@/pages/dealer/Leads";
import DealerProfile from "@/pages/dealer/Profile";

import DealerSubscription from "@/pages/dealer/subscription/Subscription";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDealers from "@/pages/admin/Dealers";
import AdminVehicles from "@/pages/admin/Vehicles";
import AdminLeads from "@/pages/admin/Leads";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminAdvertisements from "@/pages/admin/Advertisements";
import AdminReports from "@/pages/admin/Reports";



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

          {/* Dealer */}
          <Route element={<ProtectedRoute allow={["dealer"]} />}>
            <Route path="/dealer" element={<DealerLayout />}>
              <Route index element={<Navigate to="/dealer/dashboard" replace />} />
              <Route path="dashboard" element={<DealerDashboard />} />
              <Route path="vehicles" element={<DealerVehicles />} />
              <Route path="vehicles/:vehicleId" element={<DealerVehicleDetails />} />
              <Route path="leads" element={<DealerLeads />} />
              <Route path="profile" element={<DealerProfile />} />
            
              <Route path="subscription" element={<DealerSubscription />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allow={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="dealers" element={<AdminDealers />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="advertisements" element={<AdminAdvertisements />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Route>



          {/* 404 inside the public layout shell */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
