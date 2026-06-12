import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  gstNumber: z.string().optional(),
  experience: z.string().optional(),

  email: z.string().email(),
  mobile: z.string().min(10),
  whatsapp: z.string().min(10),
  password: z.string().min(6),

  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
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
    },
    {
      label: "Contact",
      icon: Phone,
    },
    {
      label: "Location",
      icon: MapPin,
    },
    {
      label: "Media",
      icon: ImageIcon,
    },
  ];

  return (
    <>
      <SEO
        title="Dealer Registration - AutoHub India"
        description="Register your dealership and start receiving quality leads."
      />

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* HERO */}
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full border gradient-primary text-white px-4 py-2 text-sm font-medium shadow-sm">
              Dealer Registration
            </div>

            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight max-w-3xl">
              Grow your dealership with AutoHub India
            </h1>

            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Get verified, list inventory and start receiving quality buyer
              leads in under 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">

            {/* MAIN FORM */}
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-8">

                {/* STEP TABS */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  {steps.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                        ${
                          step === index
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-muted-foreground"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Progress value={progress} className="mb-8 h-2" />

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >

                  {/* STEP 1 */}
                  {step === 0 && (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Tell us about your business
                        </h2>

                        <p className="text-muted-foreground">
                          Your dealership identity on AutoHub India.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <Field
                          label="Business Name *"
                          placeholder="e.g Mumbai Premium Motors"
                          {...form.register("businessName")}
                        />

                        <Field
                          label="Owner Name *"
                          placeholder="Full name"
                          {...form.register("ownerName")}
                        />

                        <Field
                          label="GST Number"
                          placeholder="22AAAAA0000A1Z5"
                          {...form.register("gstNumber")}
                        />

                        <Field
                          label="Years in Business"
                          placeholder="5 Years"
                          {...form.register("experience")}
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 1 && (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Contact Details
                        </h2>

                        <p className="text-muted-foreground">
                          How customers can reach you.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <Field
                          label="Mobile Number"
                          {...form.register("mobile")}
                        />

                        <Field
                          label="WhatsApp Number"
                          {...form.register("whatsapp")}
                        />

                        <Field
                          label="Email"
                          type="email"
                          {...form.register("email")}
                        />

                        <Field
                          label="Password"
                          type="password"
                          {...form.register("password")}
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 2 && (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Dealership Location
                        </h2>

                        <p className="text-muted-foreground">
                          Tell buyers where you operate.
                        </p>
                      </div>

                      <div>
                        <Label>Address</Label>

                        <Textarea
                          rows={4}
                          className="mt-2 rounded-xl"
                          {...form.register("address")}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <Field
                          label="City"
                          {...form.register("city")}
                        />

                        <Field
                          label="State"
                          {...form.register("state")}
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 4 */}
                  {step === 3 && (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Upload Media
                        </h2>

                        <p className="text-muted-foreground">
                          Showcase your dealership professionally.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <Label>Dealer Logo</Label>

                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Showroom Image</Label>

                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* FOOTER */}
                  <div className="pt-6 border-t flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Step {step + 1} of 4
                    </div>

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Application
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      to="/auth/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* SIDEBAR */}
            <div className="space-y-5">

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-5">
                    Why dealers love AutoHub
                  </h3>

                  <div className="space-y-4">
                    {[
                      "Quality verified buyer leads",
                      "Manage inventory easily",
                      "Featured & boosted listings",
                      "Transparent pricing",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          className="text-green-500 mt-0.5"
                          size={18}
                        />
                        <span className="text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
                <CardContent className="p-6">
                  <p className="uppercase tracking-wider text-xs text-slate-300">
                    Trusted By
                  </p>

                  <h3 className="text-5xl font-black mt-3">
                    500+
                  </h3>

                  <p className="font-semibold">
                    Dealers
                  </p>

                  <p className="mt-4 text-slate-300">
                    Across 150+ Indian cities. Reach
                    50,000+ monthly buyers.
                  </p>

                  <Button
                    variant="secondary"
                    className="mt-5"
                  >
                    Explore Plans
                  </Button>
                </CardContent>
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
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>

      <Input
        {...props}
        className="mt-2 rounded-xl h-11"
      />
    </div>
  );
}