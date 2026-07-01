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
import { Search, RefreshCw } from "lucide-react";
import { useAdminLeads, type AdminLead } from "@/hooks/admin/useAdminLeads";

const leadStatusStyle: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-500 hover:border-slate-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200",
  CONTACTED: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200",
};

export default function AdminLeads() {
  const [search, setSearch] = useState("");
  const {
    data: leads = [],
    isLoading,
    refetch,
    isFetching,
    error,
  } = useAdminLeads();

  if (error) console.error("[AdminLeads] fetch error:", error);

  const getVehicleLabel = (v: AdminLead["vehicleName"]) => {
    try {
      if (typeof v === "object" && v !== null)
        return `${v.brand} ${v.model} ${v.variant}`;
      return String(v ?? "");
    } catch {
      return "";
    }
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
    } catch {
      return true;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Leads
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filtered.length} leads
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer, vehicle, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
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
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider text-center py-4">
                  Lead Id
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Mobile
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  City
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Vehicle
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Date
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className="border-b border-slate-100/80 last:border-none"
                  >
                    <TableCell className="w-16 text-center py-4">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {search ? "No matching leads found." : "No leads found."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l, idx) => (
                  <TableRow
                    key={l.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none"
                  >
                    <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold capitalize text-slate-900 text-center text-sm py-4">
                      {l.uniqueLeadId || "-"}
                    </TableCell>
                    <TableCell className="font-semibold capitalize text-slate-900 text-sm py-4">
                      {l.customerName}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4">
                      {l.customerMobile}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 capitalize py-4">
                      {l.customerCity ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600 truncate max-w-[240px] py-4">
                      {typeof l.vehicleName === "object" && l.vehicleName
                        ? `${l.vehicleName.brand} ${l.vehicleName.model} ${l.vehicleName.variant}`
                        : (l.vehicleName ?? "—")}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400 py-4">
                      {l.enquiryDate
                        ? new Date(l.enquiryDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <Badge
                        className={`${leadStatusStyle[l.leadStatus] ?? "bg-slate-100 text-slate-600 border-slate-200"} border text-xs font-bold rounded-full px-3`}
                      >
                        {l.leadStatus}
                      </Badge>
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
