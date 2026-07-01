import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, LogOut, Menu } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface Props {
  title: string;
  nav: NavItem[];
  accentLabel: string;
}

export default function DashboardLayout({ title, nav, accentLabel }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const adminAuth = useAdminAuth();
  const dealerAuth = useDealerAuth();
  const { user, logout } = isAdmin ? adminAuth : dealerAuth;
  const displayName = user?.name ?? "";
  const email = user?.email ?? "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const SidebarBody = () => (
    <div
      className="flex h-full flex-col font-sans text-left bg-black"

    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Logo Circle Badge */}

          <div className="font-display font-black text-base text-white tracking-tight ml-1 flex items-center">
            Caryanam

          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/15 border border-rose-400/20"
                : "text-slate-400 hover:text-white hover:border-rose-400 hover:border hover:shadow-lg hover:bg-white/5"
              }`
            }
          >
            <span className="shrink-0">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Signed in as
          <br />
          <span className="font-semibold text-slate-300 normal-case text-xs tracking-normal block mt-0.5 truncate">
            {email}
          </span>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-rose-400 hover:text-rose-300 hover:bg-white/5 rounded-xl mt-3 cursor-pointer h-10 font-bold text-xs uppercase tracking-wider"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar Static (lg+) */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-xl z-20">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Navbar header */}
        <header className="h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-5 w-5 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-0">
              <SidebarBody />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb Info */}
          <div className="inline-flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">
              {title}
            </span>
            <h1 className="font-display text-base font-black capitalize text-slate-900 tracking-tight mt-0.5">
              {displayName}
            </h1>
          </div>
        </header>

        {/* Dynamic page transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
