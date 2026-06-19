import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Building2,
  Phone,
  MapPin,
  ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,

  User,
  ReceiptText,
  BriefcaseBusiness,

  MessageCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPinned,
  Building,
  Map,
  LocateFixed,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/shared/SEO";
import { useRegister, ApiError } from "@/hooks/auth/register";
import { toast } from "sonner";
type FormData = {
  businessName: string;
  ownerName: string;
  gstNumber: string;
  yearsInBusiness: string;
  email: string;
  mobile: string;
  whatsapp: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
};



export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [dealerLogo, setDealerLogo] = useState<File | null>(null);
  const [showroomImage, setShowroomImage] = useState<File | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { isSubmitting, registerDealer } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      businessName: "",
      ownerName: "",
      gstNumber: "",
      yearsInBusiness: "",
      email: "",
      mobile: "",
      whatsapp: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const progress = ((step + 1) / 4) * 100;

  const onSubmit = async (data: FormData) => {
    try {
      if (!dealerLogo) {
        toast.error("Please upload a dealer logo.");
        return;
      }
      if (!showroomImage) {
        toast.error("Please upload a showroom image.");
        return;
      }

      const payload: any = {
        businessName: data.businessName,
        ownerName: data.ownerName,
        yearsInBusiness: Number(data.yearsInBusiness),
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        email: data.email,
        password: data.password,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      };

      if (data.gstNumber && data.gstNumber.trim() !== "") {
        payload.gstNumber = data.gstNumber;
      }

      await registerDealer(payload, dealerLogo, showroomImage);

      toast.success("Registration Successful! 🎉", {
        description: "Status: Pending Approval. We'll email you within 24 hours.",
      });

      navigate("/auth/login");
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          // Show each field validation error as a separate toast
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            const label = field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            toast.error(`${label}: ${message}`, { duration: 6000 });
          });
        } else {
          // Single API-level error (e.g. "Mobile Number Already Exists")
          toast.error(error.message, {

            duration: 6000,
          });
        }
      } else {
        toast.error("Registration failed. Please check your connection and try again.");
      }
    }
  };

  const steps = [
    {
      label: "Business",
      icon: Building2,
      description: "Your company details",
    },
    {
      label: "Contact",
      icon: Phone,
      description: "How buyers reach you",
    },
    {
      label: "Location",
      icon: MapPin,
      description: "Where you operate",
    },
    {
      label: "Media",
      icon: ImageIcon,
      description: "Showcase your showroom",
    },
  ];

  return (
    <>
      <SEO
        title="Dealer Registration - AutoHub India"
        description="Register your dealership and start receiving quality leads."
      />

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-slate-200">
              Dealer Registration
            </div>

            <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black tracking-tight text-slate-950 ">
                  Grow your dealership with AutoHub India
                </h1>
                <p className="mt-4 text-lg text-slate-600 ">
                  Get verified, list inventory and start receiving quality buyer leads in under 24 hours.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                  KYC verified
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-400" />
                  25k+ listings
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center">
                    {steps.map((item, index) => {
                      const Icon = item.icon;
                      const active = step === index;
                      const completed = step > index;

                      return (
                        <React.Fragment key={item.label}>
                          <div
                            className={`
              flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all
              ${active
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : completed
                                  ? "bg-green-50 border-green-400 text-green-700"
                                  : "bg-white border-slate-200 text-slate-500"
                              }
            `}
                          >
                            {completed ? <CheckCircle2 size={15} /> : <Icon size={15} />}
                            <span>{item.label}</span>
                          </div>

                          {index < steps.length - 1 && (
                            <div className="flex-1 mx-3 h-px bg-slate-300" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Progress Line */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary transition-all duration-300"
                        style={{
                          width: `${((step + 1) / steps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-8">
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Tell us about your business</h2>
                        <p className="mt-2 text-slate-600">Your dealership identity on AutoHub India.</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Business Name */}
                        <div>
                          <Label className="mb-2 block">
                            Business Name <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              required
                              placeholder="e.g. Mumbai Premium Motors"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("businessName")}
                            />
                          </div>
                        </div>

                        {/* Owner Name */}
                        <div>
                          <Label className="mb-2 block">
                            Owner Name <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              required
                              placeholder="Full name"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("ownerName")}
                            />
                          </div>
                        </div>

                        {/* GST Number */}
                        <div>
                          <Label className="mb-2 block">
                            GST Number
                          </Label>

                          <div className="relative">
                            <ReceiptText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input

                              placeholder="22AAAAA0000A1Z5"
                              className="h-12 pl-12 rounded-xl uppercase"
                              {...form.register("gstNumber")}
                            />
                          </div>
                        </div>

                        {/* Years in Business */}
                        <div>
                          <Label className="mb-2 block">
                            Years in Business <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <BriefcaseBusiness className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              type="number"
                              required
                              min={0}
                              placeholder="5"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("yearsInBusiness")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Contact details</h2>
                        <p className="mt-2 text-slate-600">How customers can reach you.</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Mobile Number */}
                        <div>
                          <Label className="mb-2 block">
                            Mobile Number <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              required
                              maxLength={10}
                              placeholder="e.g. 9876543210"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("mobile")}
                            />
                          </div>
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                          <Label className="mb-2 block">
                            WhatsApp Number <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <MessageCircle className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              required
                              maxLength={10}
                              placeholder="e.g. 9876543210"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("whatsapp")}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <Label className="mb-2 block">
                            Email <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              type="email"
                              required
                              placeholder="Enter email address"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("email")}
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <Label className="mb-2 block">
                            Password <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              type={showPassword ? "text" : "password"}
                              required
                              minLength={6}
                              placeholder="Minimum 6 characters"
                              className="h-12 pl-12 pr-12 rounded-xl"
                              {...form.register("password")}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Dealership location</h2>
                        <p className="mt-2 text-slate-600">Tell buyers where you operate.</p>
                      </div>

                      <div className="space-y-5">
                        {/* Address */}
                        <div>
                          <Label className="mb-2 block">
                            Address <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <MapPinned className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                            <Textarea
                              rows={4}
                              required
                              placeholder="Enter complete business address"
                              className="
          pl-12
          rounded-xl
          border-slate-200
          bg-white
          shadow-sm
          resize-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-0
        "
                              {...form.register("address")}
                            />
                          </div>
                        </div>

                        {/* City & State */}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label className="mb-2 block">
                              City <span className="text-red-500">*</span>
                            </Label>

                            <div className="relative">
                              <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                              <Input
                                required
                                placeholder="e.g. Pune"
                                className="h-12 pl-12 rounded-xl"
                                {...form.register("city")}
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="mb-2 block">
                              State <span className="text-red-500">*</span>
                            </Label>

                            <div className="relative">
                              <Map className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                              <Input
                                required
                                placeholder="e.g. Maharashtra"
                                className="h-12 pl-12 rounded-xl"
                                {...form.register("state")}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pin Code */}
                        <div>
                          <Label className="mb-2 block">
                            Pin Code <span className="text-red-500">*</span>
                          </Label>

                          <div className="relative">
                            <LocateFixed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <Input
                              required
                              maxLength={6}
                              placeholder="411004"
                              className="h-12 pl-12 rounded-xl"
                              {...form.register("pinCode")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Add your brand visuals</h2>
                        <p className="mt-2 text-slate-600">A great logo & showroom photo build trust with buyers.</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label className="text-slate-700 font-semibold">Dealer Logo <span className="text-red-500">*</span></Label>
                          <label
                            htmlFor="dealer-logo-input"
                            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
                          >
                            <Upload className="mb-2 h-6 w-6 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                              {dealerLogo?.name || "Click or drag to upload"}
                            </span>
                            <span className="mt-1 text-xs text-slate-400">PNG/JPG, square, min 256px</span>
                            <input
                              id="dealer-logo-input"
                              type="file"
                              accept=".png, .jpg, .jpeg"
                              className="sr-only"
                              onChange={(event) =>
                                setDealerLogo(event.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold">Showroom Image <span className="text-red-500">*</span></Label>
                          <label
                            htmlFor="showroom-image-input"
                            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
                          >
                            <Upload className="mb-2 h-6 w-6 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                              {showroomImage?.name || "Click or drag to upload"}
                            </span>
                            <span className="mt-1 text-xs text-slate-400">PNG/JPG, landscape, min 1200px</span>
                            <input
                              id="showroom-image-input"
                              type="file"
                              accept=".png, .jpg, .jpeg"
                              className="sr-only"
                              onChange={(event) =>
                                setShowroomImage(event.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className=" border-t pt-4 sm:flex sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                      className="w-full justify-center  bg-slate-100 border border-slate-300 text-black hover:bg-slate-200 sm:w-auto"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>

                    <div className="mt-4 text-sm text-slate-600 sm:mt-0">
                      Step {step + 1} of 4
                    </div>

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (formRef.current?.reportValidity()) setStep(step + 1);
                        }}
                        disabled={isSubmitting}
                        className="mt-4 w-full gradient-primary text-white hover:gradient-primary-hover sm:mt-0 sm:w-auto"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}
                        className="mt-4 w-full gradient-primary text-white hover:gradient-primary-hover sm:mt-0 sm:w-auto"
                      >
                        {isSubmitting ? "Registering..." : "Register"}
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-slate-500">
                    Already registered?{' '}
                    <Link
                      to="/auth/login"
                      className="font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-950">Why dealers love AutoHub</h3>
                  <div className="mt-5 space-y-4">
                    {[
                      'Quality verified buyer leads',
                      'Manage inventory easily',
                      'Featured & boosted listings',
                      'Transparent pricing',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 text-sky-500" />
                        <p className="text-sm text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trusted by</p>
                <p className="mt-4 text-5xl font-black">500+</p>
                <p className="mt-2 text-lg font-semibold">dealers</p>
                <p className="mt-4 text-slate-400">
                  Across 150+ Indian cities. Reach 50,000+ monthly buyers.
                </p>
                <Button variant="secondary" className="mt-6 w-full border border-white/10 bg-white/10 text-white hover:bg-white/15">
                  Explore plans
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>

      <Input
        {...props}
        className="mt-2 rounded-3xl border border-slate-200 bg-white/95 text-slate-900 shadow-sm"
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}