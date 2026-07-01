import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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
  X,
  Shield,
  LineChart,
  Zap,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/shared/SEO";
import { useRegister, ApiError } from "@/hooks/auth/register";
import { toast } from "sonner";
import carImg from "@/assets/download.jpg";

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
  const [showroomImage, setShowroomImage] = useState<File | null>(null);
  const [dealerLogo, setDealerLogo] = useState<File | null>(null);
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

  const onSubmit = async (data: FormData) => {
    try {
      if (!showroomImage) {
        toast.error("Please upload a showroom image.");
        return;
      }
      if (!dealerLogo) {
        toast.error("Please upload a dealer logo.");
        return;
      }

      const payload: any = {
        businessName: data.businessName,
        ownerName: data.ownerName,
        yearsInBusiness: Number(data.yearsInBusiness),
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        password: data.password,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      };

      if (data.email && data.email.trim() !== "") {
        payload.email = data.email;
      }

      if (data.gstNumber && data.gstNumber.trim() !== "") {
        payload.gstNumber = data.gstNumber;
      }

      const res = await registerDealer(payload, showroomImage, dealerLogo);

      toast.success(res?.message || "Dealer Registered Successfully");

      navigate("/auth/login");
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            const label = field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            toast.error(`${label}: ${message}`, { duration: 6005 });
          });
        } else {
          toast.error(error.message, {
            duration: 6000,
          });
        }
      } else {
        toast.error(
          "Registration failed. Please check your connection and try again.",
        );
      }
    }
  };

  const steps = [
    {
      label: "Business Identity",
      icon: Building2,
      description: "Enter your company details",
    },
    {
      label: "Contact Info",
      icon: Phone,
      description: "How buyers can reach you",
    },
    {
      label: "Location Details",
      icon: MapPin,
      description: "Where your showroom operates",
    },
    {
      label: "Brand Visuals",
      icon: ImageIcon,
      description: "Upload showroom logo & visuals",
    },
  ];

  return (
    <>
      <SEO
        title="Dealer Registration - Caryanam"
        description="Register your dealership and start receiving quality leads."
      />

      <div className="min-h-screen font-sans flex items-center justify-center p-4 sm:p-6 md:p-0 md:grid md:grid-cols-12 relative overflow-hidden text-slate-900 bg-slate-900">
        {/* Background Car Image for Mobile Viewports */}
        <div className="absolute inset-0 block md:hidden z-0">
          <img
            src={carImg}
            alt="Caryanam Background Mobile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
        </div>
        {/* LEFT PANEL: Rose to Slate Brand Panel */}
        <div className="md:col-span-6 hidden md:flex flex-col justify-between p-12 text-white relative overflow-hidden min-h-screen">
          {/* Background Car Image */}
          <img
            src={carImg}
            alt="Caryanam Background"
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          />
          {/* Dark gradient overlay over background image for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/60 to-black/40 z-0" />

          {/* Brand Logo & Header */}
          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-600/30 backdrop-blur-md flex items-center justify-center border border-white/20">
              <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center font-black text-white text-[10px]">C</div>
            </div>
            <span className="font-display font-black text-lg tracking-tight text-white drop-shadow-md">Caryanam</span>
          </Link>

          {/* Slogan Text block */}
          <div className="relative z-10 my-auto space-y-3.5 max-w-md">
            <p className="text-base font-normal text-white/90">Hello!</p>
            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none text-white">
              Welcome Back
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-500 leading-none">
              Good to see you again
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-light mt-4">
              Join Caryanam dealer network to manage stock, list vehicles, and verify buyer leads today. Create your business account to get started.
            </p>
          </div>

          {/* Bottom features bar */}
          <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 mt-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Secure Access</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Your data is protected with top-grade security</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Manage Efficiently</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Streamline inventory and lead management</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Always Fast</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Quick and seamless experience every time</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Stepper Onboarding Workspace */}
        <div className="w-full max-w-md bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-none relative overflow-hidden text-left z-10 md:h-full md:min-h-screen md:rounded-none md:max-w-none md:col-span-6 md:p-16 md:flex md:flex-col md:justify-between md:bg-white md:shadow-2xl md:border-0 md:backdrop-blur-none">

          {/* Concentric Circle and Semicircle top right details */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none select-none">
            <svg className="absolute -top-4 -right-4 w-20 h-20 text-rose-900/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="0" r="80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
              <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
              <circle cx="100" cy="0" r="40" fill="currentColor" fillOpacity="0.1" />
            </svg>
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col justify-center">

            {/* Header Status */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10 md:border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 md:text-rose-900">
                  Dealer Onboarding
                </span>
                <h2 className="font-display text-2xl font-black text-white md:text-slate-900 tracking-tight mt-1">
                  {steps[step].label}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-300 md:text-slate-400 uppercase tracking-widest">
                  Step {step + 1} of {steps.length}
                </div>
                <div className="flex gap-1 mt-1.5 justify-end">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${step === i ? "w-6 bg-rose-500 md:bg-rose-900" : step > i ? "w-2 bg-emerald-500" : "w-2 bg-slate-200"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-description */}
            <div className="mb-6 text-xs text-slate-200 md:text-slate-400 font-semibold tracking-wide">
              {steps[step].description}
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Business Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            placeholder="e.g. Mumbai Premium Motors"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("businessName")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Owner Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            placeholder="Owner's full name"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("ownerName")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            GST Number <span className="text-slate-400 font-normal">(optional)</span>
                          </Label>
                          <Input
                            placeholder="22AAAAA0000A1Z5"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm uppercase"
                            {...form.register("gstNumber")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Years in Business <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            required
                            min={0}
                            placeholder="5"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("yearsInBusiness")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Mobile Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            type="tel"
                            maxLength={10}
                            pattern="[6-9][0-9]{9}"
                            title="Mobile number must start with 6-9 and be exactly 10 digits"
                            placeholder="9579******"
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const target = e.currentTarget;
                              const val = target.value.replace(/\D/g, "");
                              if (val.length > 0) {
                                const firstDigit = val[0];
                                if (!["6", "7", "8", "9"].includes(firstDigit)) {
                                  target.value = "";
                                  return;
                                }
                              }
                              target.value = val.slice(0, 10);
                            }}
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("mobile", {
                              required: "Mobile number is required",
                              pattern: {
                                value: /^[6-9][0-9]{9}$/,
                                message: "Mobile number must start with 6-9 and be exactly 10 digits"
                              }
                            })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            WhatsApp Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            type="tel"
                            maxLength={10}
                            pattern="[6-9][0-9]{9}"
                            title="WhatsApp number must start with 6-9 and be exactly 10 digits"
                            placeholder="9579******"
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const target = e.currentTarget;
                              const val = target.value.replace(/\D/g, "");
                              if (val.length > 0) {
                                const firstDigit = val[0];
                                if (!["6", "7", "8", "9"].includes(firstDigit)) {
                                  target.value = "";
                                  return;
                                }
                              }
                              target.value = val.slice(0, 10);
                            }}
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("whatsapp", {
                              required: "WhatsApp number is required",
                              pattern: {
                                value: /^[6-9][0-9]{9}$/,
                                message: "WhatsApp number must start with 6-9 and be exactly 10 digits"
                              }
                            })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Email Address <span className="text-slate-400 font-normal">(optional)</span>
                          </Label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("email")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Password <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              required
                              minLength={6}
                              placeholder="Min. 6 characters"
                              className="h-11 px-4 pr-10 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                              {...form.register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white md:text-rose-900/60 md:hover:text-rose-900 transition-colors cursor-pointer"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                          Full Address <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          rows={2}
                          required
                          placeholder="Enter complete showroom address"
                          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm resize-none"
                          {...form.register("address")}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            placeholder="e.g. Mumbai"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("city")}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            State <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            placeholder="e.g. Maharashtra"
                            className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                            {...form.register("state")}
                          />
                        </div>
                      </div>

                      <div className="sm:max-w-[50%] space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                          Pin Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          required
                          maxLength={6}
                          placeholder="400001"
                          className="h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-slate-200 md:bg-slate-50/50 md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                          {...form.register("pinCode")}
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="max-w-md mx-auto space-y-4">
                        {/* Dealer Logo Upload */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Dealer Logo <span className="text-red-500">*</span>
                          </Label>

                          {!dealerLogo ? (
                            <label
                              htmlFor="dealer-logo-input"
                              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/10 py-6 px-4 text-center transition-all duration-200 hover:border-white hover:bg-black/20 shadow-sm md:border-slate-200 md:bg-slate-50/50 md:hover:border-rose-500 md:hover:bg-rose-50/10"
                            >
                              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 group-hover:bg-white group-hover:text-black transition-all duration-200 shadow-sm md:bg-slate-200 md:text-slate-400 md:group-hover:bg-rose-600 md:group-hover:text-white">
                                <Upload size={14} />
                              </div>
                              <span className="text-xs font-bold text-white group-hover:text-white/80 transition-colors md:text-slate-700 md:group-hover:text-rose-500">
                                Upload logo
                              </span>
                              <input
                                id="dealer-logo-input"
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                className="sr-only"
                                onChange={(e) =>
                                  setDealerLogo(e.target.files?.[0] ?? null)
                                }
                              />
                            </label>
                          ) : (
                            <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-sm h-[80px] md:border-slate-200 md:bg-rose-55/30">
                              <div className="h-10 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 md:border-slate-200 md:bg-slate-50">
                                <img
                                  src={URL.createObjectURL(dealerLogo)}
                                  alt="Logo preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white md:text-slate-800 truncate">{dealerLogo.name}</p>
                                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded mt-1 md:text-emerald-600 md:bg-emerald-50">
                                  Selected
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDealerLogo(null)}
                                className="p-1 rounded-lg text-white/50 hover:text-rose-450 hover:bg-white/10 transition-colors cursor-pointer self-start md:text-slate-400 md:hover:text-rose-500 md:hover:bg-rose-500/10"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Showroom Image Upload */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-200 md:text-slate-500">
                            Showroom Image <span className="text-red-500">*</span>
                          </Label>

                          {!showroomImage ? (
                            <label
                              htmlFor="showroom-image-input"
                              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/10 py-6 px-4 text-center transition-all duration-200 hover:border-white hover:bg-black/20 shadow-sm md:border-slate-200 md:bg-slate-50/50 md:hover:border-rose-500 md:hover:bg-rose-50/10"
                            >
                              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 group-hover:bg-white group-hover:text-black transition-all duration-200 shadow-sm md:bg-slate-200 md:text-slate-400 md:group-hover:bg-rose-600 md:group-hover:text-white">
                                <Upload size={14} />
                              </div>
                              <span className="text-xs font-bold text-white group-hover:text-white/80 transition-colors md:text-slate-700 md:group-hover:text-rose-500">
                                Upload showroom
                              </span>
                              <input
                                id="showroom-image-input"
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                className="sr-only"
                                onChange={(e) =>
                                  setShowroomImage(e.target.files?.[0] ?? null)
                                }
                              />
                            </label>
                          ) : (
                            <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-sm h-[80px] md:border-slate-200 md:bg-rose-55/30">
                              <div className="h-10 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 md:border-slate-200 md:bg-slate-50">
                                <img
                                  src={URL.createObjectURL(showroomImage)}
                                  alt="Showroom preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white md:text-slate-800 truncate">{showroomImage.name}</p>
                                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded mt-1 md:text-emerald-600 md:bg-emerald-50">
                                  Selected
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowroomImage(null)}
                                className="p-1 rounded-lg text-white/50 hover:text-rose-450 hover:bg-white/10 transition-colors cursor-pointer self-start md:text-slate-400 md:hover:text-rose-500 md:hover:bg-rose-500/10"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-5 mt-5 md:border-slate-200/60">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className="h-10 px-5 font-bold border border-white/20 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm text-xs uppercase tracking-wider md:border-slate-200 md:bg-white md:text-slate-700 md:hover:bg-slate-50 md:hover:text-slate-900"
                >
                  <ChevronLeft size={14} className="mr-1" /> Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (formRef.current?.reportValidity())
                        setStep(step + 1);
                    }}
                    disabled={isSubmitting}
                    className="h-10 px-6 gradient-primary text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/10 text-xs uppercase tracking-widest border-0"
                  >
                    Continue <ChevronRight size={14} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={form.handleSubmit(onSubmit)}
                    className="h-10 px-8 bg-rose-900 hover:bg-rose-950 text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/10 text-xs uppercase tracking-widest border-0"
                  >
                    {isSubmitting ? "Registering…" : "Register Now"} <ChevronRight size={14} />
                  </Button>
                )}
              </div>

              <p className="text-center text-sm text-white/50 font-semibold tracking-wide border-t border-white/10 pt-5 mt-5 md:text-slate-500 md:border-slate-200/60">
                Already registered?{" "}
                <Link
                  to="/auth/login"
                  className="font-bold text-rose-450 md:text-rose-900 hover:text-rose-200 md:hover:text-rose-950 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
