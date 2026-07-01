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
import { Search, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  useAdminSubscriptions,
  useApprovePayment,
} from "@/hooks/admin/useAdminSubscriptions";
import { toast } from "sonner";

export default function AdminSubscriptions() {
  const [subSearch, setSubSearch] = useState("");
  const {
    data: subscriptions = [],
    isLoading: subLoading,
    refetch: refetchSub,
    isFetching: subFetching,
  } = useAdminSubscriptions();
  const approveMutation = useApprovePayment();

  const filteredSubs = subscriptions.filter(
    (s) =>
      s.dealerName?.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.subscriptionPlan?.toLowerCase().includes(subSearch.toLowerCase()),
  );

  const handleApprove = async (paymentId: number) => {
    try {
      await approveMutation.mutateAsync(paymentId);
      toast.success("Payment approved successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to approve payment");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Subscriptions
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filteredSubs.length} dealer subscriptions
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dealer or plan..."
              value={subSearch}
              onChange={(e) => setSubSearch(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchSub()}
            disabled={subFetching}
            className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${subFetching ? "animate-spin" : ""}`}
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
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-4">
                  Dealer
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Plan
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Start Date
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  End Date
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Payment ID
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-sub-${idx}`}
                    className="border-b border-slate-100/80 last:border-none"
                  >
                    <TableCell className="text-center py-4">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Skeleton className="h-8 w-24 ml-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredSubs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {subSearch
                      ? "No matching subscriptions found."
                      : "No subscriptions found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubs.map((s, idx) => (
                  <TableRow
                    key={s.dealerId}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none"
                  >
                    <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold capitalize text-slate-900 text-sm py-4 pl-4">
                      {s.dealerName}
                    </TableCell>
                    <TableCell className="py-4">
                      {s.subscriptionPlan ? (
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs font-bold rounded-full px-3">
                          {s.subscriptionPlan}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4">
                      {s.subscriptionStartDate
                        ? new Date(s.subscriptionStartDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4">
                      {s.subscriptionEndDate
                        ? new Date(s.subscriptionEndDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 font-mono py-4">
                      {s.paymentId ?? "—"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={
                          s.subscriptionActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold rounded-full px-3"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-500 text-xs font-bold rounded-full px-3"
                        }
                      >
                        {s.subscriptionActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      {!s.subscriptionActive && s.paymentId ? (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 h-8 rounded-lg cursor-pointer transition-colors"
                          disabled={approveMutation.isPending}
                          onClick={() => handleApprove(s.paymentId!)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">
                          —
                        </span>
                      )}
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
