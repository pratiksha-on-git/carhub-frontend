import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Gauge, Settings2, MapPin, Star, Heart } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatINR, formatKM } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/public/useWishlist";
import { toast } from "sonner";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistRequireLogin?: () => void;
  isLoggedIn?: boolean;
  index?: number;
}

export function VehicleCard({
  vehicle,
  onWishlistRequireLogin,
  isLoggedIn,
  index = 0,
}: VehicleCardProps) {
  const imageUrl =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0]
      : FALLBACK_IMG;
  const { wishlistIds, toggleWishlist: apiToggleWishlist } = useWishlist();
  const wishlisted = wishlistIds.includes(vehicle.id);
  const isPremium = vehicle.vehicleType === "PREMIUM";
  const isFeatured = vehicle.vehicleStatus === "FEATURED";

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn && onWishlistRequireLogin) {
      onWishlistRequireLogin();
      return;
    }
    try {
      const msg = await apiToggleWishlist(vehicle.id);
      if (msg) toast.success(msg);
    } catch (err: any) {
      toast.error(err.message || "Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-foreground border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-[0_20px_50px_rgba(136,19,55,0.09)] dark:hover:shadow-[0_20px_50px_rgba(244,63,94,0.06)] hover:border-rose-900/30 dark:hover:border-rose-500/20 transition-all duration-300"
    >
      <Link to={`/car/${vehicle.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          {/* Subtle vignette image gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

          {/* Left tags (Featured / Premium) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isFeatured && (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-900 to-rose-700 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md shadow-rose-900/35 border border-rose-800/10">
                <Star className="h-2.5 w-2.5 fill-white" /> Featured
              </span>
            )}
            {isPremium && (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md shadow-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-black" /> Premium
              </span>
            )}
          </div>

          {/* Right badge: Registration Year */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center rounded-lg bg-white/90 dark:bg-slate-950/90 px-2.5 py-1 text-[11px] font-black text-rose-950 dark:text-rose-200 shadow-sm backdrop-blur-md border border-white/10">
              {vehicle.registrationYear}
            </span>
          </div>

          {/* Bottom left badge: Price Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1   rounded-xl bg-white/90  backdrop-blur-md text-rose-950 text-[13px] font-black font-display shadow-md border border-white/10">
              {formatINR(vehicle.askingPrice)}
            </span>
          </div>
        </div>
      </Link>

      {/* Heart Wishlist Trigger */}
      <button
        onClick={handleWishlist}
        className={`absolute z-20 h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 bottom-[calc(40%+12px)] right-3.5 cursor-pointer border border-white/15 ${wishlisted
          ? "bg-rose-900 text-white shadow-rose-900/35 border-rose-950/20"
          : "bg-black/45 hover:bg-rose-900/90 text-white"
          }`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4.5 w-4.5 transition-colors ${wishlisted ? "fill-white text-white" : "text-white"}`} />
      </button>

      {/* Card Info Details */}
      <div className="p-5 space-y-3.5">
        <Link to={`/car/${vehicle.id}`} className="block">
          <h3 className="font-display capitalize font-black text-[16px] leading-snug truncate text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-400 transition-colors">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-xs capitalize text-muted-foreground mt-0.5 truncate font-semibold">
            {vehicle.variant}
          </p>
        </Link>

        {/* Clean Spec Grid Container */}
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground/80 border-t border-b border-slate-100 dark:border-slate-800/60 py-3 bg-slate-50/50 dark:bg-slate-900/30 px-2 rounded-xl select-none">
          <div className="flex items-center gap-1.5 justify-center min-w-0">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-rose-900/70 dark:text-rose-400/80" />
            <span className="truncate">{formatKM(vehicle.kilometerDriven)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center min-w-0">
            <Fuel className="h-3.5 w-3.5 shrink-0 text-rose-900/70 dark:text-rose-400/80" />
            <span className="truncate capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center min-w-0">
            <Settings2 className="h-3.5 w-3.5 shrink-0 text-rose-900/70 dark:text-rose-400/80" />
            <span className="truncate capitalize">{vehicle.transmission}</span>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{vehicle.city}</span>
          </div>
          <Link
            to={`/car/${vehicle.id}`}
            className="shrink-0 text-[11px] font-black uppercase tracking-widest text-rose-900 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors flex items-center gap-1 group/link"
          >
            Details
            <span className="group-hover/link:translate-x-1 transition-transform inline-block duration-300">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-3xl bg-card border border-border/40 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-5 space-y-3.5">
        <div className="h-4.5 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
        <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-border/30">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
