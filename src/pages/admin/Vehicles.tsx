import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { useAdminAllVehicles } from "@/hooks/admin/useAdminAllVehicles";
import { formatINR, formatKM } from "@/utils/helpers";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "ACTIVE")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold rounded-full px-3">
        Active
      </Badge>
    );
  if (s === "INACTIVE")
    return (
      <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-50 hover:text-red-800 rounded-full px-3">
        Inactive
      </Badge>
    );
  if (s === "FEATURED")
    return (
      <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs hover:bg-yellow-50 hover:text-yellow-800 font-bold rounded-full px-3">
        Featured
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs font-bold rounded-full px-3">
      {status}
    </Badge>
  );
}

export default function AdminVehicles() {
  const [search, setSearch] = useState("");
  const { vehicles, loading, error, refetch } = useAdminAllVehicles();

  const filtered = vehicles.filter(
    (v) =>
      `${v.brand} ${v.model} ${v.variant}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      v.city?.toLowerCase().includes(search.toLowerCase()) ||
      v.fuelType?.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleType?.toLowerCase().includes(search.toLowerCase()),
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold">Failed to load vehicles</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Vehicles
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filtered.length} vehicles
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brand, model, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={loading}
            className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-black border-b border-black">
              <TableRow className="bg-black hover:bg-black border-none">
                <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Sr No
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-4">
                  Vehicle
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Price
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  KM / Fuel
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  City
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                  Year
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className="border-b border-slate-100/80 last:border-none"
                  >
                    <TableCell className="w-16 text-center py-4">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-14 rounded shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32 rounded" />
                          <Skeleton className="h-3 w-20 rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <Skeleton className="h-4 w-12 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {search
                      ? "No matching vehicles found."
                      : "No vehicles found."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v, idx) => (
                  <TableRow
                    key={v.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none"
                  >
                    <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            v.images && v.images.length > 0
                              ? v.images[0]
                              : FALLBACK_IMG
                          }
                          className="h-10 w-14 object-cover rounded shrink-0"
                          alt=""
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 text-sm truncate flex items-center gap-2 flex-wrap">
                            {v.brand} {v.model} {v.variant}
                            {v.vehicleType && (
                              <Badge
                                className={`${v.vehicleType === "PREMIUM"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                  } border-0 text-[10px] px-1.5 py-0.5 font-bold rounded`}
                              >
                                {v.vehicleType}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {v.dealerContactName ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm py-4">
                      {formatINR(v.askingPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4">
                      {formatKM(v.kilometerDriven)} · {v.fuelType}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 py-4">
                      {v.city}
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={v.vehicleStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-slate-400 py-4 pr-6">
                      {v.registrationYear}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
