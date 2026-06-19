import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCw } from "lucide-react";
import { useAdminSubscriptions, useAdminPayments } from "@/hooks/admin/useAdminSubscriptions";

export default function AdminSubscriptions() {
  const [subSearch, setSubSearch] = useState("");
  const [paySearch, setPaySearch] = useState("");
  const { data: subscriptions = [], isLoading: subLoading, refetch: refetchSub, isFetching: subFetching } = useAdminSubscriptions();
  const { data: payments = [], isLoading: payLoading, refetch: refetchPay, isFetching: payFetching } = useAdminPayments();

  const filteredSubs = subscriptions.filter((s) =>
    s.dealerName?.toLowerCase().includes(subSearch.toLowerCase()) ||
    s.subscriptionPlan?.toLowerCase().includes(subSearch.toLowerCase())
  );

  const successPayments = payments
    .filter((p) => p.paymentStatus?.toUpperCase() === "SUCCESS")
    .filter((p) =>
      p.transactionId?.toLowerCase().includes(paySearch.toLowerCase()) ||
      p.subscriptionPlan?.toLowerCase().includes(paySearch.toLowerCase())
    );

  return (
    <Tabs defaultValue="subscriptions">
      <TabsList className="mb-4">
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="payments">Payment Success</TabsTrigger>
      </TabsList>

      <TabsContent value="subscriptions">
        <Card>
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search dealer or plan..." value={subSearch} onChange={(e) => setSubSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchSub()} disabled={subFetching}>
              <RefreshCw className={`h-4 w-4 ${subFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Dealer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">Start Date</TableHead>
                <TableHead className="hidden md:table-cell">End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {subLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filteredSubs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No subscriptions found.</TableCell></TableRow>
                ) : filteredSubs.map((s) => (
                  <TableRow key={s.dealerId}>
                    <TableCell className="font-medium">{s.dealerName}</TableCell>
                    <TableCell>
                      {s.subscriptionPlan
                        ? <Badge className="bg-accent/15 text-accent border-0">{s.subscriptionPlan}</Badge>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {s.subscriptionStartDate ? new Date(s.subscriptionStartDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {s.subscriptionEndDate ? new Date(s.subscriptionEndDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={s.subscriptionActive ? "bg-green-500/15 text-green-600 border-0" : "bg-muted text-muted-foreground border-0"}>
                        {s.subscriptionActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transaction or plan..." value={paySearch} onChange={(e) => setPaySearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchPay()} disabled={payFetching}>
              <RefreshCw className={`h-4 w-4 ${payFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Dealer ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {payLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : successPayments.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No successful payments found.</TableCell></TableRow>
                ) : successPayments.map((p) => (
                  <TableRow key={p.transactionId}>
                    <TableCell className="font-mono text-xs">{p.transactionId ?? "—"}</TableCell>
                    <TableCell>{p.dealerId}</TableCell>
                    <TableCell>
                      {p.subscriptionPlan
                        ? <Badge className="bg-accent/15 text-accent border-0">{p.subscriptionPlan}</Badge>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{p.amount != null ? `₹${p.amount.toLocaleString("en-IN")}` : "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}</TableCell>
                    <TableCell><Badge className="bg-green-500/15 text-green-600 border-0">Success</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
