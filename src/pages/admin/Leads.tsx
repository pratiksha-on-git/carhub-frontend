import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { useAdminLeads, type AdminLead } from "@/hooks/admin/useAdminLeads";

const leadStatusStyle: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 border-blue-200",
  CONVERTED: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-muted text-muted-foreground",
  PENDING: "bg-warning/20 text-warning-foreground",
};

export default function AdminLeads() {
  const [search, setSearch] = useState("");
  const { data: leads = [], isLoading, refetch, isFetching, error } = useAdminLeads();

  if (error) console.error("[AdminLeads] fetch error:", error);

  const getVehicleLabel = (v: AdminLead["vehicleName"]) => {
    try {
      if (typeof v === "object" && v !== null) return `${v.brand} ${v.model} ${v.variant}`;
      return String(v ?? "");
    } catch { return ""; }
  };

  const filtered = leads.filter((l) => {
    try {
      const vehicle = getVehicleLabel(l.vehicleName);
      return (
        l.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.toLowerCase().includes(search.toLowerCase()) ||
        l.customerCity?.toLowerCase().includes(search.toLowerCase()) ||
        l.customerMobile?.includes(search)
      );
    } catch { return true; }
  });

  return (
    <Card>
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer, vehicle, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Mobile</TableHead>
            <TableHead className="hidden sm:table-cell">City</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No leads found.</TableCell></TableRow>
            ) : filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.customerName}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{l.customerMobile}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{l.customerCity}</TableCell>
                <TableCell className="text-sm">
                  {typeof l.vehicleName === "object" && l.vehicleName
                    ? `${l.vehicleName.brand} ${l.vehicleName.model} ${l.vehicleName.variant}`
                    : l.vehicleName ?? "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {l.enquiryDate ? new Date(l.enquiryDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge className={`${leadStatusStyle[l.leadStatus] ?? "bg-muted text-foreground"} border text-xs`}>
                    {l.leadStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
