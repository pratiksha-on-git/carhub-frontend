import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCustomerLogin,
  useCustomerRegister,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import {
  useCustomerSendOtp,
  useCustomerVerifyOtp,
  useCustomerResetPassword,
} from "@/hooks/auth/resetPassword";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import img from '@/assets/download.jpg';
interface AuthModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (user: CustomerUser) => void;
}

const trustHighlights = [
  {
    icon: BadgeCheck,
    title: "KYC-Verified Dealers",
    description: "Every dealership undergoes strict background checks",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Inventory",
    description: "Vehicle listings undergo rigorous verification checks",
  },
  {
    icon: CheckCircle2,
    title: "Direct Dealer Connect",
    description: "No middlemen or hidden service charges",
  },
];

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [registerDone, setRegisterDone] = useState(false);

  const handleRegisterSuccess = () => {
    setRegisterDone(true);
    setTab("login");
    // Success notification disappears after 2 seconds
    setTimeout(() => {
      setRegisterDone(false);
    }, 2000);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setRegisterDone(false);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-[95vw] sm:max-w-4xl border-none rounded-3xl shadow-2xl shadow-slate-950/20 max-h-[90vh] md:h-[620px] flex flex-col justify-stretch">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] h-full max-h-[90vh] md:max-h-[620px] overflow-hidden">
          {/* Left Column: Visual Panel with Brand & Trust Highlights */}
          <div className="relative hidden md:flex flex-col justify-between p-8 text-white select-none overflow-hidden h-full">
            {/* Background Image with Slow Pan/Zoom */}
            <motion.div
              initial={{ scale: 1.06, opacity: 0.55 }}
              animate={{ scale: 1.01, opacity: 0.65 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={img}
                alt="Premium Luxury Car"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Dark background tint base & gradient overlay for text readability */}
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />


            {/* Brand Logo Header */}
            <div className="relative z-10 flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground font-black text-base shadow-lg shadow-accent/25"
              >
                A
              </motion.div>
              <span className="font-display font-black text-base tracking-wide text-white">
                Caryanam
              </span>
            </div>

            {/* Trust Content List */}
            <div className="relative z-10 space-y-7 mt-auto">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-accent uppercase backdrop-blur-md border border-white/5">
                  <Sparkles className="h-3 w-3 animate-pulse" /> Verified Listings
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  Find your dream car from trusted dealers
                </h3>
              </div>

              <ul className="space-y-4">
                {trustHighlights.map((highlight, index) => (
                  <motion.li
                    key={highlight.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.15, duration: 0.45 }}
                    className="flex items-start gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 shadow-md group hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-accent group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-inner">
                      <highlight.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {highlight.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Dynamic Form Switcher with Internal Scrollbar */}
          <div className="overflow-y-auto h-full max-h-[90vh] md:max-h-[620px] p-6 sm:p-10 bg-card text-card-foreground scrollbar-thin scrollbar-thumb-muted">
            <div className="min-h-full flex flex-col justify-center space-y-6 py-2">
              {/* Header Title with animated state transitions */}
              <div className="space-y-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text">
                      {tab === "login"
                        ? "Welcome back"
                        : tab === "register"
                          ? "Create account"
                          : "Reset password"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {tab === "login"
                        ? "Enter your credentials to access your account."
                        : tab === "register"
                          ? "Register to unlock direct contact and wishlists."
                          : "Follow the steps to reset your account password."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tab Navigation buttons */}
              {tab !== "forgot" && (
                <div className="relative flex rounded-2xl bg-muted/50 p-1.5 gap-1.5 border border-muted-foreground/5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className={`relative flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors duration-200 cursor-pointer z-10 ${tab === "login"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab === "login" && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-background shadow-md border border-border/40"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    )}
                    <span className="relative z-20">Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("register");
                      setRegisterDone(false);
                    }}
                    className={`relative flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors duration-200 cursor-pointer z-10 ${tab === "register"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab === "register" && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-background shadow-md border border-border/40"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    )}
                    <span className="relative z-20">Register</span>
                  </button>
                </div>
              )}

              {/* Success registration notice */}
              <AnimatePresence>
                {registerDone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4 text-emerald-700 dark:text-emerald-400 flex items-start gap-3 shadow-sm shadow-emerald-500/5 overflow-hidden"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5 animate-bounce" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">
                        Registered successfully!
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Please sign in with your email and password to start
                        exploring.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Forms Switcher Panel */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {tab === "login" ? (
                      <LoginForm
                        onSuccess={(u) => {
                          onSuccess(u);
                          handleOpenChange(false);
                        }}
                        onForgotPassword={() => setTab("forgot")}
                      />
                    ) : tab === "register" ? (
                      <RegisterForm onSuccess={handleRegisterSuccess} />
                    ) : (
                      <ForgotPasswordForm
                        onBackToLogin={() => setTab("login")}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({
  onSuccess,
  onForgotPassword,
}: {
  onSuccess: (u: CustomerUser) => void;
  onForgotPassword: () => void;
}) {
  const { isLoggingIn, login } = useCustomerLogin();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setMobile("");
      return;
    }
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 0) {
      const firstDigit = digitsOnly[0];
      if (!["6", "7", "8", "9"].includes(firstDigit)) {
        return;
      }
    }
    setMobile(digitsOnly.slice(0, 10));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const user = await login({ mobile, password });
      toast.success("Logged in successfully!");
      onSuccess(user);
    } catch (e: any) {
      setErr(e.message);
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Mobile input field wrapper */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
          Mobile Number
        </Label>
        <div className="relative group">
          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
          <Input
            type="tel"
            value={mobile}
            onChange={handleMobileChange}
            placeholder="Enter 10-digit mobile number"
            className="h-12 pl-11 rounded-xl border-border/60 hover:bg-muted/30 text-black focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            title="Mobile number must start with 6-9 and be exactly 10 digits"
            required
          />
        </div>
      </div>

      {/* Password input field wrapper */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
          Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 pl-11 pr-10 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30 text-black focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot password trigger */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-bold text-accent hover:underline bg-transparent border-0 cursor-pointer transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Action alert box for server errors */}
      {err && (
        <div className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Primary visual trigger */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { isSubmitting, register } = useCustomerRegister();
  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    customerCity: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Dynamic mobile validation: digits only, must start with 6-9, max length 10
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      set("mobile", "");
      return;
    }

    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length > 0) {
      const firstDigit = digitsOnly[0];
      if (!["6", "7", "8", "9"].includes(firstDigit)) {
        return;
      }
    }

    set("mobile", digitsOnly.slice(0, 10));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      onSuccess();
    } catch (e: any) {
      setErr(e.message);
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      {/* Full Name input */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
          Full Name
        </Label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
          <Input
            value={form.customerName}
            onChange={(e) => set("customerName", e.target.value)}
            placeholder="Aman Verma"
            className="h-12 pl-11 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
            required
          />
        </div>
      </div>

      {/* Grid of Mobile & City */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
            Mobile
          </Label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
            <Input
              type="tel"
              value={form.mobile}
              onChange={handleMobileChange}
              placeholder="9876543210"
              className="h-12 pl-11 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              title="Mobile number must start with 6-9 and be exactly 10 digits"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
            City
          </Label>
          <div className="relative group">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
            <Input
              value={form.customerCity}
              onChange={(e) => set("customerCity", e.target.value)}
              placeholder="Mumbai"
              className="h-12 pl-11 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
              required
            />
          </div>
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
          Email Address
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className="h-12 pl-11 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
            required
          />
        </div>
      </div>

      {/* Password input */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
          Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="Min. 6 characters"
            className="h-12 pl-11 pr-10 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
            minLength={6}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error alert box */}
      {err && (
        <div className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Submit Trigger */}
      <Button
        type="submit"
        className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer mt-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const { isPending: sendingOtp, sendOtp } = useCustomerSendOtp();
  const { isPending: verifyingOtp, verifyOtp } = useCustomerVerifyOtp();
  const { isPending: resettingPassword, resetPassword } =
    useCustomerResetPassword();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await sendOtp(email);
      toast.success(
        typeof res === "string"
          ? res
          : res?.message || res?.data?.message || "OTP sent to your email"
      );
      setStep("verify");
    } catch (error: any) {
      setErr(error.message);
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await verifyOtp({ email, otp });
      toast.success(
        typeof res === "string"
          ? res
          : res?.message ||
          res?.data?.message ||
          "OTP verified successfully"
      );
      setStep("reset");
    } catch (error: any) {
      setErr(error.message);
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
      return;
    }
    try {
      const res = await resetPassword({ email, otp, newPassword });
      toast.success(
        typeof res === "string"
          ? res
          : res?.message ||
          res?.data?.message ||
          "Password changed successfully"
      );
      onBackToLogin();
    } catch (error: any) {
      setErr(error.message);
      // Auto-disappear error message after 2 seconds
      setTimeout(() => setErr(""), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Sophisticated Step indicator Progress Bar */}
      <div className="relative flex items-center justify-between w-full mb-6 mt-2 px-1">
        {/* Progress track container */}
        <div className="absolute left-[18px] right-[18px] top-[18px] -translate-y-1/2 h-0.5 bg-muted rounded-full overflow-hidden">
          {/* Active progress track line */}
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width:
                step === "send" ? "0%" : step === "verify" ? "50%" : "100%",
            }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Steps */}
        {(["send", "verify", "reset"] as const).map((s, i) => {
          const isCompleted =
            (step === "verify" && i < 1) || (step === "reset" && i < 2);
          const isActive = step === s;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                className={`h-9 w-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted
                  ? "bg-accent border-accent text-accent-foreground"
                  : isActive
                    ? "bg-background border-accent text-accent shadow-md shadow-accent/20"
                    : "bg-muted border-transparent text-muted-foreground/60"
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground fill-accent-foreground/5" />
                ) : (
                  i + 1
                )}
              </motion.div>
              <span
                className={`text-[9px] sm:text-[10px] mt-1.5 font-bold uppercase tracking-wider transition-colors duration-300 ${isActive
                  ? "text-accent"
                  : isCompleted
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                  }`}
              >
                {s === "send"
                  ? "Request"
                  : s === "verify"
                    ? "Verify"
                    : "Reset"}
              </span>
            </div>
          );
        })}
      </div>

      {err && (
        <div className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2 animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* Step 1: Send OTP */}
      {step === "send" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider pl-0.5">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-12 pl-11 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            disabled={sendingOtp}
          >
            {sendingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP…
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="rounded-xl bg-muted/30 border border-border/40 p-3.5 text-center text-xs">
            <p className="text-muted-foreground">
              We have sent a verification code to
            </p>
            <p className="font-bold text-foreground mt-0.5">{email}</p>
          </div>

          {/* Redesigned 6-card InputOTP container */}
          <div className="space-y-2 flex flex-col items-center">
            <Label className="text-xs font-semibold text-muted-foreground/90 uppercase tracking-wider text-center w-full">
              Verification Code
            </Label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup className="gap-2 sm:gap-3">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl font-bold cursor-pointer transition-all active:scale-[0.98] border-border/80 "
              onClick={() => setStep("send")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-[1.8] h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>

          <button
            type="button"
            className="text-xs text-accent font-bold hover:underline w-full text-center hover:opacity-90 bg-transparent border-0 cursor-pointer transition-colors block mt-2"
            onClick={handleSendOtp as any}
            disabled={sendingOtp}
          >
            {sendingOtp ? (
              <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
            ) : null}
            Resend OTP
          </button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
              New Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="h-12 pl-11 pr-10 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
              Confirm New Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75 group-focus-within:text-rose-900 dark:group-focus-within:text-rose-400 transition-colors duration-200" />
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="h-12 pl-11 pr-10 rounded-xl bg-muted/20 border-border/60 hover:bg-muted/30  text-black  focus-visible:ring-rose-900/15 focus-visible:border-rose-900 dark:focus-visible:border-rose-500 dark:focus-visible:ring-rose-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            disabled={resettingPassword}
          >
            {resettingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password…
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}

      {step === "send" && (
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 w-full text-center bg-transparent border-0 cursor-pointer transition-colors mt-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
        </button>
      )}
    </div>
  );
}
