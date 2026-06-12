import { LayoutDashboard, CarFront, Inbox, BarChart3, User, CreditCard } from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const nav = [
  { to: "/dealer/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/dealer/vehicles", label: "Vehicles", icon: <CarFront className="h-4 w-4" /> },
  { to: "/dealer/leads", label: "Leads", icon: <Inbox className="h-4 w-4" /> },
  { to: "/dealer/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { to: "/dealer/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { to: "/dealer/subscription", label: "Subscription", icon: <CreditCard className="h-4 w-4" /> },
];

export default function DealerLayout() {
  return <DashboardLayout title="Dealer Portal" nav={nav} accentLabel="Dealer" />;
}
