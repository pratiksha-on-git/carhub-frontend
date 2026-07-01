import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import { motion } from "framer-motion";
import {
  useCustomer,
} from "@/hooks/public/useCustomerAuth";
import { AlertCircle, RefreshCw, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VehicleCard,
  VehicleCardSkeleton,
} from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { usePremiumVehicles } from "@/hooks/public/usePremiumVehicles";

const PAGE_SIZE = 9;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function PremiumCars() {
  const [page, setPage] = useState(1);

  const {
    vehicles = [],
    totalPages,
    totalElements,
    loading,
    error,
    refetch,
    isRefetching,
  } = usePremiumVehicles(page - 1, PAGE_SIZE);

  const customer = useCustomer();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-white via-rose-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen pb-16">
      <SEO
        title="Premium Cars Collection â€” Caryanam"
        description="Explore our exclusive, hand-picked collection of premium luxury cars. Certified and verified with direct dealer contact."
      />



      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[500px]">
          {error && (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-destructive/30 text-center gap-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div>
                <h3 className="font-bold text-lg">Failed to load premium vehicles</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button onClick={() => refetch()} disabled={isRefetching} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} /> Retry
              </Button>
            </div>
          )}

          {!error && loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
             gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !loading && vehicles.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <h3 className="font-display font-bold text-lg">No premium vehicles found</h3>
              <p className="text-sm text-muted-foreground mt-1">Please check back later.</p>
            </div>
          )}

          {!error && !loading && vehicles.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {vehicles.map((v, i) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  index={i}
                  isLoggedIn={!!customer}
                  onWishlistRequireLogin={() => setAuthOpen(true)}
                />
              ))}
            </motion.div>
          )}
        </div>

        {!error && !loading && vehicles.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-rose-500 hover:text-rose-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground px-2 font-medium">
              Page <span className="font-black text-foreground">{page}</span> of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-rose-500 hover:text-rose-500 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => { }} />
    </div>
  );
}
