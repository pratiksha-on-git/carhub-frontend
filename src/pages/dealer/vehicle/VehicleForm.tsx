import { useState, useEffect } from "react";
import { ImageIcon, Video, Loader2, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANDS, CITIES, FUELS, TRANSMISSIONS } from "@/data/vehicles";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAddVehicle } from "@/hooks/dealer/useAddVehicle";
import { useGetVehicleDetails } from "@/hooks/dealer/useGetVehicleDetails";
import { useUpdateVehicle } from "@/hooks/dealer/useUpdateVehicle";

export interface VehicleFormProps {
  vehicleId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VehicleForm({ vehicleId, onSuccess, onCancel }: VehicleFormProps) {
  const { user } = useAuth();
  const addVehicleMutation = useAddVehicle(user?.id || "");
  const updateVehicleMutation = useUpdateVehicle(user?.id || "");
  const { data: vehicleDetails, isLoading: loadingDetails } = useGetVehicleDetails(vehicleId);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [ownershipDetails, setOwnershipDetails] = useState("First Owner");

  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [registrationYear, setRegistrationYear] = useState(new Date().getFullYear().toString());
  const [kilometerDriven, setKilometerDriven] = useState("");
  const [insuranceStatus, setInsuranceStatus] = useState("Valid");
  const [vehicleDescription, setVehicleDescription] = useState("");

  useEffect(() => {
    if (vehicleDetails) {
      setBrand(vehicleDetails.brand || "");
      setCity(vehicleDetails.city || "");
      setFuelType(vehicleDetails.fuelType || "Petrol");
      setTransmission(vehicleDetails.transmission || "Manual");
      setOwnershipDetails(vehicleDetails.ownershipDetails || "First Owner");
      setModel(vehicleDetails.model || "");
      setVariant(vehicleDetails.variant || "");
      setAskingPrice(vehicleDetails.askingPrice ? vehicleDetails.askingPrice.toString() : "");
      setRegistrationYear(vehicleDetails.registrationYear ? vehicleDetails.registrationYear.toString() : "");
      setKilometerDriven(vehicleDetails.kilometerDriven ? vehicleDetails.kilometerDriven.toString() : "");
      setInsuranceStatus(vehicleDetails.insuranceStatus || "Valid");
      setVehicleDescription(vehicleDetails.vehicleDescription || "");
    }
  }, [vehicleDetails]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setVideos((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleId) {
      if (images.length < 10) { toast.error("Please select at least 10 images."); return; }
      if (videos.length < 1) { toast.error("Please select at least 1 video."); return; }
    }

    const payload = {
      brand,
      model,
      variant,
      registrationYear: Number(registrationYear),
      askingPrice: Number(askingPrice),
      kilometerDriven: Number(kilometerDriven),
      fuelType,
      transmission,
      ownershipDetails,
      insuranceStatus,
      city,
      vehicleDescription,
    };

    try {
      if (vehicleId) {
        await updateVehicleMutation.mutateAsync({ vehicleId, vehicleData: payload });
        toast.success("Vehicle updated successfully");
      } else {
        await addVehicleMutation.mutateAsync({ vehicleData: payload, images, videos });
        toast.success("Vehicle added successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save vehicle");
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPending = vehicleId ? updateVehicleMutation.isPending : addVehicleMutation.isPending;

  return (
    <form key={vehicleId ? `edit-${brand}-${city}` : "add"} onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid sm:grid-cols-2 gap-4">

        <div className="text-left">
          <Label>Brand <span className="text-red-500">*</span></Label>
          <Select value={brand} onValueChange={setBrand} required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Brand" /></SelectTrigger>
            <SelectContent>{BRANDS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Field label="Model" placeholder="e.g. Creta" value={model} onChange={(e) => setModel(e.target.value)} required />
        <Field label="Variant" placeholder="e.g. SX Diesel" value={variant} onChange={(e) => setVariant(e.target.value)} required />

        <div className="text-left">
          <Label>City <span className="text-red-500">*</span></Label>
          <Select value={city} onValueChange={setCity} required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select City" /></SelectTrigger>
            <SelectContent>{CITIES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Field label="Asking Price (₹)" type="number" placeholder="e.g. 1200000" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} required />
        <Field label="Registration Year" type="number" placeholder="e.g. 2023" value={registrationYear} onChange={(e) => setRegistrationYear(e.target.value)} required />
        <Field label="Kilometer Driven" type="number" placeholder="e.g. 15000" value={kilometerDriven} onChange={(e) => setKilometerDriven(e.target.value)} required />

        <div className="text-left">
          <Label>Fuel Type <span className="text-red-500">*</span></Label>
          <Select value={fuelType} onValueChange={setFuelType} required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Fuel Type" /></SelectTrigger>
            <SelectContent>{FUELS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="text-left">
          <Label>Transmission <span className="text-red-500">*</span></Label>
          <Select value={transmission} onValueChange={setTransmission} required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Transmission" /></SelectTrigger>
            <SelectContent>{TRANSMISSIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="text-left">
          <Label>Ownership Details <span className="text-red-500">*</span></Label>
          <Select value={ownershipDetails} onValueChange={setOwnershipDetails} required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select Ownership" /></SelectTrigger>
            <SelectContent>
              {["First Owner", "Second Owner", "Third Owner", "Others"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Field label="Insurance Status" placeholder="e.g. Valid" value={insuranceStatus} onChange={(e) => setInsuranceStatus(e.target.value)} required />
      </div>

      <div>
        <Label>Vehicle Description <span className="text-red-500">*</span></Label>
        <Textarea
          rows={4}
          placeholder="Describe the vehicle condition, service history, etc."
          value={vehicleDescription}
          onChange={(e) => setVehicleDescription(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {!vehicleId && (
        <div className="grid gap-4 md:grid-cols-1">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-primary transition-colors">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-slate-800">Vehicle Images <span className="text-red-500">*</span></h3>
            <p className="text-sm text-muted-foreground mt-1">Upload at least 10 high-quality photos (Selected: {images.length})</p>
            <label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm font-semibold cursor-pointer transition-colors shadow-sm">
              <Upload className="h-4 w-4" /> Choose Images
              <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImagesChange} />
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4 max-h-72 overflow-y-auto p-1">
                {images.map((file, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-all hover:scale-105">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-primary transition-colors">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-slate-800">Walkaround Videos <span className="text-red-500">*</span></h3>
            <p className="text-sm text-muted-foreground mt-1">Upload at least 1 vehicle video (Selected: {videos.length})</p>
            <label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm font-semibold cursor-pointer transition-colors shadow-sm">
              <Upload className="h-4 w-4" /> Choose Videos
              <input type="file" accept="video/*" multiple className="sr-only" onChange={handleVideosChange} />
            </label>
            {videos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4 max-h-48 overflow-y-auto p-1">
                {videos.map((file, idx) => (
                  <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    <video src={URL.createObjectURL(file)} className="h-full w-full object-cover" controls={false} muted />
                    <button type="button" onClick={() => setVideos(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-all hover:scale-105">
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-2 py-1 truncate text-left">{file.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
        <Button type="submit" className="gradient-primary text-white border-0" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {vehicleId ? "Update vehicle" : "Add vehicle"}
        </Button>
      </div>
    </form>
  );
}

const Field = ({ label, error, required, ...rest }: { label: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="text-left">
    <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
    <Input {...rest} className="mt-1" required={required} />
    {error && <p className="text-sm text-destructive mt-1">{error}</p>}
  </div>
);
