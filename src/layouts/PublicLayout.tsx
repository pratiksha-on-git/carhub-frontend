import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Car, X, Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Browse Cars" },

  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
              <Car className="h-5 w-5" />
            </div>
            <div className="font-display font-black text-lg leading-none">
              AutoHub <span className="text-accent">India</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-accent bg-accent/10" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth/login">Dealer Login</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex gradient-primary text-white border-0 hover:opacity-90">
              <Link to="/auth/register">Register Dealer</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-1 mt-8">
                  {nav.map((n) => (
                    <Link key={n.to} to={n.to} className="px-3 py-3 rounded-lg hover:bg-muted font-medium">
                      {n.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-3" />
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/auth/login">Dealer Login</Link>
                  </Button>
                  <Button asChild className="justify-start gradient-primary text-white border-0">
                    <Link to="/auth/register">Register Dealer</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="gradient-premium text-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent">
                <Car className="h-5 w-5" />
              </div>
              <div className="font-display font-black text-lg">AutoHub India</div>
            </div>
            <p className="text-sm text-white/70">India's most trusted used-car dealer marketplace. Verified inventory across 150+ cities.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/cars" className="hover:text-white">Browse Cars</Link></li>
    
              <li><Link to="/auth/register" className="hover:text-white">Dealer Registration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Reach us</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 1800 123 4567</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@autohub.in</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai · Delhi · Bangalore</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-white/50 flex flex-wrap gap-2 justify-between">
            <span>© {new Date().getFullYear()} AutoHub India. All rights reserved.</span>
            <span>Verified dealers · Trusted listings</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
