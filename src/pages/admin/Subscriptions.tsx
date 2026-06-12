import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dealerService } from "@/services/dealerService";

export default function AdminSubscriptions() {
  const dealers = dealerService.list();
  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Dealer</TableHead><TableHead className="hidden sm:table-cell">City</TableHead>
          <TableHead>Plan</TableHead><TableHead className="hidden md:table-cell">Listings</TableHead>
          <TableHead>Status</TableHead>
        </TableRow></TableHeader>
        <TableBody>{dealers.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium">{d.businessName}</TableCell>
            <TableCell className="hidden sm:table-cell">{d.city}</TableCell>
            <TableCell><Badge className="bg-accent/15 text-accent border-0">{d.subscription}</Badge></TableCell>
            <TableCell className="hidden md:table-cell">{d.totalListings}</TableCell>
            <TableCell><Badge variant="secondary">{d.status}</Badge></TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
