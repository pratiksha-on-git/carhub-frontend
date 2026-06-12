import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Star, Trash2 } from "lucide-react";
import { vehicleService } from "@/services/vehicleService";
import { useState } from "react";
import { toast } from "sonner";
import { formatINR } from "@/utils/helpers";

export default function AdminVehicles() {
  const [, force] = useState(0);
  const list = vehicleService.list().slice(0, 30);
  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Vehicle</TableHead><TableHead className="hidden sm:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>{list.map((v) => (
          <TableRow key={v.id}>
            <TableCell><div className="flex items-center gap-3"><img src={v.images[0]} className="h-10 w-14 object-cover rounded" alt="" /><div className="min-w-0"><div className="font-medium truncate">{v.title}</div><div className="text-xs text-muted-foreground">{v.city}</div></div></div></TableCell>
            <TableCell className="hidden sm:table-cell">{formatINR(v.price)}</TableCell>
            <TableCell className="hidden md:table-cell">{v.featured ? <Badge className="bg-warning text-warning-foreground border-0">Featured</Badge> : <Badge variant="secondary">{v.status}</Badge>}</TableCell>
            <TableCell className="text-right"><div className="flex gap-1 justify-end">
              <Button size="sm" variant="ghost" className="text-success" onClick={() => { vehicleService.update(v.id, { status: "Approved" }); toast.success("Approved"); force((n)=>n+1); }}><Check className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { vehicleService.update(v.id, { status: "Rejected" }); toast.success("Rejected"); force((n)=>n+1); }}><X className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-warning-foreground" onClick={() => { vehicleService.update(v.id, { featured: !v.featured }); toast.success(v.featured ? "Unfeatured" : "Featured"); force((n)=>n+1); }}><Star className={`h-4 w-4 ${v.featured ? "fill-warning text-warning" : ""}`} /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { vehicleService.remove(v.id); toast.success("Deleted"); force((n)=>n+1); }}><Trash2 className="h-4 w-4" /></Button>
            </div></TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
