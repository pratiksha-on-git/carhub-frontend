import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MessageCircle, Search, RefreshCw } from "lucide-react";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { useState } from "react";
import type { LeadStatus } from "@/types";
import { formatDate } from "@/utils/helpers";
import { useGetLeads } from "@/hooks/dealer/useGetLeads";
import { useUpdateLeadStatus } from "@/hooks/dealer/useUpdateLeadStatus";
import { toast } from "sonner";

const COLORS: Record<LeadStatus, string> = {
  New: "bg-accent/15 text-accent",
  Contacted: "bg-warning/20 text-warning-foreground",
  Converted: "bg-success/15 text-success",
};

export default function DealerLeads() {
  const { user } = useDealerAuth();
  const dealerId = user?.id || "";

  const [searchQuery, setSearchQuery] = useState("");

  const { data: leads = [], isLoading: fetching, refetch, isRefetching } = useGetLeads(dealerId);
  const statusMutation = useUpdateLeadStatus(dealerId);

  const updateStatus = (leadId: string, status: LeadStatus) => {
    statusMutation.mutate({ leadId, status }, {
      onSuccess: () => toast.success("Lead status updated successfully"),
      onError: (err) => toast.error(err.message),
    });
  };

  const filteredLeads = leads.filter((l) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      l.customerName?.toLowerCase().includes(searchLower) ||
      l.mobile?.toLowerCase().includes(searchLower) ||
      l.vehicleTitle?.toLowerCase().includes(searchLower) ||
      l.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Leads</h2>
          <p className="text-base text-slate-500 mt-1">{filteredLeads.length} leads</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={fetching || isRefetching}
            className="h-10 w-10 bg-white rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${fetching || isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Sr No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Mobile</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell className="w-14"><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28 rounded-full" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No matching leads found." : "No leads found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((l, idx) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-muted-foreground text-sm font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-left">{l.customerName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground text-left">{l.mobile}</TableCell>
                    <TableCell className="text-sm truncate max-w-[240px] text-left">{l.vehicleTitle}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground text-left">{formatDate(l.createdAt)}</TableCell>
                    <TableCell className="text-left">
                      <Select
                        value={l.status}
                        onValueChange={(v) => updateStatus(l.id, v as LeadStatus)}
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger className={`h-8 w-[130px] text-xs font-semibold border-0 rounded-full ${COLORS[l.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <a href={`tel:${l.mobile}`}>
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href={`https://wa.me/${l.mobile.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="text-success">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
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
