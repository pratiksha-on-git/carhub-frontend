import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vehicleService } from "@/services/vehicleService";
import { BRANDS, CITIES, FUELS, TRANSMISSIONS, OWNERSHIPS } from "@/data/vehicles";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Vehicle } from "@/types";

const schema = z.object({
  title: z.string().min(4).max(120),
  brand: z.string().min(1),
  model: z.string().min(1).max(60),
  variant: z.string().min(1).max(60),
  price: z.coerce.number().min(10000),
  year: z.coerce.number().min(1990).max(new Date().getFullYear()),
  kmDriven: z.coerce.number().min(0),
  fuel: z.enum(["Petrol", "Diesel", "CNG", "Electric"]),
  transmission: z.enum(["Manual", "Automatic"]),
  ownership: z.enum(["1st Owner", "2nd Owner", "3rd Owner"]),
  city: z.string().min(1),
  description: z.string().min(20).max(2000),
});

export default function VehicleForm() {
  const { id } = useParams();
  const editing = id ? vehicleService.get(id) : undefined;
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: editing ? {
      title: editing.title, brand: editing.brand, model: editing.model, variant: editing.variant,
      price: editing.price, year: editing.year, kmDriven: editing.kmDriven,
      fuel: editing.fuel, transmission: editing.transmission, ownership: editing.ownership,
      city: editing.city, description: editing.description,
    } : { title: "", brand: "", model: "", variant: "", price: 0, year: 2022, kmDriven: 0, fuel: "Petrol", transmission: "Manual", ownership: "1st Owner", city: "", description: "" },
  });

  const onSubmit = (v: z.infer<typeof schema>) => {
    if (editing) {
      vehicleService.update(editing.id, v);
      toast.success("Vehicle updated");
    } else {
      const newVehicle: Vehicle = {
        id: `v${Date.now()}`,
        slug: v.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
        ...v,
        registrationYear: v.year,
        images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop"],
        videoUrl: "",
        insurance: "Comprehensive",
        financeAvailable: true,
        dealerId: user?.dealerId || "d1",
        featured: false, verified: false, views: 0,
        createdAt: new Date().toISOString(),
        status: "Pending",
      };
      vehicleService.add(newVehicle);
      toast.success("Vehicle added");
    }
    navigate("/dealer/vehicles");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link to="/dealer/vehicles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to vehicles</Link>
      <h1 className="font-display text-2xl font-black">{editing ? "Edit Vehicle" : "Add New Vehicle"}</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Vehicle Title" {...form.register("title")} placeholder="e.g. 2022 Hyundai Creta SX" />
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Brand" value={form.watch("brand")} onChange={(v) => form.setValue("brand", v)} options={BRANDS} />
              <Field label="Model" {...form.register("model")} />
              <Field label="Variant" {...form.register("variant")} />
              <SelectField label="City" value={form.watch("city")} onChange={(v) => form.setValue("city", v)} options={CITIES} />
              <Field label="Price (₹)" type="number" {...form.register("price")} />
              <Field label="Year" type="number" {...form.register("year")} />
              <Field label="KM Driven" type="number" {...form.register("kmDriven")} />
              <SelectField label="Fuel" value={form.watch("fuel")} onChange={(v) => form.setValue("fuel", v as never)} options={[...FUELS]} />
              <SelectField label="Transmission" value={form.watch("transmission")} onChange={(v) => form.setValue("transmission", v as never)} options={[...TRANSMISSIONS]} />
              <SelectField label="Ownership" value={form.watch("ownership")} onChange={(v) => form.setValue("ownership", v as never)} options={[...OWNERSHIPS]} />
            </div>
            <div><Label>Description</Label><Textarea rows={5} {...form.register("description")} className="mt-1" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Upload up to 10 images</Label><Input type="file" accept="image/*" multiple className="mt-1" /></div>
              <div><Label>Walkaround video</Label><Input type="file" accept="video/*" className="mt-1" /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/dealer/vehicles")}>Cancel</Button>
              <Button type="submit" className="gradient-primary text-white border-0">{editing ? "Save changes" : "Add vehicle"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const Field = ({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div><Label>{label}</Label><Input {...rest} className="mt-1" /></div>
);
const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div>
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="mt-1"><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);
