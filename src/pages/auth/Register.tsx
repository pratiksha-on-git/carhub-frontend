import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/shared/SEO";
import { toast } from "sonner";

const schema = z.object({
  businessName: z.string().min(2).max(100),
  ownerName: z.string().min(2).max(80),
  email: z.string().email(),
  mobile: z.string().min(10).max(15),
  whatsapp: z.string().min(10).max(15),
  password: z.string().min(6),
  address: z.string().min(5).max(200),
  city: z.string().min(2),
  state: z.string().min(2),
});

export default function Register() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { businessName: "", ownerName: "", email: "", mobile: "", whatsapp: "", password: "", address: "", city: "", state: "" } });

  return (
    <>
      <SEO title="Register as a Dealer — AutoHub India" description="Register your used-car dealership on AutoHub India. Approval within 24 hours." />
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-black">Register your dealership</h1>
            <p className="text-muted-foreground mt-2">Get verified and start receiving leads in 24 hours.</p>
          </div>
          <Card>
            <CardContent className="p-7">
              <form onSubmit={form.handleSubmit(() => { toast.success("Application submitted!", { description: "Status: Pending Approval. We'll email you within 24 hours." }); navigate("/auth/login"); })} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Business Name" {...form.register("businessName")} />
                  <Field label="Owner Name" {...form.register("ownerName")} />
                  <Field label="Mobile" {...form.register("mobile")} />
                  <Field label="WhatsApp" {...form.register("whatsapp")} />
                  <Field label="Email" type="email" {...form.register("email")} />
                  <Field label="Password" type="password" {...form.register("password")} />
                  <Field label="City" {...form.register("city")} />
                  <Field label="State" {...form.register("state")} />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea rows={3} {...form.register("address")} className="mt-1" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Dealer Logo</Label><Input type="file" accept="image/*" className="mt-1" /></div>
                  <div><Label>Showroom Image</Label><Input type="file" accept="image/*" className="mt-1" /></div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-white border-0">Submit for approval</Button>
                <div className="text-center text-sm text-muted-foreground">Already registered? <Link to="/auth/login" className="text-accent font-semibold hover:underline">Sign in</Link></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

const Field = ({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div><Label>{label}</Label><Input {...rest} className="mt-1" /></div>
);
