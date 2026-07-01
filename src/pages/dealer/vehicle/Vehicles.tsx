import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { formatINR, formatKM } from "@/utils/helpers";
import { useState } from "react";
import { toast } from "sonner";
import VehicleForm from "./VehicleForm";
import { useGetVehicles } from "@/hooks/dealer/useGetVehicles";
import { useDeleteVehicle } from "@/hooks/dealer/useDeleteVehicle";
import { useUpdateVehicleStatus } from "@/hooks/dealer/useUpdateVehicleStatus";

export default function DealerVehicles() {
  const navigate = useNavigate();
  const { user } = useDealerAuth();
  const dealerId = user?.id || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  );

  const {
    data: vehicles = [],
    isLoading: fetching,
    refetch,
    isRefetching,
  } = useGetVehicles(dealerId);
  const deleteMutation = useDeleteVehicle(dealerId);
  const statusMutation = useUpdateVehicleStatus(dealerId);

  const handleRemove = async (id: number) => {
    setDeletingId(id);
    deleteMutation.mutate(id.toString(), {
      onSuccess: () => {
        refetch();
      },
      onSettled: () => setDeletingId(null),
    });
  };

  const handleStatusChange = (vehicleId: number, status: string) => {
    statusMutation.mutate(
      { vehicleId, status },
      {
        onSuccess: () => {
          toast.success("Status updated");
          refetch();
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedVehicleId(null);
    refetch();
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
      v.registrationYear?.toString().includes(searchLower) ||
      v.vehicleType?.toLowerCase().includes(searchLower)
    );
  });

  const handleExportCSV = () => {
    const headers = [
      "Sr No",
      "Brand",
      "Model",
      "Variant",
      "Registration Year",
      "KM Driven",
      "Asking Price",
      "Fuel Type",
      "Transmission",
      "Ownership",
      "City",
      "Vehicle Type",
      "Insurance Status",
      "Status",
      "RTO Info",
      "Finance Availability"
    ];

    const csvData = filteredVehicles.map((v, idx) => ({
      srNo: idx + 1,
      brand: v.brand || "",
      model: v.model || "",
      variant: v.variant || "",
      registrationYear: v.registrationYear || "",
      kilometerDriven: v.kilometerDriven || 0,
      askingPrice: v.askingPrice || 0,
      fuelType: v.fuelType || "",
      transmission: v.transmission || "",
      ownershipDetails: v.ownershipDetails || "",
      city: v.city || "",
      vehicleType: v.vehicleType || "NON_PREMIUM",
      insuranceStatus: v.insuranceStatus || "",
      vehicleStatus: v.vehicleStatus || "",
      rtoInformation: v.rtoInformation || "",
      financeAvailability: v.financeAvailability !== undefined ? (v.financeAvailability ? "Available" : "Not Available") : "Available",
    }));

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => [
        row.srNo,
        `"${row.brand.replace(/"/g, '""')}"`,
        `"${row.model.replace(/"/g, '""')}"`,
        `"${row.variant.replace(/"/g, '""')}"`,
        row.registrationYear,
        row.kilometerDriven,
        row.askingPrice,
        `"${row.fuelType.replace(/"/g, '""')}"`,
        `"${row.transmission.replace(/"/g, '""')}"`,
        `"${row.ownershipDetails.replace(/"/g, '""')}"`,
        `"${row.city.replace(/"/g, '""')}"`,
        `"${row.vehicleType.replace(/"/g, '""')}"`,
        `"${row.insuranceStatus.replace(/"/g, '""')}"`,
        `"${row.vehicleStatus.replace(/"/g, '""')}"`,
        `"${row.rtoInformation.replace(/"/g, '""')}"`,
        `"${row.financeAvailability.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Inventory
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filteredVehicles.length} vehicles
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full "
            />
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={filteredVehicles.length === 0}
            className="gap-2 h-10 bg-white rounded-xl hover:bg-slate-50 hover:text-slate-900 shrink-0"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={fetching || isRefetching}
            className="h-10 w-10 bg-white rounded-xl shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${fetching || isRefetching ? "animate-spin" : ""}`}
            />
          </Button>

          <Button
            onClick={() => {
              setSelectedVehicleId(null);
              setIsModalOpen(true);
            }}
            className="gradient-primary text-white border-0 gap-2 h-10 rounded-xl shrink-0 px-3 sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
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
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Vehicle
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  KM
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Price
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className="border-b border-slate-100/80 last:border-none"
                  >
                    <TableCell className="w-16 text-center py-4">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3.5">
                        <Skeleton className="h-12 w-18 rounded-lg shrink-0" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <div className="flex gap-1.5 justify-end">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {searchQuery
                      ? "No matching vehicles found."
                      : "No vehicles found. Add one to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((v, idx) => {
                  const isDeleting =
                    deleteMutation.isPending && deletingId === v.id;
                  return (
                    <TableRow
                      key={v.id}
                      className="hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-none"
                    >
                      <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                        {idx + 1}
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {v.images?.length ? (
                            <img
                              src={v.images[0]}
                              alt={`${v.brand} ${v.model}`}
                              className="h-12 w-18 object-cover rounded-lg border border-slate-100 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-18 bg-muted rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-semibold text-slate-400">
                                NO IMAGE
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 text-left text-sm leading-snug flex items-center gap-2 flex-wrap">
                              {v.registrationYear} {v.brand} {v.model}
                              {v.vehicleType && (
                                <Badge
                                  className={`${v.vehicleType === "PREMIUM"
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                    } border-0 text-[10px] px-1.5 py-0.5 font-bold rounded`}
                                >
                                  {v.vehicleType}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 text-left mt-0.5">
                              {v.variant} • {v.fuelType} • {v.transmission} •{" "}
                              {v.city}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-left text-slate-600 text-sm py-4 font-medium">
                        {formatKM(v.kilometerDriven)}
                      </TableCell>

                      <TableCell className="font-bold text-left text-slate-900 text-sm py-4">
                        {formatINR(v.askingPrice)}
                      </TableCell>

                      <TableCell className="text-left py-4">
                        <Select
                          value={v.vehicleStatus}
                          onValueChange={(status) =>
                            handleStatusChange(v.id, status)
                          }
                          disabled={statusMutation.isPending}
                        >
                          <SelectTrigger
                            className={`h-8 w-[110px] text-[11px] font-bold border-0 rounded-full px-3 py-1 shadow-sm shrink-0 cursor-pointer ${v.vehicleStatus === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80"
                              : v.vehicleStatus === "INACTIVE"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100/80"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100/80"
                              }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-slate-100 shadow-lg p-1">
                            <SelectItem
                              value="ACTIVE"
                              className="rounded-lg cursor-pointer focus:bg-emerald-50 data-[highlighted]:bg-emerald-50"
                            >
                              <span className="text-emerald-600 font-semibold text-xs">
                                ● Active
                              </span>
                            </SelectItem>
                            <SelectItem
                              value="INACTIVE"
                              className="rounded-lg cursor-pointer focus:bg-rose-50 data-[highlighted]:bg-rose-50"
                            >
                              <span className="text-rose-600 font-semibold text-xs">
                                ● Inactive
                              </span>
                            </SelectItem>
                            <SelectItem
                              value="FEATURED"
                              className="rounded-lg cursor-pointer focus:bg-amber-50 data-[highlighted]:bg-amber-50"
                            >
                              <span className="text-amber-600 font-semibold text-xs">
                                ★ Featured
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right py-4 pr-6">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => navigate(`/dealer/vehicles/${v.id}`)}
                            className="h-8 w-8 bg-yellow-100 rounded-lg text-yellow-400 hover:bg-yellow-300 hover:text-yellow-700 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVehicleId(v.id);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 bg-blue-100 rounded-lg text-blue-400 hover:bg-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg bg-rose-100 text-rose-400 hover:bg-rose-300 hover:text-rose-700 transition-colors cursor-pointer"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleRemove(v.id)}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
        <DialogContent className="sm:max-w-5xl bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicleId ? "Update Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicleId={selectedVehicleId ?? undefined}
            onSuccess={handleSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
