import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { VehicleCard } from "@/components/cards/VehicleCard";
import { useAllVehicles } from "@/hooks/public/useAllVehicles";
import { getWishlist } from "@/hooks/public/useCustomerAuth";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { vehicles, loading } = useAllVehicles();
  const wishlistIds = getWishlist();

  const wishlisted = useMemo(
    () => vehicles.filter((v) => wishlistIds.includes(v.id)),
    [vehicles, wishlistIds]
  );

  return (
    <>
      <SEO title="My Wishlist — AutoHub India" description="Your saved cars on AutoHub India." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-accent fill-accent" />
          <h1 className="font-display text-2xl font-black">My Wishlist</h1>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-card shadow-card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && wishlisted.length === 0 && (
          <div className="text-center py-24 bg-card rounded-2xl border border-border">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg">No saved cars yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Browse cars and tap the heart icon to save them here.
            </p>
            <Button asChild className="mt-5 gradient-primary text-white border-0">
              <Link to="/cars">Browse Cars</Link>
            </Button>
          </div>
        )}

        {!loading && wishlisted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlisted.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
