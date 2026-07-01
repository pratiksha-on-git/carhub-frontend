import { Link } from "react-router-dom";
import { Heart, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { useWishlist } from "@/hooks/public/useWishlist";
import { useCustomer } from "@/hooks/public/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { formatINR, formatDate } from "@/utils/helpers";
import { toast } from "sonner";
import { motion } from "framer-motion";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

export default function Wishlist() {
  const customer = useCustomer();
  const { wishlist: wishlisted, loading, toggleWishlist } = useWishlist();

  const handleRemove = async (e: React.MouseEvent, vehicleId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const msg = await toggleWishlist(vehicleId);
      if (msg) {
        toast.success(msg);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove from wishlist");
    }
  };

  return (
    <div className="pb-20 pt-10 bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30">
      <SEO title="My Wishlist — Caryanam" description="Your saved cars on Caryanam." />



      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border/50 shadow-card overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-7 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-9 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && wishlisted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm max-w-xl mx-auto"
          >
            <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="h-10 w-10 text-rose-400" />
            </div>
            <h3 className="font-display font-bold text-xl">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Explore our collection of certified pre-owned cars and save your favorites.
            </p>
            <a
              href="/cars"
              className="mt-6 inline-flex items-center gap-2 gradient-primary text-white px-7 py-3 rounded-full font-bold shadow-lg shadow-rose-500/20 hover:opacity-90 transition-opacity"
            >
              Browse Cars <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}

        {!loading && wishlisted.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlisted.map((v) => {
              const imageUrl = v.images && v.images.length > 0 ? v.images[0] : FALLBACK_IMG;
              return (
                <motion.div
                  key={v.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-premium transition-all duration-300"
                >
                  <Link to={`/car/${v.id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={`${v.brand} ${v.model}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                      />

                      {/* Delete button from Wishlist */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, v.id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur text-rose-500 flex items-center justify-center shadow-md transition-transform hover:scale-110 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>

                  <div className="p-5 space-y-4">
                    <div>
                      <Link to={`/car/${v.id}`} className="block">
                        <h3 className="font-bold text-base leading-tight hover:text-accent transition-colors truncate">
                          {v.brand} {v.model}
                        </h3>
                      </Link>
                      <div className="mt-2 font-display font-black text-lg text-gradient-primary">
                        {formatINR(v.askingPrice)}
                      </div>
                    </div>

                    {v.createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Saved on {formatDate(v.createdAt)}</span>
                      </div>
                    )}

                    <Button
                      asChild
                      size="sm"
                      className="w-full gradient-primary text-white border-0 hover:opacity-90"
                    >
                      <Link to={`/car/${v.id}`}>View Details</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
