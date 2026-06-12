import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/** Read logged-in user's display name from localStorage */
function getLoggedInName(): string {
  try {
    const adminRaw = localStorage.getItem("adminData");
    if (adminRaw) {
      const d = JSON.parse(adminRaw);
      return String(d.fullName ?? d.name ?? d.email ?? "Admin");
    }
    const dealerRaw = localStorage.getItem("dealerData");
    if (dealerRaw) {
      const d = JSON.parse(dealerRaw);
      return String(d.businessName ?? d.ownerName ?? d.name ?? d.email ?? "Dealer");
    }
  } catch { /* ignore */ }
  return "";
}

function clearAuth() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
  localStorage.removeItem("dealerToken");
  localStorage.removeItem("dealerData");
}

export interface NavItem { to: string; label: string; icon: ReactNode; }

interface Props {
  title: string;
  nav: NavItem[];
  accentLabel: string;
}

export default function DashboardLayout({ title, nav, accentLabel }: Props) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const displayName = getLoggedInName();
  const navigate = useNavigate();
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login", { replace: true });
  };

  const SidebarBody = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
            <Car className="h-5 w-5" />
          </div>
          <div className="font-display font-black text-base leading-none">
            AutoHub <span className="text-accent">{accentLabel}</span>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "gradient-primary text-white shadow-card" : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`
            }
          >
            {n.icon}
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="px-2 py-2 text-xs text-muted-foreground">
          Signed in as<br /><span className="font-semibold text-foreground">{displayName}</span>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border">
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
          <h1 className="font-display font-bold text-lg truncate">{title}</h1>
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
