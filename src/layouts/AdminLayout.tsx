import {
  LayoutDashboard,
  Users,
  CarFront,
  Inbox,
  CreditCard,
  Megaphone,
  FileBarChart,
  MessageSquare,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const nav = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/admin/dealers",
    label: "Dealers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    to: "/admin/vehicles",
    label: "Vehicles",
    icon: <CarFront className="h-4 w-4" />,
  },
  { to: "/admin/leads", label: "Leads", icon: <Inbox className="h-4 w-4" /> },
  {
    to: "/admin/subscriptions",
    label: "Subscriptions",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    to: "/admin/chat",
    label: "Chat",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: <FileBarChart className="h-4 w-4" />,
  },
];

export default function AdminLayout() {
  return (
    <DashboardLayout title="Admin Dashboard" nav={nav} accentLabel="Admin" />
  );
}
