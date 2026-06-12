import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { leadService } from "@/services/leadService";
import { formatDate } from "@/utils/helpers";

export default function AdminLeads() {
  const leads = leadService.list().slice(0, 50);
  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Customer</TableHead><TableHead className="hidden sm:table-cell">Mobile</TableHead>
          <TableHead>Vehicle</TableHead><TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow></TableHeader>
        <TableBody>{leads.map((l) => (
          <TableRow key={l.id}>
            <TableCell className="font-medium">{l.customerName}</TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{l.mobile}</TableCell>
            <TableCell className="text-sm truncate max-w-[260px]">{l.vehicleTitle}</TableCell>
            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
            <TableCell><Badge variant="secondary">{l.status}</Badge></TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
