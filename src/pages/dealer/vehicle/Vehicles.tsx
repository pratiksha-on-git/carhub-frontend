import { Plus, Pencil, Trash2, Loader2, Search, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatINR, formatKM } from "@/utils/helpers";
import { useState } from "react";
import { toast } from "sonner";
import VehicleForm from "./VehicleForm";
import { useGetVehicles } from "@/hooks/dealer/useGetVehicles";
import { useDeleteVehicle } from "@/hooks/dealer/useDeleteVehicle";
import { useUpdateVehicleStatus } from "@/hooks/dealer/useUpdateVehicleStatus";

export default function DealerVehicles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.id || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const { data: vehicles = [], isLoading: fetching, refetch, isRefetching } = useGetVehicles(dealerId);
  const deleteMutation = useDeleteVehicle(dealerId);
  const statusMutation = useUpdateVehicleStatus(dealerId);

  const handleRemove = async (id: number) => {
    setDeletingId(id);
    deleteMutation.mutate(id.toString(), {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleStatusChange = (vehicleId: number, status: string) => {
    statusMutation.mutate({ vehicleId, status }, {
      onSuccess: () => toast.success("Status updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedVehicleId(null);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      v.brand?.toLowerCase().includes(searchLower) ||
      v.model?.toLowerCase().includes(searchLower) ||
      v.variant?.toLowerCase().includes(searchLower) ||
      v.city?.toLowerCase().includes(searchLower) ||
      v.fuelType?.toLowerCase().includes(searchLower) ||
      v.transmission?.toLowerCase().includes(searchLower) ||
      v.registrationYear?.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h2>
          <p className="text-base text-slate-500 mt-1">{filteredVehicles.length} vehicles</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
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

          <Button
            onClick={() => { setSelectedVehicleId(null); setIsModalOpen(true); }}
            className="gradient-primary text-white border-0 gap-2 h-10 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Sr No</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No matching vehicles found." : "No vehicles found. Add one to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((v, idx) => {
                  const isDeleting = deleteMutation.isPending && deletingId === v.id;
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="text-muted-foreground text-sm font-medium">{idx + 1}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          {v.images?.length ? (
                            <img
                              src={v.images[0]}
                              alt={`${v.brand} ${v.model}`}
                              className="h-12 w-16 object-cover rounded shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-16 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No Image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-left">
                              {v.registrationYear} {v.brand} {v.model} {v.variant}
                            </div>
                            <div className="text-xs text-muted-foreground text-left">
                              {v.fuelType} • {v.transmission} • {v.city}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-left">{formatKM(v.kilometerDriven)}</TableCell>

                      <TableCell className="font-semibold text-left">{formatINR(v.askingPrice)}</TableCell>

                      <TableCell className="text-left">
                        <Select
                          value={v.vehicleStatus}
                          onValueChange={(status) => handleStatusChange(v.id, status)}
                          disabled={statusMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 w-28 text-xs font-semibold border-0 rounded-full ${
                            v.vehicleStatus === "ACTIVE" ? "bg-green-100 text-green-700" :
                            v.vehicleStatus === "INACTIVE" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">
                              <span className="text-green-600 font-semibold">● Active</span>
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              <span className="text-red-600 font-semibold">● Inactive</span>
                            </SelectItem>
                            <SelectItem value="FEATURED">
                              <span className="text-amber-600 font-semibold">★ Featured</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/dealer/vehicles/${v.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setSelectedVehicleId(v.id); setIsModalOpen(true); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleRemove(v.id)}
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selectedVehicleId ? "Update Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>
          <VehicleForm vehicleId={selectedVehicleId ?? undefined} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
