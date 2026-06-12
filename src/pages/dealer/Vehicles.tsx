import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { vehicleService } from "@/services/vehicleService";
import { formatINR, formatKM } from "@/utils/helpers";
import { useState } from "react";
import { toast } from "sonner";

export default function DealerVehicles() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d1";
  const [, setTick] = useState(0);
  const list = vehicleService.byDealer(dealerId);

  const remove = (id: string) => {
    vehicleService.remove(id);
    toast.success("Vehicle removed");
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">{list.length} vehicles in your inventory</p>
        <Button asChild className="gradient-primary text-white border-0 gap-2"><Link to="/dealer/vehicles/add"><Plus className="h-4 w-4" /> Add Vehicle</Link></Button>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="hidden md:table-cell">KM</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={v.images[0]} alt="" className="h-12 w-16 object-cover rounded shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{v.title}</div>
                        <div className="text-xs text-muted-foreground">{v.city} · {v.year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatKM(v.kmDriven)}</TableCell>
                  <TableCell className="font-semibold">{formatINR(v.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {v.featured ? <Badge className="bg-warning text-warning-foreground border-0 gap-1"><Star className="h-3 w-3 fill-current" /> Featured</Badge> : <Badge variant="secondary">Active</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button asChild size="sm" variant="ghost"><Link to={`/dealer/vehicles/edit/${v.id}`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
