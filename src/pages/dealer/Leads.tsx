import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MessageCircle, Search, RefreshCw, Download } from "lucide-react";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { useState } from "react";
import type { LeadStatus } from "@/types";
import { formatDate } from "@/utils/helpers";
import { useGetLeads } from "@/hooks/dealer/useGetLeads";
import { useUpdateLeadStatus } from "@/hooks/dealer/useUpdateLeadStatus";
import { toast } from "sonner";

const COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700 hover:bg-blue-100/80",
  Contacted: "bg-amber-50 text-amber-700 hover:bg-amber-100/80",
  Converted: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80",
};

export default function DealerLeads() {
  const { user } = useDealerAuth();
  const dealerId = user?.id || "";

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: leads = [],
    isLoading: fetching,
    refetch,
    isRefetching,
  } = useGetLeads(dealerId);
  const statusMutation = useUpdateLeadStatus(dealerId);

  const updateStatus = (leadId: string, status: LeadStatus) => {
    statusMutation.mutate(
      { leadId, status },
      {
        onSuccess: () => toast.success("Lead status updated successfully"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const filteredLeads = leads.filter((l) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      l.customerName?.toLowerCase().includes(searchLower) ||
      l.mobile?.toLowerCase().includes(searchLower) ||
      l.customerCity?.toLowerCase().includes(searchLower) ||
      l.vehicleTitle?.toLowerCase().includes(searchLower) ||
      l.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Sr No", "Lead ID", "Customer Name", "Mobile", "City", "Vehicle", "Date", "Status"];
    const csvData = filteredLeads.map((l, idx) => ({
      srNo: idx + 1,
      uniqueLeadId: l.uniqueLeadId || "",
      customerName: l.customerName || "",
      mobile: l.mobile || "",
      customerCity: l.customerCity || "",
      vehicleTitle: l.vehicleTitle || "",
      createdAt: formatDate(l.createdAt),
      status: l.status || "",
    }));

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => [
        row.srNo,
        `"${row.uniqueLeadId.replace(/"/g, '""')}"`,
        `"${row.customerName.replace(/"/g, '""')}"`,
        `"${row.mobile.replace(/"/g, '""')}"`,
        `"${row.customerCity.replace(/"/g, '""')}"`,
        `"${row.vehicleTitle.replace(/"/g, '""')}"`,
        `"${row.createdAt.replace(/"/g, '""')}"`,
        `"${row.status.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Leads
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filteredLeads.length} leads
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            className="gap-2 h-10 bg-white rounded-xl hover:bg-slate-50 hover:text-slate-900 shrink-0"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={fetching || isRefetching}
            className="h-10 w-10 bg-white rounded-xl shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${fetching || isRefetching ? "animate-spin" : ""}`}
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
                <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Lead ID
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
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Status
                </TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
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
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-8 w-28 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <div className="flex gap-1.5 justify-end">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {searchQuery
                      ? "No matching leads found."
                      : "No leads found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((l, idx) => (
                  <TableRow
                    key={l.id}
                    className="hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-none"
                  >
                    <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold capitalize text-slate-900 text-center text-sm py-4">
                      {l.uniqueLeadId || "-"}
                    </TableCell>
                    <TableCell className="font-semibold capitalize text-slate-900 text-left text-sm py-4">
                      {l.customerName || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 text-left py-4">
                      {l.mobile}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 text-left py-4 capitalize">
                      {l.customerCity || "-"}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600 truncate max-w-[240px] text-left py-4">
                      {l.vehicleTitle}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400 text-left py-4">
                      {formatDate(l.createdAt)}
                    </TableCell>
                    <TableCell className="text-left py-4">
                      <Select
                        value={l.status}
                        onValueChange={(v) =>
                          updateStatus(l.id, v as LeadStatus)
                        }
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger
                          className={`h-8 w-[120px] text-[11px] font-bold border-0 rounded-full px-3 py-1 shadow-sm shrink-0 cursor-pointer ${COLORS[l.status]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-slate-100 shadow-lg p-1">
                          <SelectItem
                            value="New"
                            className="rounded-lg cursor-pointer focus:bg-blue-50 data-[highlighted]:bg-blue-50"
                          >
                            <span className="text-blue-600 font-semibold text-xs">
                              New
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Contacted"
                            className="rounded-lg cursor-pointer focus:bg-amber-50 data-[highlighted]:bg-amber-50"
                          >
                            <span className="text-amber-600 font-semibold text-xs">
                              Contacted
                            </span>
                          </SelectItem>
                          <SelectItem
                            value="Converted"
                            className="rounded-lg cursor-pointer focus:bg-emerald-50 data-[highlighted]:bg-emerald-50"
                          >
                            <span className="text-emerald-600 font-semibold text-xs">
                              Converted
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
