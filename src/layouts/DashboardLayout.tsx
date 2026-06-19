import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, LogOut, Menu } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";

export interface NavItem { to: string; label: string; icon: ReactNode; }

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

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const SidebarBody = () => (
    <div className="flex h-full flex-col" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)" }}>
      <div className="h-16 flex items-center gap-2 px-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-white">
            <Car className="h-5 w-5" />
          </div>
          <div className="font-display font-black text-base leading-none text-white">
            AutoHub <span className="text-sky-400">{accentLabel}</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-500 text-white shadow-sm border border-sky-400/40"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            {n.icon}
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="px-2 py-2 text-xs text-white/50">
          Signed in as<br /><span className="font-semibold text-white/80">{email}</span>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-white/10" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-0 h-screen"><SidebarBody /></div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-card sticky top-0 z-30 flex items-center px-4 gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72"><SidebarBody /></SheetContent>
          </Sheet>
          <div className="inline-flex flex-col ">
            <span className="text-sm font-regular uppercase  text-gray-500">
              {title}
            </span>

            <h1 className="font-extrabold capitalize text-sm leading-none text-slate-900">
              {displayName}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/">View site</Link></Button>
          </div>
        </header>
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
