import {
  LayoutDashboard,
  CarFront,
  Inbox,
  BarChart3,
  User,
  CreditCard,
  Heart,
  MessageSquare,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";

const nav = [
  {
    to: "/dealer/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/dealer/vehicles",
    label: "Vehicles",
    icon: <CarFront className="h-4 w-4" />,
  },
  { to: "/dealer/leads", label: "Leads", icon: <Inbox className="h-4 w-4" /> },
  {
    to: "/dealer/wishlist",
    label: " Customer Wishlists",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    to: "/dealer/profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    to: "/dealer/chat",
    label: "Chat",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    to: "/dealer/subscription",
    label: "Subscription",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

export default function DealerLayout() {
  return (
    <DashboardLayout title="Dealer Dashboard" nav={nav} accentLabel="Dealer" />
  );
}
