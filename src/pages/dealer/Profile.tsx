import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { dealerService } from "@/services/dealerService";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

export default function DealerProfile() {
  const { user } = useAuth();
  const dealer = dealerService.get(user?.dealerId || "d1")!;
  const form = useForm({ defaultValues: dealer });

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img src={dealer.logo} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <div className="flex items-center gap-2"><h2 className="font-display font-black text-xl">{dealer.businessName}</h2><BadgeCheck className="h-5 w-5 text-success" /></div>
              <div className="text-sm text-muted-foreground">{dealer.city}, {dealer.state} · ⭐ {dealer.rating} · {dealer.totalListings} listings</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit((v) => { dealerService.update(dealer.id, v); toast.success("Profile updated"); })} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Business Name</Label><Input {...form.register("businessName")} className="mt-1" /></div>
              <div><Label>Owner Name</Label><Input {...form.register("ownerName")} className="mt-1" /></div>
              <div><Label>Email</Label><Input {...form.register("email")} className="mt-1" /></div>
              <div><Label>Mobile</Label><Input {...form.register("mobile")} className="mt-1" /></div>
              <div><Label>WhatsApp</Label><Input {...form.register("whatsapp")} className="mt-1" /></div>
              <div><Label>City</Label><Input {...form.register("city")} className="mt-1" /></div>
            </div>
            <div><Label>Address</Label><Textarea rows={3} {...form.register("address")} className="mt-1" /></div>
            <Button type="submit" className="gradient-primary text-white border-0">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
