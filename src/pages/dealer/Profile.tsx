import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  MapPin,
  User,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  ShieldAlert,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { useGetDealerProfile } from "@/hooks/dealer/useGetDealerProfile";
import { useUpdateDealerProfile } from "@/hooks/dealer/useUpdateDealerProfile";
import {
  useCustomerSendOtp,
  useCustomerVerifyOtp,
  useCustomerResetPassword,
} from "@/hooks/auth/resetPassword";

import { formatDate } from "@/utils/helpers";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function DealerProfile() {
  const { user, updateUserFields } = useDealerAuth();
  const dealerId = user?.id?.toString() || "";

  const { data: profile, isLoading } = useGetDealerProfile(dealerId);
  const updateMutation = useUpdateDealerProfile(dealerId);

  // Profile form state
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState<number | "">("");

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || "");
      setOwnerName(profile.ownerName || "");
      setMobile(profile.mobile || "");
      setWhatsapp(profile.whatsapp || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setPinCode(profile.pinCode || "");
      setGstNumber(profile.gstNumber || "");
      setYearsInBusiness(
        profile.yearsInBusiness !== undefined && profile.yearsInBusiness !== null
          ? Number(profile.yearsInBusiness)
          : ""
      );
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        businessName,
        ownerName,
        mobile,
        whatsapp,
        address,
        city,
        state,
        pinCode,
      });
      updateUserFields({ businessName, ownerName });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : String(err))
      );
    }
  };

  // Change password flow
  const [pwModal, setPwModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isPending: sendingOtp, sendOtp } = useCustomerSendOtp();
  const { isPending: verifyingOtp, verifyOtp } = useCustomerVerifyOtp();
  const { isPending: resettingPassword, resetPassword } = useCustomerResetPassword();

  const openPasswordModal = () => {
    setStep("send");
    setEmail(profile?.email || "");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setPwModal(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await sendOtp(email);
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP sent to your email")
      );
      setStep("verify");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, otp });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP verified")
      );
      setStep("reset");
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await resetPassword({ email, otp, newPassword });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "Password changed successfully")
      );
      setPwModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-4 w-64 mt-2 rounded" />
        </div>

        <div className="space-y-6">
          {/* Top Card Skeleton */}
          <Card className="rounded-3xl border border-slate-100 shadow-premium overflow-hidden bg-white">
            <Skeleton className="h-32 w-full" />
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                  <Skeleton className="h-24 w-24 rounded-2xl border-4 border-white bg-white" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                </div>
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
              <hr className="my-5 border-slate-100" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Card Skeleton */}
          <Card className="rounded-3xl border border-slate-100 shadow-premium bg-white">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="space-y-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-11 w-full rounded-xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your business information and security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Top Card - Quick Overview */}
        <Card className="rounded-3xl border border-slate-100 shadow-premium overflow-hidden bg-white">
          {/* Showroom Image Banner */}
          <div className="relative h-40 bg-slate-100 overflow-hidden">
            {profile?.showroomImage ? (
              <img
                src={profile.showroomImage.trim()}
                alt="Showroom"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary opacity-20 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          </div>

          <CardContent className="p-6 relative pt-0">
            {/* Dealer Logo, Info & Change Password Button */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                {profile?.dealerLogo ? (
                  <img
                    src={profile.dealerLogo.trim()}
                    alt="Logo"
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-white bg-white shadow-md z-10"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md z-10">
                    {businessName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <h2 className="text-xl md:text-2xl capitalize font-black text-slate-900 leading-none">
                      {businessName}
                    </h2>

                  </div>
                  <p className="text-sm text-slate-500 capitalize font-medium">Owner: {ownerName}</p>
                </div>
              </div>

              <Button
                type="button"
                className="rounded-xl flex items-center justify-center gap-2 font-semibold h-10 gradient-primary text-white hover:opacity-90 transition-colors shadow-sm cursor-pointer px-4 shrink-0 self-center sm:self-end"
                onClick={openPasswordModal}
              >
                <Lock className="h-3.5 w-3.5 text-white" />
                Change Password
              </Button>
            </div>

            {/* Display Only Details - Row Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mt-6 pt-5 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Email</span>
                <span className="font-semibold text-slate-700 truncate block" title={profile?.email}>{profile?.email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">GST Number</span>
                <span className="font-bold text-slate-700">{profile?.gstNumber || "—"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Years in Business</span>
                <span className="font-bold text-slate-700">{profile?.yearsInBusiness ?? "—"} years</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Registered On</span>
                <span className="font-medium text-slate-700">{profile?.createdAt ? formatDate(profile.createdAt) : "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Card - Form */}
        <Card className="rounded-3xl border border-slate-100 shadow-premium bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Update your company profile and showroom details.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Business Info Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Building2 className="h-4 w-4" /> Business Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Business Name</Label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Owner Name</Label>
                    <Input
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Phone className="h-4 w-4" /> Contact Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Mobile Phone</Label>
                    <Input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">WhatsApp Number</Label>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp contact"
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <MapPin className="h-4 w-4" /> Location Details
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Office / Showroom Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">City</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">State</Label>
                      <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">PIN Code</Label>
                      <Input
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="e.g. 411045"
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl px-8 gradient-primary text-white hover:opacity-90 font-semibold shadow-md flex items-center gap-2 h-11 cursor-pointer"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Dialog open={pwModal} onOpenChange={setPwModal}>
        <DialogContent className="p-6 sm:p-10 overflow-hidden max-w-[95vw] sm:max-w-md border-none rounded-3xl shadow-2xl bg-white text-slate-900">
          <DialogHeader className="space-y-1.5 pb-2">
            <DialogTitle className="font-display text-2xl font-black tracking-tight text-slate-900">
              {step === "send" && "Change Password"}
              {step === "verify" && "Verify OTP"}
              {step === "reset" && "Set New Password"}
            </DialogTitle>
            <p className="text-xs text-slate-500 leading-relaxed">
              {step === "send"
                ? "Enter your email address to receive a verification OTP code."
                : step === "verify"
                  ? "Enter the 6-digit OTP code sent to your email."
                  : "Enter your current password and set a secure new password."}
            </p>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
            {(["send", "verify", "reset"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === s
                    ? "gradient-primary text-white shadow-sm"
                    : (step === "verify" && i === 0) ||
                      (step === "reset" && i <= 1)
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500"
                    }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="h-px w-8 bg-slate-200" />}
              </div>
            ))}
            <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-slate-400">
              {step === "send"
                ? "Step 1 of 3"
                : step === "verify"
                  ? "Step 2 of 3"
                  : "Step 3 of 3"}
            </span>
          </div>

          {/* Step 1: Send OTP */}
          {step === "send" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-0.5">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-900 transition-colors duration-200" />
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@dealership.com"
                    className="h-12 pl-11 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-slate-100/30 text-slate-900 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 transition-all duration-200 placeholder:text-slate-400/60"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
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
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-xs font-semibold text-slate-500 text-center">
                OTP sent to <span className="text-slate-900 font-bold">{email}</span>
              </p>

              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                    <InputOTPSlot index={1} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                    <InputOTPSlot index={2} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                    <InputOTPSlot index={3} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                    <InputOTPSlot index={4} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                    <InputOTPSlot index={5} className="h-12 w-12 rounded-xl border border-slate-200 text-center font-bold text-lg text-slate-900 bg-slate-50" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-bold cursor-pointer border-slate-200 text-slate-700"
                  onClick={() => setStep("send")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-[1.8] h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
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
                className="text-xs text-rose-900 font-bold hover:underline w-full text-center hover:text-rose-950 bg-transparent border-0 cursor-pointer transition-colors block mt-2"
                onClick={handleSendOtp as any}
                disabled={sendingOtp}
              >
                {sendingOtp && (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                )}
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-0.5">New Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-900 transition-colors duration-200" />
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className="h-12 pl-11 pr-10 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-slate-100/30 text-slate-900 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 transition-all duration-200 placeholder:text-slate-400/60"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-0.5">Confirm New Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-900 transition-colors duration-200" />
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="h-12 pl-11 pr-10 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-slate-100/30 text-slate-900 focus-visible:ring-rose-900/15 focus-visible:border-rose-900 transition-all duration-200 placeholder:text-slate-400/60"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl gradient-primary text-white border-0 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                disabled={resettingPassword}
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password…
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
