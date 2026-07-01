import { useState, useEffect, useRef } from "react";
import { ImageIcon, Video, Loader2, X, Upload, Camera, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, FUELS, TRANSMISSIONS, INSURANCE_STATUSES } from "@/utils/constants";
import { CAR_BRANDS, getModels, getVariants } from "@/data/carDatabase";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import { useAddVehicle } from "@/hooks/dealer/useAddVehicle";
import { useGetVehicleDetails } from "@/hooks/dealer/useGetVehicleDetails";
import { useUpdateVehicle } from "@/hooks/dealer/useUpdateVehicle";
import { Switch } from "@/components/ui/switch";

export interface VehicleFormProps {
  vehicleId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VehicleForm({
  vehicleId,
  onSuccess,
  onCancel,
}: VehicleFormProps) {
  const { user } = useDealerAuth();
  const addVehicleMutation = useAddVehicle(user?.id || "");
  const updateVehicleMutation = useUpdateVehicle(user?.id || "");
  const { data: vehicleDetails, isLoading: loadingDetails } =
    useGetVehicleDetails(vehicleId);

  const PHOTO_SLOTS = [
    "Front View",
    "Rear View",
    "Left Side View",
    "Right Side View",
    "Engine Bay",
    "Dashboard / Interior",
    "Front Seats",
    "Rear Seats",
    "Boot / Trunk",
    "Odometer / Console",
  ];
  const [slotImages, setSlotImages] = useState<(File | null)[]>(Array(10).fill(null));
  const [extraSlotsCount, setExtraSlotsCount] = useState(0);
  const [videos, setVideos] = useState<File[]>([]);

  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [ownershipDetails, setOwnershipDetails] = useState("First Owner");
  const [vehicleType, setVehicleType] = useState("NON_PREMIUM");

  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");

  // Validation errors for custom dropdowns
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const clearError = (key: string) => setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  const [askingPrice, setAskingPrice] = useState("");

  const models = brand ? getModels(brand) : [];
  const variants = brand && model ? getVariants(brand, model) : [];

  const handleBrandChange = (val: string) => {
    setBrand(val);
    setModel("");
    setVariant("");
    clearError("brand");
    clearError("model");
    clearError("variant");
  };

  const handleModelChange = (val: string) => {
    setModel(val);
    setVariant("");
    clearError("model");
    clearError("variant");
  };
  const [registrationYear, setRegistrationYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [kilometerDriven, setKilometerDriven] = useState("");
  const [insuranceStatus, setInsuranceStatus] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [rtoInformation, setRtoInformation] = useState("");
  const [financeAvailability, setFinanceAvailability] = useState(true);

  useEffect(() => {
    if (vehicleDetails) {
      setBrand(vehicleDetails.brand || "");
      setCity(vehicleDetails.city || "");
      setFuelType(vehicleDetails.fuelType || "Petrol");
      setTransmission(vehicleDetails.transmission || "Manual");
      setOwnershipDetails(vehicleDetails.ownershipDetails || "First Owner");
      setModel(vehicleDetails.model || "");
      setVariant(vehicleDetails.variant || "");
      setAskingPrice(
        vehicleDetails.askingPrice ? vehicleDetails.askingPrice.toString() : "",
      );
      setRegistrationYear(
        vehicleDetails.registrationYear
          ? vehicleDetails.registrationYear.toString()
          : "",
      );
      setKilometerDriven(
        vehicleDetails.kilometerDriven
          ? vehicleDetails.kilometerDriven.toString()
          : "",
      );
      setInsuranceStatus(vehicleDetails.insuranceStatus || "");
      setVehicleType(vehicleDetails.vehicleType || "NON_PREMIUM");
      setVehicleDescription(vehicleDetails.vehicleDescription || "");
      setRtoInformation(vehicleDetails.rtoInformation || "");
      setFinanceAvailability(
        vehicleDetails.financeAvailability !== undefined
          ? vehicleDetails.financeAvailability
          : true,
      );
    }
  }, [vehicleDetails]);

  const handleSlotImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlotImages((prev) => {
        const next = [...prev];
        next[index] = file;
        return next;
      });
    }
  };

  const removeSlotImage = (index: number) => {
    setSlotImages((prev) => {
      const next = [...prev];
      if (index >= 10) {
        next.splice(index, 1);
        setExtraSlotsCount((c) => c - 1);
      } else {
        next[index] = null;
      }
      return next;
    });
  };

  const addExtraSlot = () => {
    setExtraSlotsCount((c) => c + 1);
    setSlotImages((prev) => [...prev, null]);
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setVideos((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required dropdown / custom select fields
    const newErrors: Record<string, string> = {};
    if (!brand) newErrors.brand = "Brand is required";
    if (!model) newErrors.model = "Model is required";
    if (!variant) newErrors.variant = "Variant is required";
    if (!city) newErrors.city = "City is required";
    if (!insuranceStatus) newErrors.insuranceStatus = "Insurance status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error field
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setErrors({});

    const images = slotImages.filter((file): file is File => file !== null);

    if (!vehicleId) {
      const missingRequired = slotImages.slice(0, 10).some((img) => img === null);
      if (missingRequired) {
        toast.error("Please upload all 10 required images.");
        return;
      }
      if (videos.length < 1) {
        toast.error("Please select at least 1 video.");
        return;
      }
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
      vehicleType,
      insuranceStatus,
      city,
      vehicleDescription,
      rtoInformation,
      financeAvailability,
    };

    try {
      if (vehicleId) {
        await updateVehicleMutation.mutateAsync({
          vehicleId,
          vehicleData: payload,
        });
        toast.success("Vehicle updated successfully");
      } else {
        await addVehicleMutation.mutateAsync({
          vehicleData: payload,
          images,
          videos,
        });
        toast.success("Vehicle added successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save vehicle",
      );
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPending = vehicleId
    ? updateVehicleMutation.isPending
    : addVehicleMutation.isPending;

  return (
    <form
      key={vehicleId ? `edit-${brand}-${city}` : "add"}
      onSubmit={handleSubmit}
      className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div id="field-brand" className="text-left">
          <Label>
            Brand <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            value={brand}
            onValueChange={handleBrandChange}
            options={CAR_BRANDS}
            placeholder="Select Brand"
            allowCustom={true}
            triggerClassName={`mt-1 ${errors.brand ? "border-red-500" : ""}`}
          />
          {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
        </div>

        <div id="field-model" className="text-left">
          <Label>
            Model <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            value={model}
            onValueChange={handleModelChange}
            options={models}
            placeholder="Select or Type Model"
            allowCustom={true}
            triggerClassName={`mt-1 ${errors.model ? "border-red-500" : ""}`}
            disabled={!brand}
          />
          {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
        </div>

        <div id="field-variant" className="text-left">
          <Label>
            Variant <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            value={variant}
            onValueChange={(val) => { setVariant(val); clearError("variant"); }}
            options={variants}
            placeholder="Select or Type Variant"
            allowCustom={true}
            triggerClassName={`mt-1 ${errors.variant ? "border-red-500" : ""}`}
            disabled={!model}
          />
          {errors.variant && <p className="text-xs text-red-500 mt-1">{errors.variant}</p>}
        </div>

        <div id="field-city" className="text-left">
          <Label>
            City <span className="text-red-500">*</span>
          </Label>
          <Select value={city} onValueChange={(v) => { setCity(v); clearError("city"); }}>
            <SelectTrigger className={`mt-1 ${errors.city ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
        </div>

        <Field
          label="Asking Price (₹)"
          type="number"
          placeholder="e.g. 1200000"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
          required
        />
        <Field
          label="Registration Year"
          type="number"
          placeholder="e.g. 2023"
          value={registrationYear}
          onChange={(e) => setRegistrationYear(e.target.value)}
          required
        />
        <Field
          label="Kilometer Driven"
          type="number"
          placeholder="e.g. 15000"
          value={kilometerDriven}
          onChange={(e) => setKilometerDriven(e.target.value)}
          required
        />

        <div className="text-left">
          <Label>
            Fuel Type <span className="text-red-500">*</span>
          </Label>
          <Select value={fuelType} onValueChange={setFuelType} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              {FUELS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-left">
          <Label>
            Transmission <span className="text-red-500">*</span>
          </Label>
          <Select value={transmission} onValueChange={setTransmission} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Transmission" />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-left">
          <Label>
            Ownership Details <span className="text-red-500">*</span>
          </Label>
          <Select
            value={ownershipDetails}
            onValueChange={setOwnershipDetails}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Ownership" />
            </SelectTrigger>
            <SelectContent>
              {["First Owner", "Second Owner", "Third Owner", "Others"].map(
                (o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="text-left">
          <Label>
            Vehicle Type <span className="text-red-500">*</span>
          </Label>
          <Select value={vehicleType} onValueChange={setVehicleType} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NON_PREMIUM">NON_PREMIUM</SelectItem>
              <SelectItem value="PREMIUM">PREMIUM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div id="field-insuranceStatus" className="text-left">
          <Label>
            Insurance Status <span className="text-red-500">*</span>
          </Label>
          <Select value={insuranceStatus} onValueChange={(v) => { setInsuranceStatus(v); clearError("insuranceStatus"); }}>
            <SelectTrigger className={`mt-1 ${errors.insuranceStatus ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select Insurance Status" />
            </SelectTrigger>
            <SelectContent>
              {INSURANCE_STATUSES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.insuranceStatus && <p className="text-xs text-red-500 mt-1">{errors.insuranceStatus}</p>}
        </div>

        <Field
          label="RTO Information"
          type="text"
          placeholder="e.g. MH12"
          value={rtoInformation}
          onChange={(e) => setRtoInformation(e.target.value)}
          required
        />

        <div className="text-left flex flex-col justify-end pb-1">
          <Label className="mb-2">Finance Availability</Label>
          <div className="flex items-center space-x-2 h-10 border rounded-md px-3 bg-background">
            <Switch
              id="financeAvailability"
              checked={financeAvailability}
              onCheckedChange={setFinanceAvailability}
            />
            <Label htmlFor="financeAvailability" className="text-sm font-medium cursor-pointer text-muted-foreground">
              {financeAvailability ? "Available" : "Not Available"}
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label>
          Vehicle Description <span className="text-red-500">*</span>
        </Label>
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
          <div className="rounded-2xl border border-slate-100 p-6 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 text-lg">
                  Vehicle Images <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload at least 10 required photos (Selected: {slotImages.filter(Boolean).length} photos)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
              {slotImages.map((file, idx) => {
                const isRequired = idx < 10;
                const slotName = isRequired ? PHOTO_SLOTS[idx] : `Extra Photo ${idx - 9}`;
                return (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-all group"
                  >
                    {file ? (
                      <>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={slotName}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                          <p className="text-[10px] font-semibold text-white truncate max-w-full mb-1">
                            {slotName}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeSlotImage(idx)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-105"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="h-full w-full flex flex-col items-center justify-center cursor-pointer p-3 text-center hover:bg-slate-50/50 transition-colors">
                        <Camera className="h-5 w-5 text-slate-400 mb-1.5" />
                        <span className="text-xs font-semibold text-slate-700 leading-tight">
                          {slotName}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handleSlotImageChange(idx, e)}
                        />
                      </label>
                    )}
                  </div>
                );
              })}

              {/* Add Extra Photo Slot Button Card */}
              <button
                type="button"
                onClick={addExtraSlot}
                className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50/50 hover:border-primary transition-all flex flex-col items-center justify-center cursor-pointer p-3 text-center"
              >
                <Plus className="h-5 w-5 text-slate-400 mb-1.5" />
                <span className="text-xs font-semibold text-slate-700 leading-tight">
                  Add Extra Photo
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Slot {11 + extraSlotsCount}
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-primary transition-colors">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-slate-800">
              Walkaround Videos <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload at least 1 vehicle video (Selected: {videos.length})
            </p>
            <label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm font-semibold cursor-pointer transition-colors shadow-sm">
              <Upload className="h-4 w-4" /> Choose Videos
              <input
                type="file"
                accept="video/*"
                multiple
                className="sr-only"
                onChange={handleVideosChange}
              />
            </label>
            {videos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4 max-h-48 overflow-y-auto p-1">
                {videos.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
                  >
                    <video
                      src={URL.createObjectURL(file)}
                      className="h-full w-full object-cover"
                      controls={false}
                      muted
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setVideos((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-all hover:scale-105"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-2 py-1 truncate text-left">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="gradient-primary text-white border-0"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {vehicleId ? "Update vehicle" : "Add vehicle"}
        </Button>
      </div>
    </form>
  );
}

const Field = ({
  label,
  error,
  required,
  ...rest
}: {
  label: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="text-left">
    <Label>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input {...rest} className="mt-1" required={required} />
    {error && <p className="text-sm text-destructive mt-1">{error}</p>}
  </div>
);
