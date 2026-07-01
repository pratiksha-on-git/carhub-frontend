import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Fuel,
  Settings2,
  Gauge,
  Calendar,
  Shield,
  Phone,
  MessageCircle,
  BadgeCheck,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Heart,
  Car,
  FileText,
  DollarSign,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/shared/SEO";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AuthModal } from "@/components/shared/AuthModal";
import { useGetVehicleDetails } from "@/hooks/dealer/useGetVehicleDetails";
import { useGenerateLead, useGenerateView } from "@/hooks/public/useLeads";
import {
  useCustomer,
  getStoredCustomer,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import { useWishlist } from "@/hooks/public/useWishlist";
import { formatINR, formatKM } from "@/utils/helpers";
import { toast } from "sonner";
import {
  VehicleCard,
  VehicleCardSkeleton,
} from "@/components/cards/VehicleCard";
import { useLatestVehicles } from "@/hooks/public/useHomeVehicles";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const vehicleId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const {
    data: vehicle,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVehicleDetails(vehicleId);
  const { generateView } = useGenerateView();
  const { isSubmitting, generateLead } = useGenerateLead();
  const { vehicles: latestVehicles, loading: latestLoading } = useLatestVehicles();
  const latestListings = latestVehicles.filter(v => v.id !== vehicleId).slice(0, 4);

  const [activeImg, setActiveImg] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const customer = useCustomer();
  const { wishlistIds, toggleWishlist: apiToggleWishlist } = useWishlist();
  const wishlisted = vehicleId ? wishlistIds.includes(vehicleId) : false;

  // Lead form fields (autofilled from localStorage)
  const [leadName, setLeadName] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [leadErr, setLeadErr] = useState("");

  // Generate view when logged-in customer lands on this page
  useEffect(() => {
    if (vehicleId && customer) {
      generateView(vehicleId);
    }
  }, [vehicleId, customer, generateView]);



  // Autofill lead form from customer data
  const openContactDialog = () => {
    const stored = getStoredCustomer();
    if (!stored) {
      setAuthOpen(true);
      return;
    }
    // mobile: stored field → JWT decoded field → empty
    const mobile =
      stored.mobile ||
      (stored.decoded?.mobile as string) ||
      (stored.decoded?.mobileNumber as string) ||
      "";
    setLeadName(stored.customerName ?? "");
    setLeadMobile(mobile);
    setLeadCity(stored.customerCity ?? "");
    setLeadErr("");
    setShowContact(true);
  };

  const handleAuthSuccess = (user: CustomerUser) => {
    // After login, open contact dialog with autofill
    const mobile =
      user.mobile ||
      (user.decoded?.mobile as string) ||
      (user.decoded?.mobileNumber as string) ||
      "";
    setLeadName(user.customerName ?? "");
    setLeadMobile(mobile);
    setLeadCity(user.customerCity ?? "");
    setLeadErr("");
    setShowContact(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadErr("");
    if (!leadName.trim() || !leadMobile.trim() || !leadCity.trim()) {
      setLeadErr("All fields are required.");
      return;
    }
    try {
      await generateLead(vehicleId!, {
        customerName: leadName,
        customerMobile: leadMobile,
        customerCity: leadCity,
      });
      setRevealed(true);
      setShowContact(false);
      toast.success("Contact details revealed!", {
        description: "Dealer's phone and WhatsApp are now visible below.",
      });
    } catch (e: any) {
      setLeadErr(e.message ?? "Failed to submit");
    }
  };

  const handleWishlist = async () => {
    if (!vehicleId) return;
    if (!customer) {
      setAuthOpen(true);
      return;
    }
    try {
      const msg = await apiToggleWishlist(vehicleId);
      if (msg) {
        toast.success(msg);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update wishlist");
    }
  };

  if (!vehicleId || isNaN(vehicleId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="font-bold text-lg">Invalid vehicle ID</h2>
        <Button asChild variant="outline">
          <Link to="/cars">Back to listings</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) return <CarDetailsSkeleton />;

  if (isError || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="font-bold text-lg">Failed to load vehicle</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message ?? "Vehicle not found."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
          <Button variant="outline" asChild>
            <Link to="/cars">Back to listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images: string[] =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : [FALLBACK_IMG];
  const videos: string[] = vehicle.videos ?? [];

  const prevImg = () =>
    setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () =>
    setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const title = `${vehicle.registrationYear} ${vehicle.brand} ${vehicle.model} ${vehicle.variant}`;

  return (
    <div className="bg-gradient-to-b from-white via-rose-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20 pt-10">
      <SEO
        title={`${title} — ${formatINR(vehicle.askingPrice)} | Caryanam`}
        description={
          vehicle.vehicleDescription?.slice(0, 160) ??
          `${title} available in ${vehicle.city}`
        }
        ogImage={images[0]}
      />

      <div className="mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/cars">Cars</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left column */}
          <div className="min-w-0 space-y-6">
            {/* Gallery */}
            <div className="space-y-3">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0.6, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={() => setGalleryOpen(true)}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-card group cursor-pointer"
              >
                <img
                  src={images[activeImg]}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImg();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImg();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {vehicle.vehicleStatus === "FEATURED" && (
                    <Badge className="gradient-primary text-white border-0 gap-1">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </Badge>
                  )}
                  {vehicle.vehicleType === "PREMIUM" && (
                    <Badge className="bg-amber-500 text-white border-0 font-bold shadow">
                      Premium
                    </Badge>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/75 text-white text-xs font-black flex items-center gap-1.5 backdrop-blur-sm select-none">
                    <Camera className="h-3.5 w-3.5" />
                    {activeImg + 1} / {images.length}
                  </div>
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {images.slice(0, 6).map((src, i) => {
                    const isLast = i === Math.min(images.length, 6) - 1;
                    const showOverlay = isLast && (images.length > 6 || images.length > 1);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (showOverlay) {
                            setGalleryOpen(true);
                          } else {
                            setActiveImg(i);
                          }
                        }}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImg === i ? "border-rose-900" : "border-transparent opacity-85 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                          }}
                        />
                        {showOverlay && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider">
                            View All
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <MapPin className="h-3 w-3" />
                {vehicle.city}
                <span>·</span>
                Posted{" "}
                {new Date(vehicle.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-start justify-between gap-2 mt-1">
                <h1 className="font-display text-2xl md:text-3xl font-black">
                  {title}
                </h1>
                {/* Wishlist on detail page */}
                <button
                  onClick={handleWishlist}
                  className="shrink-0 h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${wishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
                  />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {vehicle.variant}
              </p>
              <div className="mt-3 text-3xl md:text-4xl font-black font-display text-gradient-primary">
                {formatINR(vehicle.askingPrice)}
              </div>
            </div>

            {/* Key Specs */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-lg mb-4">
                  Key Specs
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Spec
                    icon={<Calendar className="h-4 w-4" />}
                    label="Reg. Year"
                    value={String(vehicle.registrationYear)}
                  />
                  <Spec
                    icon={<Gauge className="h-4 w-4" />}
                    label="KM Driven"
                    value={formatKM(vehicle.kilometerDriven)}
                  />
                  <Spec
                    icon={<Fuel className="h-4 w-4" />}
                    label="Fuel"
                    value={vehicle.fuelType}
                  />
                  <Spec
                    icon={<Settings2 className="h-4 w-4" />}
                    label="Transmission"
                    value={vehicle.transmission}
                  />
                  <Spec
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="Ownership"
                    value={vehicle.ownershipDetails}
                  />
                  <Spec
                    icon={<Shield className="h-4 w-4" />}
                    label="Insurance"
                    value={vehicle.insuranceStatus}
                  />
                  {vehicle.vehicleType && (
                    <Spec
                      icon={<Car className="h-4 w-4" />}
                      label="Vehicle Type"
                      value={vehicle.vehicleType}
                    />
                  )}
                  {vehicle.rtoInformation && (
                    <Spec
                      icon={<FileText className="h-4 w-4" />}
                      label="RTO Info"
                      value={vehicle.rtoInformation}
                    />
                  )}
                  <Spec
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Finance"
                    value={vehicle.financeAvailability ? "Available" : "Not Available"}
                  />
                </div>
              </CardContent>
            </Card>

            {vehicle.vehicleDescription && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display font-bold text-lg mb-2">
                    Description
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                    {vehicle.vehicleDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {videos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                    <Play className="h-5 w-5 text-accent" /> Walkaround Video
                  </h2>

                  {/* Main video player */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black group">
                    <video
                      key={videos[activeVideo]}
                      controls
                      src={videos[activeVideo]}
                      className="h-full w-full"
                    />
                    {videos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveVideo((v) =>
                              v === 0 ? videos.length - 1 : v - 1,
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveVideo((v) =>
                              v === videos.length - 1 ? 0 : v + 1,
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium pointer-events-none">
                          {activeVideo + 1} / {videos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Video thumbnail strip */}
                  {videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin mt-3">
                      {videos.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveVideo(i)}
                          className={`relative shrink-0 aspect-video w-28 rounded-lg overflow-hidden border-2 transition-all ${activeVideo === i
                            ? "border-accent"
                            : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                          <video
                            src={src}
                            preload="metadata"
                            className="h-full w-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="h-7 w-7 rounded-full bg-white/80 flex items-center justify-center">
                              <Play className="h-3.5 w-3.5 text-gray-900 fill-gray-900 ml-0.5" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-20 self-start space-y-4">
            {/* Main summary + contact card */}
            <div className="rounded-2xl border border-border bg-card shadow-premium overflow-hidden">
              <div className="p-5">
                {/* Car title */}
                <h3 className="font-bold text-base leading-snug">{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {vehicle.variant}
                </p>

                {/* Price */}
                <div className="mt-3 text-2xl font-black font-display text-gradient-primary">
                  {formatINR(vehicle.askingPrice)}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* 3 inline specs */}
              <div className="flex items-center divide-x divide-border px-5 py-3">
                <div className="flex-1 flex flex-col items-center gap-1 pr-3">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {vehicle.fuelType}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 px-3">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {vehicle.transmission}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 pl-3">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatKM(vehicle.kilometerDriven)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Dealer section */}
              {vehicle.dealerShowroomImage && (
                <div className="h-28 w-full bg-slate-100 overflow-hidden relative shrink-0">
                  <img
                    src={vehicle.dealerShowroomImage}
                    alt="Showroom"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-5">
                {/* Dealer avatar + name */}
                <div className="flex items-center gap-3 mb-4">
                  {vehicle.dealerLogo ? (
                    <img
                      src={vehicle.dealerLogo}
                      alt="Logo"
                      className="h-11 w-11 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <DealerAvatar
                      name={
                        vehicle.dealerBusinessName ??
                        vehicle.dealerContactName ??
                        "D"
                      }
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-sm leading-tight capitalize truncate">
                        {vehicle.dealerBusinessName ??
                          vehicle.dealerContactName ??
                          "Dealer"}
                      </span>
                      <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5 capitalize text-xs text-muted-foreground">
                      <span>{vehicle.city ?? ""}</span>
                      {vehicle.dealerYearsInBusiness !== undefined && vehicle.dealerYearsInBusiness !== null && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-[10px] text-blue-700 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50">
                            {vehicle.dealerYearsInBusiness} yrs
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                {!revealed ? (
                  <Button
                    onClick={openContactDialog}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 font-semibold"
                  >
                    View Dealer Contact
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Call + WhatsApp side by side */}
                    <div className="flex gap-2">
                      {vehicle.dealerContactNumber && (
                        <a
                          href={`tel:${vehicle.dealerContactNumber}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 gap-2 font-semibold">
                            <Phone className="h-4 w-4" /> Call
                          </Button>
                        </a>
                      )}
                      {(vehicle.dealerWhatsappNumber ??
                        vehicle.dealerContactNumber) && (
                          <a
                            href={`https://wa.me/${(vehicle.dealerWhatsappNumber ?? vehicle.dealerContactNumber)!.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-semibold"
                            >
                              <MessageCircle className="h-4 w-4" /> WhatsApp
                            </Button>
                          </a>
                        )}
                    </div>

                    {/* Phone number */}
                    {vehicle.dealerContactNumber && (
                      <p className="text-center text-sm font-semibold text-foreground pt-0.5">
                        +91{" "}
                        {vehicle.dealerContactNumber
                          .replace(/\D/g, "")
                          .replace(/^91/, "")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-success">
                  <BadgeCheck className="h-4 w-4" /> Verified by Caryanam
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

        {/* Latest Listings Section */}
        {latestListings.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black">Latest Listings</h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Fresh inventory updated daily</p>
              </div>
              <Link to="/cars" className="text-xs font-bold text-rose-900 hover:underline">
                View All
              </Link>
            </div>
            {latestLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {latestListings.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    isLoggedIn={!!customer}
                    onWishlistRequireLogin={() => setAuthOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Dealer Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Dealer</DialogTitle>
            <DialogDescription>
              Your details are pre-filled. Confirm to reveal the dealer's
              contact.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <div>
              <Label>Your Name</Label>
              <Input
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Aman Verma"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input
                value={leadMobile}
                onChange={(e) => setLeadMobile(e.target.value)}
                placeholder="+91 98xxx xxxxx"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={leadCity}
                onChange={(e) => setLeadCity(e.target.value)}
                placeholder="Mumbai"
                className="mt-1"
                required
              />
            </div>
            {leadErr && <p className="text-xs text-destructive">{leadErr}</p>}
            <Button
              type="submit"
              className="w-full gradient-primary text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Show Dealer Contact"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Auth Modal (shown if user not logged in and clicks Contact Dealer) */}
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* Full Image Gallery Lightbox Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between py-8 px-4 select-none">
          {/* Close Button */}
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 cursor-pointer z-50 bg-black/40 rounded-full hover:bg-black/60"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Main Viewport Area */}
          <div className="flex-1 flex items-center justify-center relative w-full max-w-5xl mx-auto">
            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
              className="absolute left-2 md:left-4 z-15 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Large Active Image */}
            <img
              src={images[activeImg]}
              alt={title}
              className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
              className="absolute right-2 md:right-4 z-15 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Controls & Thumbnails */}
          <div className="space-y-4 w-full max-w-4xl mx-auto text-center">
            {/* Counter */}
            <div className="inline-block bg-white/10 border border-white/5 text-white text-xs font-bold px-4.5 py-2 rounded-full">
              {activeImg + 1} / {images.length}
            </div>

            {/* Thumbnails Strip */}
            <div className="flex gap-2 overflow-x-auto justify-center pb-1 scrollbar-thin">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 aspect-[4/3] w-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImg === i ? "border-rose-900 scale-105" : "border-transparent opacity-50 hover:opacity-85"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold mt-1">{value || "—"}</div>
    </div>
  );
}

function DealerAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div className="shrink-0 h-11 w-11 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm select-none">
      {initials}
    </div>
  );
}

function CarDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded mb-5" />
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl bg-muted" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-20 aspect-[4/3] rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-7 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-9 w-1/2 bg-muted rounded mt-1" />
          </div>
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
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-36 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
