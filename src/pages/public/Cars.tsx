import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import { getStoredCustomer, type CustomerUser } from "@/hooks/public/useCustomerAuth";
import { Filter as FilterIcon, Search, X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { VehicleCard, VehicleCardSkeleton } from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { useAllVehicles } from "@/hooks/public/useAllVehicles";
import { BUDGET_BANDS } from "@/utils/constants";
import { formatINR } from "@/utils/helpers";
import type { Vehicle } from "@/types";

const PAGE = 12;

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const { vehicles: all, loading, error, refetch } = useAllVehicles();
  const [page, setPage] = useState(1);
  const [customer, setCustomer] = useState<CustomerUser | null>(getStoredCustomer);
  const [authOpen, setAuthOpen] = useState(false);

  const get = (k: string) => params.get(k) || "";
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
    setPage(1);
  };

  const brand = get("brand");
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

  const budget = BUDGET_BANDS.find((b) => b.label === budgetLabel);

  // Derive dynamic filter options from the fetched data
  const BRANDS = useMemo(() => [...new Set(all.map((v) => v.brand))].sort(), [all]);
  const CITIES = useMemo(() => [...new Set(all.map((v) => v.city))].sort(), [all]);
  const FUELS = useMemo(() => [...new Set(all.map((v) => v.fuelType))].sort(), [all]);
  const TRANSMISSIONS = useMemo(() => [...new Set(all.map((v) => v.transmission))].sort(), [all]);
  const OWNERSHIPS = useMemo(() => [...new Set(all.map((v) => v.ownershipDetails))].sort(), [all]);

  const filtered = useMemo(() => {
    let list: Vehicle[] = all;
    if (brand) list = list.filter((v) => v.brand === brand);
    if (city) list = list.filter((v) => v.city === city);
    if (fuel) list = list.filter((v) => v.fuelType === fuel);
    if (transmission) list = list.filter((v) => v.transmission === transmission);
    if (ownership) list = list.filter((v) => v.ownershipDetails === ownership);
    if (minYear) list = list.filter((v) => v.registrationYear >= minYear);
    if (maxKm) list = list.filter((v) => v.kilometerDriven <= maxKm);
    if (budget) list = list.filter((v) => v.askingPrice >= budget.min && v.askingPrice < budget.max);
    if (minPrice || maxPrice < 5000000) list = list.filter((v) => v.askingPrice >= minPrice && v.askingPrice <= maxPrice);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((v) =>
        v.brand.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.variant.toLowerCase().includes(s) ||
        v.city.toLowerCase().includes(s)
      );
    }
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.askingPrice - b.askingPrice); break;
      case "price-desc": list = [...list].sort((a, b) => b.askingPrice - a.askingPrice); break;
      case "year-desc": list = [...list].sort((a, b) => b.registrationYear - a.registrationYear); break;
      case "km-asc": list = [...list].sort((a, b) => a.kilometerDriven - b.kilometerDriven); break;
      default: list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [all, brand, city, fuel, transmission, ownership, minYear, maxKm, budget, minPrice, maxPrice, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

  const Filters = () => (
    <div className="space-y-5">
      <div>
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Search</Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => set("q", e.target.value)} placeholder="Brand, model, city…" className="pl-9" />
        </div>
      </div>
      <FilterGroup label="Brand" value={brand} setValue={(v) => set("brand", v)} options={BRANDS} />
      <FilterGroup label="City" value={city} setValue={(v) => set("city", v)} options={CITIES} />
      <FilterGroup label="Fuel" value={fuel} setValue={(v) => set("fuel", v)} options={FUELS} />
      <FilterGroup label="Transmission" value={transmission} setValue={(v) => set("transmission", v)} options={TRANSMISSIONS} />
      <FilterGroup label="Ownership" value={ownership} setValue={(v) => set("ownership", v)} options={OWNERSHIPS} />

      <div>
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Price range</Label>
        <div className="mt-3 px-1">
          <Slider
            min={0}
            max={5000000}
            step={50000}
            value={[minPrice, maxPrice]}
            onValueChange={([lo, hi]) => { set("minPrice", String(lo)); set("maxPrice", String(hi)); }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatINR(minPrice)}</span>
            <span>{formatINR(maxPrice)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min Year</Label>
          <Input type="number" placeholder="2020" value={get("minYear")} onChange={(e) => set("minYear", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Max KM</Label>
          <Input type="number" placeholder="50000" value={get("maxKm")} onChange={(e) => set("maxKm", e.target.value)} className="mt-1" />
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Budget band</Label>
        <div className="mt-2 space-y-1.5">
          {BUDGET_BANDS.map((b) => (
            <label key={b.label} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={budgetLabel === b.label} onCheckedChange={(c) => set("budget", c ? b.label : "")} />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
        <X className="h-4 w-4" /> Clear all filters
      </Button>
    </div>
  );

  return (
    <>
      <SEO
        title="Browse Used Cars — AutoHub India"
        description="Search verified used cars by brand, city, fuel, transmission and budget. Direct dealer contact."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-black">Browse Used Cars</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? "Loading vehicles…" : `${filtered.length} verified vehicles available`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <FilterIcon className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] sm:w-[400px] overflow-y-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><Filters /></div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => set("sort", v)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="year-desc">Newest First</SelectItem>
                <SelectItem value="km-asc">Lowest KM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-card rounded-2xl border border-border p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <Filters />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-destructive/30 text-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <div>
                  <h3 className="font-bold text-lg">Failed to load vehicles</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button onClick={refetch} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Retry
                </Button>
              </div>
            )}

            {/* Loading state */}
            {!error && loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!error && !loading && paged.length === 0 && (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <h3 className="font-display font-bold text-lg">No vehicles match your filters</h3>
                <p className="text-sm text-muted-foreground mt-1">Try clearing some filters or broadening your search.</p>
                <Button className="mt-4" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  Clear filters
                </Button>
              </div>
            )}

            {/* Vehicle grid */}
            {!error && !loading && paged.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paged.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      isLoggedIn={!!customer}
                      onWishlistRequireLogin={() => setAuthOpen(true)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-3">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onSuccess={(u) => setCustomer(u)} />
    </>
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
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select value={value || "all"} onValueChange={(v) => setValue(v === "all" ? "" : v)}>
        <SelectTrigger className="mt-1.5"><SelectValue placeholder={`All ${label}s`} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {label}s</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
