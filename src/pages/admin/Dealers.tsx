import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminDealers, useUpdateDealerStatus } from "@/hooks/admin/useAdminDealers";

const statusStyle: Record<string, string> = {
  APPROVED: "bg-success/15 text-success",
  PENDING: "bg-warning/20 text-warning-foreground",
  SUSPENDED: "bg-muted text-foreground/70",
  REJECTED: "bg-destructive/15 text-destructive",
};

export default function AdminDealers() {
  const [search, setSearch] = useState("");
  const { data: dealers = [], isLoading, refetch, isFetching } = useAdminDealers();
  const { mutate: updateStatus, isPending } = useUpdateDealerStatus();

  const filtered = dealers.filter((d) =>
    d.businessName.toLowerCase().includes(search.toLowerCase()) ||
    d.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase())
  );

  const approve = (dealerId: number) => {
    updateStatus(
      { dealerId, status: "Approved" },
      {
        onSuccess: (res) => toast.success(res?.message ?? "Dealer approved"),
        onError: (err: any) => toast.error(err?.response?.data?.message ?? "Action failed"),
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dealers..."
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
            <TableHead>Business</TableHead>
            <TableHead className="hidden sm:table-cell">City</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No dealers found.</TableCell></TableRow>
            ) : filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${d.dealerLogo}`}
                      className="h-9 w-9 rounded object-cover"
                      alt=""
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div>
                      <div className="font-medium">{d.businessName}</div>
                      <div className="text-xs text-muted-foreground">{d.ownerName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{d.city}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-xs">{d.mobile}</div>
                  <div className="text-xs text-muted-foreground">{d.email}</div>
                </TableCell>
                <TableCell>
                  {d.dealerAccountStatus === "PENDING" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 h-7 px-2 rounded-full bg-warning/20 text-warning-foreground hover:bg-green-500 hover:text-white transition-colors"
                      onClick={() => approve(d.id)}
                      disabled={isPending}
                      title="Click to approve"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">PENDING</span>
                    </Button>
                  ) : (
                    <Badge className={`${statusStyle[d.dealerAccountStatus] ?? ""} border-0`}>
                      {d.dealerAccountStatus}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
