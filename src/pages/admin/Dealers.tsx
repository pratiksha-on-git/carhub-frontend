import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Ban, X, Trash2 } from "lucide-react";
import { dealerService } from "@/services/dealerService";
import { useState } from "react";
import { toast } from "sonner";
import type { Dealer, DealerStatus } from "@/types";

const variant: Record<DealerStatus, string> = {
  Approved: "bg-success/15 text-success",
  Pending: "bg-warning/20 text-warning-foreground",
  Suspended: "bg-muted text-foreground/70",
  Rejected: "bg-destructive/15 text-destructive",
};

export default function AdminDealers() {
  const [, force] = useState(0);
  const dealers = dealerService.list();
  const act = (id: string, patch: Partial<Dealer>, msg: string) => {
    dealerService.update(id, patch); toast.success(msg); force((n) => n + 1);
  };
  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Business</TableHead><TableHead className="hidden sm:table-cell">City</TableHead>
          <TableHead className="hidden md:table-cell">Plan</TableHead><TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>{dealers.map((d) => (
          <TableRow key={d.id}>
            <TableCell><div className="flex items-center gap-3"><img src={d.logo} className="h-9 w-9 rounded object-cover" alt="" /><div><div className="font-medium">{d.businessName}</div><div className="text-xs text-muted-foreground">{d.ownerName}</div></div></div></TableCell>
            <TableCell className="hidden sm:table-cell">{d.city}</TableCell>
            <TableCell className="hidden md:table-cell"><Badge variant="secondary">{d.subscription}</Badge></TableCell>
            <TableCell><Badge className={`${variant[d.status]} border-0`}>{d.status}</Badge></TableCell>
            <TableCell className="text-right"><div className="flex gap-1 justify-end">
              <Button size="sm" variant="ghost" className="text-success" onClick={() => act(d.id, { status: "Approved", verified: true }, "Dealer approved")}><Check className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => act(d.id, { status: "Rejected" }, "Dealer rejected")}><X className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => act(d.id, { status: "Suspended" }, "Dealer suspended")}><Ban className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div></TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
