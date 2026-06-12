import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Gauge, Settings2, MapPin, BadgeCheck, Star } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatINR, formatKM } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dealerService } from "@/services/dealerService";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const dealer = dealerService.get(vehicle.dealerId);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-premium transition-shadow"
    >
      <Link to={`/car/${vehicle.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={vehicle.images[0]}
            alt={vehicle.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {vehicle.featured && (
              <Badge className="gap-1 bg-warning text-warning-foreground border-0">
                <Star className="h-3 w-3 fill-current" /> Featured
              </Badge>
            )}
            {vehicle.verified && (
              <Badge className="gap-1 bg-success text-success-foreground border-0">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground font-semibold">
              {vehicle.year}
            </Badge>
          </div>
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/car/${vehicle.slug}`}>
            <h3 className="font-bold text-base leading-tight line-clamp-1 hover:text-accent transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{vehicle.variant}</p>
        </div>
        <div className="text-xl font-black text-foreground font-display">{formatINR(vehicle.price)}</div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground border-y border-border py-3">
          <div className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /><span className="truncate">{formatKM(vehicle.kmDriven)}</span></div>
          <div className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" /><span className="truncate">{vehicle.fuel}</span></div>
          <div className="flex items-center gap-1.5"><Settings2 className="h-3.5 w-3.5" /><span className="truncate">{vehicle.transmission}</span></div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{vehicle.city}</span>
          </div>
          <span className="text-muted-foreground truncate ml-2">{dealer?.businessName}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="flex-1 gradient-primary text-white border-0 hover:opacity-90">
            <Link to={`/car/${vehicle.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
