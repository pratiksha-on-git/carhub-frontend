import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SEO } from "@/components/shared/SEO";

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });
type Vals = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const form = useForm<Vals>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = (v: Vals) => {
    const { role } = login(v.email, v.password);
    toast.success(`Welcome back!`);
    navigate(loc.state?.from || (role === "admin" ? "/admin/dashboard" : "/dealer/dashboard"), { replace: true });
  };

  return (
    <>
      <SEO title="Dealer Login — AutoHub India" />
      <div className="min-h-screen grid lg:grid-cols-2 bg-background">
        <div className="hidden lg:flex gradient-primary text-white p-12 flex-col justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent"><Car className="h-5 w-5" /></div>
            <div className="font-display font-black">AutoHub India</div>
          </Link>
          <div>
            <h2 className="font-display text-3xl font-black leading-tight">Manage your dealership.<br/>Anywhere, anytime.</h2>
            <p className="text-white/70 mt-3 max-w-md">Listings, leads, analytics and subscriptions in one premium portal.</p>
            <div className="flex items-center gap-2 mt-6 text-sm text-white/80"><ShieldCheck className="h-4 w-4" /> Trusted by 500+ verified dealers</div>
          </div>
          <div className="text-xs text-white/50">© AutoHub India</div>
        </div>
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-7">
              <h1 className="font-display text-2xl font-black">Sign in</h1>
              <p className="text-sm text-muted-foreground mt-1">Use <code className="bg-muted px-1 rounded">admin@autohub.in</code> for admin, anything else for dealer.</p>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div><Label>Email</Label><Input {...form.register("email")} className="mt-1" placeholder="you@example.com" /></div>
                <div><Label>Password</Label><Input type="password" {...form.register("password")} className="mt-1" /></div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2"><Checkbox /> Remember me</label>
                  <a className="text-accent hover:underline" href="#">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full gradient-primary text-white border-0">Sign in</Button>
              </form>
              <div className="mt-5 text-sm text-center text-muted-foreground">
                New dealer? <Link to="/auth/register" className="text-accent font-semibold hover:underline">Create an account</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
