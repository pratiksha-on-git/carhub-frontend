import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, MapPin, Fuel, Settings2, Gauge, Calendar, Shield, Banknote, Phone, MessageCircle, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/shared/SEO";
import { VehicleCard } from "@/components/cards/VehicleCard";
import { vehicleService } from "@/services/vehicleService";
import { dealerService } from "@/services/dealerService";
import { leadService } from "@/services/leadService";
import { formatINR, formatKM } from "@/utils/helpers";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2, "Please enter your name").max(80),
  mobile: z.string().min(10, "Enter a valid mobile number").max(15),
});
type FormVals = z.infer<typeof schema>;

export default function CarDetails() {
  const { slug } = useParams();
  const vehicle = slug ? vehicleService.get(slug) : undefined;
  if (!vehicle) return <Navigate to="/cars" replace />;
  const dealer = dealerService.get(vehicle.dealerId)!;
  const [active, setActive] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const related = vehicleService.list().filter((v) => v.brand === vehicle.brand && v.id !== vehicle.id).slice(0, 4);

  const form = useForm<FormVals>({ resolver: zodResolver(schema), defaultValues: { customerName: "", mobile: "" } });

  const onSubmit = (values: FormVals) => {
    leadService.add({
      id: `l${Date.now()}`,
      customerName: values.customerName,
      mobile: values.mobile,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      dealerId: vehicle.dealerId,
      status: "New",
      createdAt: new Date().toISOString(),
    });
    setRevealed(true);
    toast.success("Lead sent to dealer", { description: "Dealer contact details have been revealed below." });
  };

  return (
    <>
      <SEO title={`${vehicle.title} — ${formatINR(vehicle.price)} | AutoHub India`} description={vehicle.description.slice(0, 160)} ogImage={vehicle.images[0]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="min-w-0 space-y-6">
            {/* Gallery */}
            <div className="space-y-3">
              <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-card">
                <img src={vehicle.images[active]} alt={vehicle.title} className="h-full w-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.featured && <Badge className="bg-warning text-warning-foreground border-0 gap-1"><Star className="h-3 w-3 fill-current" /> Featured</Badge>}
                  {vehicle.verified && <Badge className="bg-success text-success-foreground border-0 gap-1"><BadgeCheck className="h-3 w-3" /> Verified</Badge>}
                </div>
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs">
                  <Eye className="h-3 w-3" /> {vehicle.views.toLocaleString("en-IN")} views
                </div>
              </motion.div>
              <div className="grid grid-cols-5 gap-2">
                {vehicle.images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${active === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {vehicle.city} · Posted {new Date(vehicle.createdAt).toLocaleDateString("en-IN")}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black mt-1">{vehicle.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{vehicle.variant}</p>
              <div className="mt-3 text-3xl md:text-4xl font-black font-display text-gradient-primary">{formatINR(vehicle.price)}</div>
            </div>

            {/* Specs */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-4">Key Specs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Spec icon={<Calendar className="h-4 w-4" />} label="Year" value={String(vehicle.year)} />
                  <Spec icon={<Gauge className="h-4 w-4" />} label="KM Driven" value={formatKM(vehicle.kmDriven)} />
                  <Spec icon={<Fuel className="h-4 w-4" />} label="Fuel" value={vehicle.fuel} />
                  <Spec icon={<Settings2 className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
                  <Spec icon={<BadgeCheck className="h-4 w-4" />} label="Ownership" value={vehicle.ownership} />
                  <Spec icon={<Shield className="h-4 w-4" />} label="Insurance" value={vehicle.insurance} />
                  <Spec icon={<Banknote className="h-4 w-4" />} label="Finance" value={vehicle.financeAvailable ? "Available" : "Not available"} />
                  <Spec icon={<Calendar className="h-4 w-4" />} label="Reg. Year" value={String(vehicle.registrationYear)} />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-2">Description</h2>
                <p className="text-sm leading-relaxed text-foreground/80">{vehicle.description}</p>
              </CardContent>
            </Card>

            {/* Walkaround */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-3">Walkaround Video</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video controls src={vehicle.videoUrl} poster={vehicle.images[0]} className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-20 self-start space-y-4">
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <img src={dealer.logo} alt={dealer.businessName} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base truncate">{dealer.businessName}</h3>
                      {dealer.verified && <BadgeCheck className="h-4 w-4 text-success shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {dealer.city} · ⭐ {dealer.rating}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-3">{dealer.address}</div>
                <div className="mt-4 flex flex-col gap-2">
                  {!revealed ? (
                    <Button onClick={() => setShowContact(true)} className="gradient-primary text-white border-0 hover:opacity-90 gap-2">
                      <Phone className="h-4 w-4" /> Contact Dealer
                    </Button>
                  ) : (
                    <>
                      <a href={`tel:${dealer.mobile}`}>
                        <Button className="w-full gradient-primary text-white border-0 hover:opacity-90 gap-2">
                          <Phone className="h-4 w-4" /> {dealer.mobile}
                        </Button>
                      </a>
                      <a href={`https://wa.me/${dealer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                        <Button className="w-full bg-success text-success-foreground hover:bg-success/90 gap-2">
                          <MessageCircle className="h-4 w-4" /> WhatsApp Dealer
                        </Button>
                      </a>
                    </>
                  )}
                  <Button asChild variant="outline">
                    <Link to="/dealers">View dealer profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-success"><BadgeCheck className="h-4 w-4" /> Verified by AutoHub</div>
                <div className="flex items-center gap-2 text-success"><Shield className="h-4 w-4" /> Document check passed</div>
                <div className="flex items-center gap-2 text-success"><Banknote className="h-4 w-4" /> Finance assistance available</div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl md:text-2xl font-black mb-5">More from {vehicle.brand}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </section>
        )}
      </div>

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get dealer contact details</DialogTitle>
            <DialogDescription>Enter your details to instantly reveal the dealer's phone and WhatsApp. We'll never share your number publicly.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); setShowContact(false); })} className="space-y-3">
            <div>
              <Label>Your name</Label>
              <Input {...form.register("customerName")} placeholder="e.g. Aman Verma" />
              {form.formState.errors.customerName && <p className="text-xs text-destructive mt-1">{form.formState.errors.customerName.message}</p>}
            </div>
            <div>
              <Label>Mobile number</Label>
              <Input {...form.register("mobile")} placeholder="+91 98xxx xxxxx" />
              {form.formState.errors.mobile && <p className="text-xs text-destructive mt-1">{form.formState.errors.mobile.message}</p>}
            </div>
            <Button type="submit" className="w-full gradient-primary text-white border-0">Show dealer contact</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">{icon} {label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}
