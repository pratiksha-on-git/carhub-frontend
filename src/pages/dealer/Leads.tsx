import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { leadService } from "@/services/leadService";
import { useState } from "react";
import type { LeadStatus } from "@/types";
import { formatDate } from "@/utils/helpers";

const COLORS: Record<LeadStatus, string> = {
  New: "bg-accent/15 text-accent",
  Contacted: "bg-warning/20 text-warning-foreground",
  Converted: "bg-success/15 text-success",
};

export default function DealerLeads() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d1";
  const [, force] = useState(0);
  const list = leadService.byDealer(dealerId);

  const updateStatus = (id: string, status: LeadStatus) => {
    leadService.update(id, { status });
    force((n) => n + 1);
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Mobile</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.customerName}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{l.mobile}</TableCell>
                <TableCell className="text-sm truncate max-w-[240px]">{l.vehicleTitle}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
                <TableCell>
                  <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v as LeadStatus)}>
                    <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <a href={`tel:${l.mobile}`}><Button size="sm" variant="ghost"><Phone className="h-4 w-4" /></Button></a>
                    <a href={`https://wa.me/${l.mobile.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost" className="text-success"><MessageCircle className="h-4 w-4" /></Button></a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
