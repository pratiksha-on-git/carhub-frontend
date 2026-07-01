import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Car,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  User,
  LogOut,
  MessageSquare,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/shared/AuthModal";
import CustomerChatWidget from "@/components/shared/CustomerChatWidget";
import {
  useCustomer,
  clearCustomer,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import apiClient from "@/lib/customerApiClient";
import { toast } from "sonner";
import footerBg from "@/assets/footer-bg.png";

// Vite dynamic frame loader for all website preloading
const frameModules = import.meta.glob<string>(
  "../assets/Hero-Section/car-video_*.png",
  {
    eager: true,
    import: "default",
  }
);

const sortedFrameUrls = Object.entries(frameModules)
  .sort(([keyA], [keyB]) => {
    const numA = parseInt(keyA.match(/car-video_(\d+)\.png/)?.[1] || "0", 10);
    const numB = parseInt(keyB.match(/car-video_(\d+)\.png/)?.[1] || "0", 10);
    return numA - numB;
  })
  .map(([_, url]) => url);

const nav = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Browse Cars" },
  { to: "/premium", label: "Premium Cars" },
  { to: "/about", label: "About" },

];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const customer = useCustomer();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // Header is always dark — we track scroll only to add a subtle shadow/blur
  const isHeaderScrolled = scrolled || !isHome;

  // Frame preloader states
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Preload frame images
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = sortedFrameUrls.length;
    const loadedImages: HTMLImageElement[] = [];

    if (totalFrames === 0) {
      setLoading(false);
      return;
    }

    sortedFrameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
          setTimeout(() => setLoading(false), 300);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
          setTimeout(() => setLoading(false), 300);
        }
      };
      loadedImages[index] = img;
    });
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    if (isHome) {
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    } else {
      setScrolled(true);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAuthSuccess = (user: CustomerUser) => {
    // State updates automatically via useCustomer hook
  };

  const handleWishlistClick = () => {
    if (!customer) {
      setAuthOpen(true);
    } else {
      navigate("/wishlist");
    }
  };

  const handleUserClick = () => {
    if (!customer) {
      setAuthOpen(true);
    } else {
      setUserMenuOpen((v) => !v);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearCustomer();
      setUserMenuOpen(false);
      toast.success("Logged out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">


      {/* ── Always-Dark Premium Header ── */}
      <header
        className={`${isHome ? "fixed" : "sticky"
          } top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome && !scrolled
            ? "bg-transparent border-transparent"
            : "bg-black backdrop-blur-md border-b border-white/5 shadow-[0_1px_30px_rgba(0,0,0,0.4)]"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 relative">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary border border-rose-900 text-white shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-shadow">
              <Car className="h-6 w-6" />
            </div>
            <div className="font-display font-black text-2xl leading-none text-white tracking-tight">
              Caryanam
            </div>
          </Link>

          {/* Desktop Nav — always white text on dark */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className="group relative px-4 py-2 text-md font-medium cursor-pointer"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`relative z-10 transition-colors duration-200 ${isActive
                        ? "text-white font-semibold"
                        : "text-white/80 group-hover:text-white"
                        }`}
                    >
                      {n.label}
                    </span>

                    {/* Active underline — slides between links */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-rose-700"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}

                    {/* Hover underline (inactive only) */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">

            {/* User avatar / login button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleUserClick}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 overflow-hidden border ${customer
                  ? "bg-rose-900 text-white border-rose-500/40 shadow-md shadow-rose-500/20 hover:opacity-90"
                  : "bg-rose-500/30 border-rose-500/40 text-white/80 hover:bg-rose-500/40 hover:text-white hover:border-rose-500/40"
                  }`}
                title={customer ? customer.customerName || customer.email : "Login"}
              >
                {customer ? (
                  <span className="text-sm font-bold uppercase leading-none">
                    {(customer.customerName || customer.email || "U").trim().charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </button>

              {/* Dark dropdown */}
              <AnimatePresence>
                {userMenuOpen && customer && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-56 bg-slate-900 border border-white/8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] z-50 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/6">
                      <p className="text-sm font-bold text-white truncate capitalize">
                        {customer.customerName || customer.email}
                      </p>
                      <p className="text-xs text-white/40 truncate mt-0.5">{customer.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate("/wishlist"); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <Heart className="h-4 w-4 text-rose-400" /> My Wishlist
                    </button>
                    <button
                      onClick={() => { navigate("/chat"); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <MessageSquare className="h-4 w-4 text-rose-400" /> My Chats
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/8 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dealer buttons */}

            {/* Dealer Login — glowing rose button */}
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 text-white shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:opacity-95 transition-all"
            >
              Dealer Login
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full bg-white/8 border border-white/10 text-white hover:bg-white/15 transition-all">
                  <Menu className="h-4.5 w-4.5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-slate-950 border-white/8 text-white p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile sheet header */}
                  <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/8">
                    <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-white">
                      <Car className="h-4 w-4" />
                    </div>
                    <span className="font-display font-black text-base text-white">Caryanam</span>
                  </div>

                  {/* Mobile nav links */}
                  <div className="flex flex-col gap-1 px-4 py-4 flex-1">
                    {nav.map((n) => (
                      <Link
                        key={n.to}
                        to={n.to}
                        className="px-4 py-3 rounded-xl text-white/65 hover:text-white hover:bg-white/6 font-medium transition-colors text-sm"
                      >
                        {n.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile CTA buttons */}
                  <div className="px-4 pb-8 flex flex-col gap-3 border-t border-white/8 pt-4">
                    <Link
                      to="/auth/login"
                      className="flex items-center justify-center gradient-primary text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-rose-500/20"
                    >
                      Dealer Login
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center justify-center border border-white/10 text-white/70 hover:text-white py-3 rounded-xl text-sm font-medium transition-colors"
                    >
                      Register Dealer
                    </Link>
                  </div>
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
          <Outlet context={{ images, loading, progress }} />
        </motion.main>

      </AnimatePresence>

      <footer className="relative text-white  overflow-hidden bg-black">
        {/* Giant watermark background spanning the bottom */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none select-none z-0">
          <span className="text-[12vw] font-black uppercase tracking-[0.2em] text-neutral-900 leading-none translate-y-[15%]">
            Caryanam
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Top Explore bar */}
          <div className="mb-8">
            <span className="text-xs font-bold text-white/95 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-rose-400 font-extrabold text-sm">+</span> Explore more on Caryanam
            </span>
          </div>

          {/* 4-Column Grid */}
          <div className="grid gap-10 md:grid-cols-4">
            {/* Col 1: Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
                  <Car className="h-5 w-5" />
                </div>
                <div className="font-display font-black text-lg">Caryanam</div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                India's most trusted used-car dealer marketplace. Verified
                inventory across 150+ cities.
              </p>
            </div>

            {/* Col 2: Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <Link to="/cars" className="transition-colors duration-200 hover:text-rose-400">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="transition-colors duration-200 hover:text-rose-400">
                    Premium Cars
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="transition-colors duration-200 hover:text-rose-400">
                    Dealer Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/70">

                <li>
                  <Link to="/about" className="transition-colors duration-200 hover:text-rose-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="transition-colors duration-200 hover:text-rose-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-colors duration-200 hover:text-rose-400">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Reach us */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Reach us</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-rose-400 shrink-0" /> +91 1800 123 4567
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-rose-400 shrink-0" /> hello@Caryanam.in
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-rose-400 shrink-0" /> Mumbai · Delhi · Bangalore
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-white/10 py-8">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <span>
              Copyright © {new Date().getFullYear()} Caryanam. All Rights Reserved.
            </span>
            <span className="flex items-center gap-1.5">
              Made by team <span className="font-bold text-white">Caryanam</span> with <span className="text-red-500">❤️</span>
            </span>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />
      <CustomerChatWidget />
    </div>
  );
}
