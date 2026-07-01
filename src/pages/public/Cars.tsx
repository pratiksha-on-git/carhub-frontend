import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import {
  useCustomer,
  getStoredCustomer,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import {
  Filter as FilterIcon,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  Trash2,
  Sparkles,
  Car,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  VehicleCard,
  VehicleCardSkeleton,
} from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { useAllVehicles } from "@/hooks/public/useAllVehicles";
import { CAR_BRANDS, getModels, getVariants } from "@/data/carDatabase";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { BUDGET_BANDS } from "@/utils/constants";
import { formatINR } from "@/utils/helpers";
import type { Vehicle } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const PAGE = 9;

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    vehicles: all,
    totalPages: backendTotalPages,
    totalElements: backendTotalElements,
    loading,
    error,
    refetch,
    isRefetching,
  } = useAllVehicles(page - 1, PAGE);
  const customer = useCustomer();
  const [authOpen, setAuthOpen] = useState(false);

  const get = (k: string) => params.get(k) || "";
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
    setPage(1);
  };
  const setMany = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "all") next.set(k, v);
      else next.delete(k);
    });
    setParams(next, { replace: true });
    setPage(1);
  };

  const brand = get("brand");
  const model = get("model");
  const variant = get("variant");
  const city = get("city");
  const fuel = get("fuel");
  const transmission = get("transmission");
  const ownership = get("ownership");
  const sort = get("sort") || "latest";
  const q = get("q");
  const budgetLabel = get("budget");
  const minYear = Number(get("minYear")) || 0;
  const maxKm = Number(get("maxKm")) || 0;
  const minPrice = Number(get("minPrice")) || 0;
  const maxPrice = Number(get("maxPrice")) || 5000000;

  const [sliderValue, setSliderValue] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setSliderValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const budget = BUDGET_BANDS.find((b) => b.label === budgetLabel);

  // Cascading options from carDatabase
  const models = brand ? getModels(brand) : [];
  const variants = brand && model ? getVariants(brand, model) : [];

  const handleBrandChange = (v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set("brand", v);
    else next.delete("brand");
    next.delete("model");
    next.delete("variant");
    setParams(next, { replace: true });
    setPage(1);
  };

  const handleModelChange = (v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set("model", v);
    else next.delete("model");
    next.delete("variant");
    setParams(next, { replace: true });
    setPage(1);
  };

  // Static filter options
  const CITIES = ["Pune", "PCMC"];
  const FUELS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const TRANSMISSIONS = ["Manual", "Automatic"];
  const OWNERSHIPS = ["First Owner", "Second Owner", "Third Owner", "Others"];

  const filtered = useMemo(() => {
    let list: Vehicle[] = all;
    if (brand) list = list.filter((v) => v.brand === brand);
    if (model)
      list = list.filter((v) =>
        v.model?.toLowerCase().includes(model.toLowerCase()),
      );
    if (variant)
      list = list.filter((v) =>
        v.variant?.toLowerCase().includes(variant.toLowerCase()),
      );
    if (city) list = list.filter((v) => v.city === city);
    if (fuel) list = list.filter((v) => v.fuelType === fuel);
    if (transmission)
      list = list.filter((v) => v.transmission === transmission);
    if (ownership) list = list.filter((v) => v.ownershipDetails === ownership);
    if (minYear) list = list.filter((v) => v.registrationYear >= minYear);
    if (maxKm) list = list.filter((v) => v.kilometerDriven <= maxKm);
    if (budget)
      list = list.filter(
        (v) => v.askingPrice >= budget.min && v.askingPrice < budget.max,
      );
    if (minPrice || maxPrice < 5000000)
      list = list.filter(
        (v) => v.askingPrice >= minPrice && v.askingPrice <= maxPrice,
      );
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (v) =>
          v.brand?.toLowerCase().includes(s) ||
          v.model?.toLowerCase().includes(s) ||
          v.variant?.toLowerCase().includes(s) ||
          v.city?.toLowerCase().includes(s),
      );
    }
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.askingPrice - b.askingPrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case "year-desc":
        list = [...list].sort(
          (a, b) => b.registrationYear - a.registrationYear,
        );
        break;
      case "km-asc":
        list = [...list].sort((a, b) => a.kilometerDriven - b.kilometerDriven);
        break;
      default:
        list = [...list].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        );
    }
    return list;
  }, [
    all,
    brand,
    model,
    variant,
    city,
    fuel,
    transmission,
    ownership,
    minYear,
    maxKm,
    budget,
    minPrice,
    maxPrice,
    q,
    sort,
  ]);

  const totalPages = backendTotalPages || 1;
  const paged = filtered;

  const activeFilterCount =
    [
      brand,
      model,
      variant,
      city,
      fuel,
      transmission,
      ownership,
      budgetLabel,
      minYear,
      maxKm,
      q,
    ].filter(Boolean).length + (minPrice > 0 || maxPrice < 5000000 ? 1 : 0);

  const renderFilters = () => (
    <div className="space-y-6">

      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Keyword Search
        </Label>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors" />
          <Input
            value={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search brand, model, city..."
            className="pl-10 h-11 text-rose-900 dark:text-rose-100 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30 focus-visible:ring-4 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all placeholder:text-muted-foreground/50 text-sm"
          />
        </div>
      </div>

      {/* Brand Select */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Brand
        </Label>
        <SearchableSelect
          value={brand || "All Brands"}
          onValueChange={(v) => handleBrandChange(v === "All Brands" ? "" : v)}
          options={["All Brands", ...CAR_BRANDS]}
          placeholder="All Brands"
          triggerClassName="mt-0 h-11 rounded-xl hover:bg-muted/10 transition-colors focus:border-rose-900 focus:ring-rose-900/15"
        />
      </div>

      {/* Model Selection */}
      <AnimatePresence>
        {brand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Model
            </Label>
            <SearchableSelect
              value={model || "All Models"}
              onValueChange={(v) =>
                handleModelChange(v === "All Models" ? "" : v)
              }
              options={["All Models", ...models]}
              placeholder="All Models"
              triggerClassName="h-11 rounded-xl hover:bg-muted/10 transition-colors focus:border-rose-900 focus:ring-rose-900/15"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Selection */}
      <AnimatePresence>
        {brand && model && variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Variant
            </Label>
            <SearchableSelect
              value={variant || "All Variants"}
              onValueChange={(v) =>
                set("variant", v === "All Variants" ? "" : v)
              }
              options={["All Variants", ...variants]}
              placeholder="All Variants"
              triggerClassName="h-11 rounded-xl hover:bg-muted/10 transition-colors focus:border-rose-900 focus:ring-rose-900/15"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-border/50 my-2 pt-4 space-y-5">
        <FilterGroup
          label="City"
          value={city}
          setValue={(v) => set("city", v)}
          options={CITIES}
        />
        <FilterGroup
          label="Fuel"
          value={fuel}
          setValue={(v) => set("fuel", v)}
          options={FUELS}
        />
        <FilterGroup
          label="Transmission"
          value={transmission}
          setValue={(v) => set("transmission", v)}
          options={TRANSMISSIONS}
        />
        <FilterGroup
          label="Ownership"
          value={ownership}
          setValue={(v) => set("ownership", v)}
          options={OWNERSHIPS}
        />
      </div>

      <div className="border-t border-border/50 my-2 pt-4 space-y-4">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Price Range (INR)
          </Label>
          <div className="mt-3.5 px-1">
            <Slider
              min={0}
              max={5000000}
              step={50000}
              value={sliderValue}
              onValueChange={(val) => setSliderValue(val as [number, number])}
              onValueCommit={([lo, hi]) => {
                setMany({
                  minPrice: String(lo),
                  maxPrice: String(hi),
                });
              }}
              className="py-1 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-semibold text-muted-foreground mt-2.5">
              <span className="text-rose-950 dark:text-rose-200">
                {formatINR(sliderValue[0])}
              </span>
              <span>{formatINR(sliderValue[1])}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Min Year
            </Label>
            <Input
              type="number"
              placeholder="2020"
              value={get("minYear")}
              onChange={(e) => set("minYear", e.target.value)}
              className="h-10 text-rose-900 dark:text-rose-100 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30 focus-visible:ring-4 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Max KM
            </Label>
            <Input
              type="number"
              placeholder="50000"
              value={get("maxKm")}
              onChange={(e) => set("maxKm", e.target.value)}
              className="h-10 text-rose-900 dark:text-rose-100 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30 focus-visible:ring-4 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 my-2 pt-4">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
          Budget Band
        </Label>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
          {BUDGET_BANDS.map((b) => (
            <label
              key={b.label}
              className="flex items-center gap-2.5 text-sm font-medium text-foreground/80 hover:text-foreground cursor-pointer py-0.5 select-none"
            >
              <Checkbox
                checked={budgetLabel === b.label}
                onCheckedChange={(c) => set("budget", c ? b.label : "")}
                className="rounded-md border-border/80 focus:ring-rose-900/15"
              />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-white via-rose-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen pb-16">
      <SEO
        title="Browse Used Cars — Caryanam"
        description="Search verified used cars by brand, city, fuel, transmission and budget. Direct dealer contact."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Browse Used Cars
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {loading
              ? "Loading verified vehicles…"
              : `${backendTotalElements?.toLocaleString() ?? "–"} verified vehicles available`}
          </p>
        </div>
        {/* Sort & Filter Toggle Controls */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-border/30 pb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider hidden sm:block">
            {filtered.length} Results
          </h2>
          <div className="flex items-center gap-3 ml-auto">
            {/* Filter Toggle Mobile Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 h-11 rounded-xl font-bold cursor-pointer">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full gradient-primary text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[88vw] sm:w-[400px] overflow-y-auto rounded-r-3xl"
              >
                <SheetHeader className="mb-4">
                  <SheetTitle className="font-display font-black text-xl flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-rose-600" /> Filter Options
                    </div>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          setParams(new URLSearchParams(), { replace: true });
                          setPage(1);
                        }}
                        className="text-xs font-black uppercase tracking-wider text-rose-900 hover:underline cursor-pointer mr-6"
                      >
                        Clear All
                      </button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={sort} onValueChange={(v) => set("sort", v)}>
              <SelectTrigger className="w-[180px] h-11 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="latest">Latest Addition</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="km-asc">Lowest KM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-2xl border border-border/60 p-6 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-5">
                <h3 className="font-display font-black text-base flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-rose-600" /> Filter Options
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setParams(new URLSearchParams(), { replace: true });
                      setPage(1);
                    }}
                    className="text-xs font-black uppercase tracking-wider text-rose-900 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {renderFilters()}
            </div>
          </aside>

          {/* Listing Grid Panel */}
          <div className="min-w-0 flex flex-col justify-between min-h-[600px] sm:min-h-[1000px] lg:min-h-[1150px]">
            <div className="flex-1">
              {error && (
                <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-destructive/20 text-center gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive grid place-items-center">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg">
                      Failed to load vehicles
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {error}
                    </p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="gap-2 h-11 px-5 rounded-xl font-bold cursor-pointer"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                    />{" "}
                    Retry Loading
                  </Button>
                </div>
              )}

              {!error && loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <VehicleCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!error && !loading && paged.length === 0 && (
                <div className="text-center py-24 bg-card rounded-2xl border border-border/60 shadow-sm flex flex-col items-center justify-center p-8">
                  <div className="h-16 w-16 rounded-2xl bg-rose-900 text-white grid place-items-center mb-4">
                    <Car className="h-8 w-8" />
                  </div>
                  <h3 className="font-display font-black text-xl text-foreground">
                    No vehicles match your criteria
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    Try adjusting or clearing some filters to broaden your search results.
                  </p>
                  <Button
                    className="mt-6 h-11 px-6 rounded-xl font-bold cursor-pointer hover:shadow-md transition-all"
                    onClick={() => {
                      setParams(new URLSearchParams(), { replace: true });
                      setPage(1);
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}

              {/* Dynamic staggered card rendering */}
              {!error && !loading && paged.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {paged.map((v) => (
                    <motion.div
                      key={v.id}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 25,
                          },
                        },
                      }}
                    >
                      <VehicleCard
                        vehicle={v}
                        isLoggedIn={!!customer}
                        onWishlistRequireLogin={() => setAuthOpen(true)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Pagination Controls */}
            {!error && !loading && paged.length > 0 && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2.5 pt-5 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl px-4 font-bold border-border"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-semibold text-muted-foreground px-4 bg-muted/40 py-2 rounded-xl border border-border/30">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl px-4 font-bold border-border"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(u) => { }}
      />
    </div>
  );
}

function FilterGroup({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Select
        value={value || "all"}
        onValueChange={(v) => setValue(v === "all" ? "" : v)}
      >
        <SelectTrigger className="mt-0 h-11 rounded-xl cursor-pointer hover:bg-muted/10 transition-colors focus:border-rose-900 focus:ring-rose-900/15">
          <SelectValue placeholder={`All ${label}s`} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="all">All {label}s</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
