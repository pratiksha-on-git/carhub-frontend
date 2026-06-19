import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Fuel, Settings2, Gauge, Calendar, Shield,
  Phone, MessageCircle, BadgeCheck, AlertCircle, RefreshCw,
  ChevronLeft, ChevronRight, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/shared/SEO";
import { VehicleCard } from "@/components/cards/VehicleCard";
import { useGetVehicleDetails } from "@/hooks/dealer/useGetVehicleDetails";
import { useAllVehicles } from "@/hooks/public/useAllVehicles";
import { formatINR, formatKM } from "@/utils/helpers";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop";

const schema = z.object({
  customerName: z.string().min(2, "Please enter your name").max(80),
  mobile: z.string().min(10, "Enter a valid mobile number").max(15),
});
type FormVals = z.infer<typeof schema>;

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const vehicleId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const { data: vehicle, isLoading, isError, error, refetch } = useGetVehicleDetails(vehicleId);
  const { vehicles: allVehicles } = useAllVehicles();

  const [activeImg, setActiveImg] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", mobile: "" },
  });

  const onSubmit = (values: FormVals) => {
    // In real app, you'd post a lead to the backend here
    console.log("Lead submitted:", values);
    setRevealed(true);
    toast.success("Contact details revealed!", {
      description: "Dealer's phone and WhatsApp are now visible below.",
    });
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!vehicleId || isNaN(vehicleId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="font-bold text-lg">Invalid vehicle ID</h2>
        <Button asChild variant="outline"><Link to="/cars">Back to listings</Link></Button>
      </div>
    );
  }

  if (isLoading) {
    return <CarDetailsSkeleton />;
  }

  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="font-bold text-lg">Failed to load vehicle</h2>
          <p className="text-sm text-muted-foreground mt-1">{error?.message ?? "Vehicle not found."}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
          <Button variant="outline" asChild><Link to="/cars">Back to listings</Link></Button>
        </div>
      </div>
    );
  }

  // ── Data ─────────────────────────────────────────────────────────────────
  const images: string[] = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [FALLBACK_IMG];
  const videos: string[] = vehicle.videos ?? [];
  const related = allVehicles
    .filter((v) => v.brand === vehicle.brand && v.id !== vehicle.id)
    .slice(0, 4);

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const title = `${vehicle.registrationYear} ${vehicle.brand} ${vehicle.model} ${vehicle.variant}`;

  return (
    <>
      <SEO
        title={`${title} — ${formatINR(vehicle.askingPrice)} | AutoHub India`}
        description={vehicle.vehicleDescription?.slice(0, 160) ?? `${title} available in ${vehicle.city}`}
        ogImage={images[0]}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="min-w-0 space-y-6">

            {/* Gallery */}
            <div className="space-y-3">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0.6, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-card group"
              >
                <img
                  src={images[activeImg]}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                />

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.vehicleStatus === "ACTIVE" && (
                    <Badge className="bg-success text-success-foreground border-0 gap-1">
                      <BadgeCheck className="h-3 w-3" /> Active
                    </Badge>
                  )}
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                  {activeImg + 1} / {images.length}
                </div>
              </motion.div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 aspect-[4/3] w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i
                          ? "border-accent"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <MapPin className="h-3 w-3" />
                {vehicle.city}
                <span>·</span>
                Posted {new Date(vehicle.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black mt-1">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{vehicle.variant}</p>
              <div className="mt-3 text-3xl md:text-4xl font-black font-display text-gradient-primary">
                {formatINR(vehicle.askingPrice)}
              </div>
            </div>

            {/* Key Specs */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-4">Key Specs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Spec icon={<Calendar className="h-4 w-4" />} label="Reg. Year" value={String(vehicle.registrationYear)} />
                  <Spec icon={<Gauge className="h-4 w-4" />} label="KM Driven" value={formatKM(vehicle.kilometerDriven)} />
                  <Spec icon={<Fuel className="h-4 w-4" />} label="Fuel" value={vehicle.fuelType} />
                  <Spec icon={<Settings2 className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
                  <Spec icon={<BadgeCheck className="h-4 w-4" />} label="Ownership" value={vehicle.ownershipDetails} />
                  <Spec icon={<Shield className="h-4 w-4" />} label="Insurance" value={vehicle.insuranceStatus} />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {vehicle.vehicleDescription && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display font-bold text-lg mb-2">Description</h2>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                    {vehicle.vehicleDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                    <Play className="h-5 w-5 text-accent" /> Walkaround Video
                  </h2>
                  <div className="space-y-4">
                    {videos.map((src, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden bg-black">
                        <video
                          controls
                          src={src}
                          poster={images[0]}
                          className="h-full w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Sticky sidebar ───────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-20 self-start space-y-4">
            {/* Dealer contact card */}
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-base">Dealer Contact</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {vehicle.dealerContactName ?? "Dealer"}
                    {vehicle.city ? ` · ${vehicle.city}` : ""}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!revealed ? (
                    <Button
                      onClick={() => setShowContact(true)}
                      className="gradient-primary text-white border-0 hover:opacity-90 gap-2"
                    >
                      <Phone className="h-4 w-4" /> Contact Dealer
                    </Button>
                  ) : (
                    <>
                      {vehicle.dealerContactNumber && (
                        <a href={`tel:${vehicle.dealerContactNumber}`}>
                          <Button className="w-full gradient-primary text-white border-0 hover:opacity-90 gap-2">
                            <Phone className="h-4 w-4" /> {vehicle.dealerContactNumber}
                          </Button>
                        </a>
                      )}
                      {vehicle.dealerContactNumber && (
                        <a
                          href={`https://wa.me/${vehicle.dealerContactNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button className="w-full bg-success text-success-foreground hover:bg-success/90 gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp Dealer
                          </Button>
                        </a>
                      )}
                      {vehicle.dealerContactEmail && (
                        <a href={`mailto:${vehicle.dealerContactEmail}`}>
                          <Button variant="outline" className="w-full gap-2">
                            Email Dealer
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                  <Button asChild variant="outline">
                    <Link to="/dealers">View all dealers</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <Card>
              <CardContent className="p-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-success">
                  <BadgeCheck className="h-4 w-4" /> Verified by AutoHub
                </div>
                <div className="flex items-center gap-2 text-success">
                  <Shield className="h-4 w-4" /> Document check passed
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Direct dealer contact
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related vehicles */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-xl md:text-2xl font-black mb-5">
              More {vehicle.brand} Cars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </section>
        )}
      </div>

      {/* Contact dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get dealer contact details</DialogTitle>
            <DialogDescription>
              Enter your details to instantly reveal the dealer's phone and WhatsApp.
              We'll never share your number publicly.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((v) => { onSubmit(v); setShowContact(false); })}
            className="space-y-3"
          >
            <div>
              <Label>Your name</Label>
              <Input {...form.register("customerName")} placeholder="e.g. Aman Verma" className="mt-1" />
              {form.formState.errors.customerName && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.customerName.message}</p>
              )}
            </div>
            <div>
              <Label>Mobile number</Label>
              <Input {...form.register("mobile")} placeholder="+91 98xxx xxxxx" className="mt-1" />
              {form.formState.errors.mobile && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.mobile.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full gradient-primary text-white border-0">
              Show dealer contact
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold mt-1">{value || "—"}</div>
    </div>
  );
}

function CarDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-muted rounded mb-5" />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Main image */}
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl bg-muted" />
            {/* Thumbnails */}
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shrink-0 w-20 aspect-[4/3] rounded-lg bg-muted" />
              ))}
            </div>
          </div>

          {/* Title block */}
          <div className="space-y-2">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-7 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-9 w-1/2 bg-muted rounded mt-1" />
          </div>

          {/* Specs card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-28 bg-muted rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Description card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
              <div className="h-3 w-4/6 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-36 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-10 w-full bg-muted rounded-lg" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
