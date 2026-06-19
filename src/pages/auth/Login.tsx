import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Car, ShieldCheck, Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";
import { useLogin, LoginError, decodeJwtPayload } from "@/hooks/auth/login";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { isLoggingIn, login } = useLogin();
  const { setUserFromToken } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login({ email: data.email, password: data.password });
      setUserFromToken(result.role, result.data);

      toast.success(
        result.role === "admin" ? "Welcome, Admin!" : "Welcome back!",
        {
          description:
            result.role === "admin"
              ? "Admin Dashboard"
              : "Dealer Dashboard",
        },
      );

      navigate(
        result.role === "admin" ? "/admin/dashboard" : "/dealer/dashboard",
        { replace: true },
      );
    } catch (error) {
      if (error instanceof LoginError) {
        toast.error(error.message, {
          description: "Please check your credentials and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Login failed. Please check your connection.");
      }
    }
  };

  return (
    <>
      <SEO title="Sign In — AutoHub India" />
      <div className="min-h-screen grid lg:grid-cols-2 bg-background">
        {/* Left decorative panel */}
       <div className="hidden lg:flex gradient-primary text-white p-12 flex-col justify-between">
  {/* Logo */}
  <Link to="/" className="flex items-center gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
      <Car className="h-5 w-5" />
    </div>

    <div>
      <div className="font-display font-black text-lg">
        AutoHub India
      </div>
      <div className="text-xs text-white/70">
        Dealer Management Portal
      </div>
    </div>
  </Link>

  {/* Main Content */}
  <div className="max-w-lg">
    <h2 className="font-display text-4xl font-black leading-tight">
      Grow your dealership
      <br />
      with quality leads
    </h2>

    <p className="mt-4 text-lg text-white/80">
      Join 500+ verified dealers reaching 50,000+ buyers every month
      across 150+ Indian cities.
    </p>

    {/* Stats */}
    <div className="mt-10 grid grid-cols-3 gap-8">
      <div>
        <div className="text-3xl font-black">500+</div>
        <div className="mt-1 text-sm text-white/70">
          Verified dealers
        </div>
      </div>

      <div>
        <div className="text-3xl font-black">25K+</div>
        <div className="mt-1 text-sm text-white/70">
          Active listings
        </div>
      </div>

      <div>
        <div className="text-3xl font-black">100%</div>
        <div className="mt-1 text-sm text-white/70">
          KYC verified
        </div>
      </div>
    </div>

    {/* Trust Badge */}
    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
      <ShieldCheck className="h-4 w-4" />
      Trusted by leading automobile dealers across India
    </div>
  </div>

  {/* Footer */}
  <div className="flex items-center justify-between text-xs text-white/60">
    <span>© 2026 AutoHub India</span>
    <span>Secure • Reliable • Scalable</span>
  </div>
</div>

        {/* Login form */}
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="p-8">
              <h1 className="font-display text-2xl font-black text-slate-900">Sign in</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to access your portal.
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                {/* Email */}
                <div>
                  <Label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="
          h-12
          pl-12
          rounded-xl
          border-slate-200
          bg-white
          text-slate-900
          placeholder:text-slate-400
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-0
        "
                      {...form.register("email")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Enter your password"
                      className="
          h-12
          pl-12
          pr-12
          rounded-xl
          border-slate-200
          bg-white
          text-slate-900
          placeholder:text-slate-400
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-0
        "
                      {...form.register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
          hover:text-blue-600
          transition-colors
        "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end text-sm">
                  <a className="text-sky-600 hover:underline" href="#">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full gradient-primary text-white border-0"
                >
                  {isLoggingIn ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              <div className="mt-5 text-sm text-center text-slate-500">
                New dealer?{" "}
                <Link
                  to="/auth/register"
                  className="text-sky-600 font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div >
    </>
  );
}
