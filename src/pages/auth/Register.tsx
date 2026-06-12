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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SEO } from "@/components/shared/SEO";
import { toast } from "sonner";
type FormData = {
  businessName: string;
  ownerName: string;
  gstNumber: string;
  experience: string;
  email: string;
  mobile: string;
  whatsapp: string;
  password: string;
  address: string;
  city: string;
  state: string;
};



export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const form = useForm<FormData>({

    defaultValues: {
      businessName: "",
      ownerName: "",
      gstNumber: "",
      experience: "",
      email: "",
      mobile: "",
      whatsapp: "",
      password: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const progress = ((step + 1) / 4) * 100;

  const onSubmit = () => {
    toast.success("Application submitted!", {
      description:
        "Status: Pending Approval. We'll email you within 24 hours.",
    });

    navigate("/auth/login");
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
                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Grow your dealership with AutoHub India
                </h1>
                <p className="mt-4 text-lg text-slate-600 sm:text-xl">
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
          <button
            type="button"
            onClick={() => setStep(index)}
            className={`
              flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all
              ${
                active
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : completed
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-500"
              }
            `}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </button>

          {index < steps.length - 1 && (
            <div className="flex-1 mx-3 h-px bg-slate-300" />
          )}
        </React.Fragment>
      );
    })}
  </div>

  {/* Progress Line */}
  <div className="mt-4">
    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full gradient-primary transition-all duration-300"
        style={{
          width: `${((step + 1) / steps.length) * 100}%`,
        }}
      />
    </div>
  </div>
</div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Tell us about your business</h2>
                        <p className="mt-2 text-slate-600">Your dealership identity on AutoHub India.</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="Business Name *"
                          placeholder="e.g. Mumbai Premium Motors"
                          error={errors.businessName?.message as string}
                          {...form.register("businessName")}
                        />
                        <Field
                          label="Owner Name *"
                          placeholder="Full name"
                          error={errors.ownerName?.message as string}
                          {...form.register("ownerName")}
                        />
                        <Field
                          label="GST Number"
                          placeholder="22AAAAA0000A1Z5"
                          {...form.register("gstNumber")}
                        />
                        <Field
                          label="Years in business"
                          placeholder="5 Years"
                          {...form.register("experience")}
                        />
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
                        <Field
                          label="Mobile Number"
                          error={errors.mobile?.message as string}
                          {...form.register("mobile")}
                        />
                        <Field
                          label="WhatsApp Number"
                          error={errors.whatsapp?.message as string}
                          {...form.register("whatsapp")}
                        />
                        <Field
                          label="Email"
                          type="email"
                          error={errors.email?.message as string}
                          {...form.register("email")}
                        />
                        <Field
                          label="Password"
                          type="password"
                          error={errors.password?.message as string}
                          {...form.register("password")}
                        />
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
                        <div>
                          <Label className="text-slate-700">Address</Label>
                          <Textarea
                            rows={4}
                            className="mt-2 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm"
                            {...form.register("address")}
                          />
                          {errors.address && (
                            <p className="mt-2 text-sm text-red-600">{errors.address.message as string}</p>
                          )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field
                            label="City"
                            error={errors.city?.message as string}
                            {...form.register("city")}
                          />
                          <Field
                            label="State"
                            error={errors.state?.message as string}
                            {...form.register("state")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">Upload media</h2>
                        <p className="mt-2 text-slate-600">Showcase your dealership professionally.</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label className="text-slate-700">Dealer Logo</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-2 rounded-3xl border border-slate-200 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700">Showroom Image</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-2 rounded-3xl border border-slate-200 bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:flex sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                      className="w-full justify-center sm:w-auto"
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
                        onClick={() => setStep(step + 1)}
                        className="mt-4 w-full gradient-primary text-white hover:gradient-primary-hover sm:mt-0 sm:w-auto"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="mt-4 w-full gradient-primary text-white hover:gradient-primary-hover sm:mt-0 sm:w-auto"
                      >
                        Submit Application
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
);}

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