import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, RefreshCw, Loader2, Search } from "lucide-react";
import { useAllVehicles } from "@/hooks/public/useAllVehicles";
import { formatINR, formatKM } from "@/utils/helpers";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "ACTIVE") return <Badge className="bg-green-100 text-green-700 border-green-200 border">Active</Badge>;
  if (s === "INACTIVE") return <Badge className="bg-red-100 text-red-700 border-red-200 border">Inactive</Badge>;
  if (s === "FEATURED") return <Badge className="bg-blue-100 text-blue-700 border-blue-200 border">Featured</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export default function AdminVehicles() {
  const [search, setSearch] = useState("");
  const { vehicles, loading, error, refetch } = useAllVehicles();

  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model} ${v.variant}`.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase()) ||
    v.fuelType?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading vehicles…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold">Failed to load vehicles</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <Button onClick={refetch} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brand, model, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">KM / Fuel</TableHead>
              <TableHead className="hidden lg:table-cell">City</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : filtered.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={v.images && v.images.length > 0 ? v.images[0] : FALLBACK_IMG}
                      className="h-10 w-14 object-cover rounded"
                      alt=""
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{v.brand} {v.model} {v.variant}</div>
                      <div className="text-xs text-muted-foreground">{v.dealerContactName ?? "—"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell font-semibold">{formatINR(v.askingPrice)}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatKM(v.kilometerDriven)} · {v.fuelType}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{v.city}</TableCell>
                <TableCell className="hidden md:table-cell"><StatusBadge status={v.vehicleStatus} /></TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{v.registrationYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
