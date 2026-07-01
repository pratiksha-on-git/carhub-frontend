import { Link } from "react-router-dom";
import { BadgeCheck, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types";
import { useWishlist } from "@/hooks/public/useWishlist";
import { toast } from "sonner";

interface FeaturedVehicleCardProps {
  vehicle: Vehicle;
  onWishlistRequireLogin?: () => void;
  isLoggedIn?: boolean;
}

export function FeaturedVehicleCard({
  vehicle,
  onWishlistRequireLogin,
  isLoggedIn,
}: FeaturedVehicleCardProps) {
  // Format price helper
  const formatPrice = (p: number) => {
    if (p >= 100000) {
      return `₹${(p / 100000).toFixed(2)} L`;
    }
    return `₹${p.toLocaleString("en-IN")}`;
  };

  // Format kms helper
  const formatKms = (kms: number) => {
    if (kms >= 1000) {
      return `${(kms / 1000).toFixed(0)}k km`;
    }
    return `${kms} km`;
  };

  const { wishlistIds, toggleWishlist: apiToggleWishlist } = useWishlist();
  const wishlisted = wishlistIds.includes(vehicle.id);
  const isPremium = vehicle.vehicleType === "PREMIUM";

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

  const mainImage = vehicle.images?.[0] || "/placeholder-car.jpg";

  return (
    <Link to={`/car/${vehicle.id}`} className="block relative overflow-hidden rounded-[32px] group aspect-[1.4/1] w-full shadow-xl bg-slate-900 border border-slate-100 dark:border-slate-800/40">
      {/* Background Car Image */}
      <img
        src={mainImage}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent z-10 pointer-events-none" />

      {/* Top Left Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-900 to-rose-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
          <Star className="h-3 w-3 fill-white text-white" />
          Featured
        </span>
        {isPremium && (
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
            <Star className="h-3 w-3 fill-black text-black" />
            Premium
          </span>
        )}
      </div>

      {/* Top Right Price Tag */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 pointer-events-none">
        <span className="inline-flex items-center bg-white/95 dark:bg-slate-900/95 text-rose-900 dark:text-rose-450 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md">
          {formatPrice(vehicle.askingPrice)}
        </span>
      </div>

      {/* Floating Bottom Info Layer */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end text-white">
        {/* Car Title */}
        <h3 className="text-xl sm:text-2xl capitalize font-black mb-3 text-white tracking-tight drop-shadow-md">
          {vehicle.brand} {vehicle.model}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
          <div className="flex gap-6 text-left">
            {/* Kms */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Kms</span>
              <span className="font-bold text-white text-xs sm:text-sm mt-0.5">
                {formatKms(vehicle.kilometerDriven)}
              </span>
            </div>

            {/* Fuel */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Fuel</span>
              <span className="font-bold capitalize text-white text-xs sm:text-sm mt-0.5">
                {vehicle.fuelType}
              </span>
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Year</span>
              <span className="font-bold text-white text-xs sm:text-sm mt-0.5">
                {vehicle.registrationYear}
              </span>
            </div>
          </div>

          {/* Wishlist Heart Button (Bottom Right) */}
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 border shadow-sm shrink-0 cursor-pointer ${wishlisted
              ? "bg-rose-900 border-rose-800 text-white shadow-rose-900/20"
              : "bg-white/15 hover:bg-white/25 border-white/10 text-white hover:scale-105"
              }`}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedVehicleCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[32px] aspect-[1.4/1] w-full bg-card border border-border/40 animate-pulse">
      {/* Top Left Badge Placeholder */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
        <div className="h-6 w-20 bg-muted rounded-xl" />
      </div>

      {/* Top Right Price Tag Placeholder */}
      <div className="absolute top-4 right-4 z-20">
        <div className="h-6 w-16 bg-muted rounded-xl" />
      </div>

      {/* Floating Bottom Info Layer */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 flex flex-col justify-end">
        {/* Car Title Placeholder */}
        <div className="h-7 bg-muted rounded-lg w-2/3 mb-4" />

        {/* Specs Row */}
        <div className="flex items-center justify-between gap-4 border-t border-border/30 pt-3">
          <div className="flex gap-6 text-left">
            {/* Kms */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 font-bold">Kms</span>
              <div className="h-4 bg-muted rounded w-12 mt-0.5" />
            </div>

            {/* Fuel */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 font-bold">Fuel</span>
              <div className="h-4 bg-muted rounded w-10 mt-0.5" />
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/40 font-bold">Year</span>
              <div className="h-4 bg-muted rounded w-8 mt-0.5" />
            </div>
          </div>

          {/* Wishlist Button Placeholder */}
          <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
        </div>
      </div>
    </div>
  );
}
