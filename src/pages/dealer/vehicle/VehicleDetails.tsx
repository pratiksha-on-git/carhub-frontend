import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Car, Fuel, Settings, Users, MapPin, Calendar, Gauge, Shield, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useGetVehicleDetails } from "@/hooks/dealer/useGetVehicleDetails";

export default function DealerVehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const { data: vehicle, isLoading } = useGetVehicleDetails(vehicleId ? Number(vehicleId) : undefined);

  const statusColor =
    vehicle?.vehicleStatus === "ACTIVE" ? "bg-green-100 text-green-700" :
    vehicle?.vehicleStatus === "INACTIVE" ? "bg-red-100 text-red-700" :
    "bg-amber-100 text-amber-700";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  const images: string[] = vehicle.images ?? [];
  const videos: string[] = vehicle.videos ?? [];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" className="gap-2 pl-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back to Inventory
      </Button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-muted aspect-video">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt="vehicle" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Images</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge className={`${statusColor} border-0 text-xs font-semibold`}>{vehicle.vehicleStatus}</Badge>
            </div>
            <h1 className="text-2xl font-black">
              {vehicle.registrationYear} {vehicle.brand} {vehicle.model} {vehicle.variant}
            </h1>
            <p className="text-3xl font-black text-primary mt-1">
              ₹{(vehicle.askingPrice ?? 0).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <SpecBox icon={<Fuel className="h-4 w-4" />} label="Fuel Type" value={vehicle.fuelType} />
            <SpecBox icon={<Settings className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
            <SpecBox icon={<Gauge className="h-4 w-4" />} label="KM Driven" value={(vehicle.kilometerDriven ?? 0).toLocaleString("en-IN") + " km"} />
            <SpecBox icon={<Calendar className="h-4 w-4" />} label="Reg. Year" value={String(vehicle.registrationYear)} />
            <SpecBox icon={<Users className="h-4 w-4" />} label="Ownership" value={vehicle.ownershipDetails} />
            <SpecBox icon={<MapPin className="h-4 w-4" />} label="City" value={vehicle.city} />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Insurance:</span>
            <span className="font-medium capitalize">{vehicle.insuranceStatus}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {vehicle.vehicleDescription && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{vehicle.vehicleDescription}</p>
          </CardContent>
        </Card>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-3">Videos</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((url, i) => (
                <video key={i} src={url} controls className="w-full rounded-xl aspect-video object-cover" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    
    </div>
  );
}

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
      <div className="text-primary shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value ?? "—"}</div>
      </div>
    </div>
  );
}
