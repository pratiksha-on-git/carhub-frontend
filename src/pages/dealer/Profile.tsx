import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useGetDealerProfile } from "@/hooks/dealer/useGetDealerProfile";
import { useUpdateDealerProfile } from "@/hooks/dealer/useUpdateDealerProfile";
import { useSendOtp, useVerifyOtp, useResetPassword } from "@/hooks/dealer/useChangePassword";

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

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || "");
      setOwnerName(profile.ownerName || "");
      setMobile(profile.mobile || "");
      setWhatsapp(profile.whatsapp || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setState(profile.state || "");
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ businessName, ownerName, mobile, whatsapp, address, city, state });
      updateUserFields({ businessName, ownerName });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  // Change password flow
  const [pwModal, setPwModal] = useState(false);
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  const openPasswordModal = () => {
    setStep("send");
    setEmail(profile?.email || "");
    setOtp("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwModal(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtpMutation.mutateAsync(email);
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      toast.success("OTP verified");
      setStep("reset");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync({ email, oldPassword, newPassword });
      toast.success("Password changed successfully");
      setPwModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your business information</p>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-6 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-4">
              {profile?.dealerLogo ? (
                <img src={profile.dealerLogo.trim()} alt="logo" className="h-20 w-20 rounded-3xl object-cover" />
              ) : (
                <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {businessName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold">{businessName}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={openPasswordModal}>
              Change Password
            </Button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-2 rounded-xl h-12" required />
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="mt-2 rounded-xl h-12" required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-2 rounded-xl h-12" required />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-2 rounded-xl h-12" />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 rounded-xl h-12" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>City</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 rounded-xl h-12" />
              </div>
              <div>
                <Label>State</Label>
                <Input value={state} onChange={(e) => setState(e.target.value)} className="mt-2 rounded-xl h-12" />
              </div>
            </div>

            <Button type="submit" size="lg" className="rounded-xl px-8 gradient-primary text-white hover:opacity-90" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>

        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog open={pwModal} onOpenChange={setPwModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "send" && "Change Password"}
              {step === "verify" && "Verify OTP"}
              {step === "reset" && "Set New Password"}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-2">
            {(["send", "verify", "reset"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s ? "gradient-primary text-white" :
                  (step === "verify" && i === 0) || (step === "reset" && i <= 1) ? "bg-green-100 text-green-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className="h-px w-8 bg-muted" />}
              </div>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
              {step === "send" ? "Enter email" : step === "verify" ? "Enter OTP" : "Set password"}
            </span>
          </div>

          {/* Step 1: Send OTP */}
          {step === "send" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 rounded-xl" required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-white border-0 rounded-xl" disabled={sendOtpMutation.isPending}>
                {sendOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-muted-foreground">OTP sent to <span className="font-medium text-foreground">{email}</span></p>
              <div>
                <Label>Enter OTP</Label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="mt-1 rounded-xl tracking-widest text-center text-lg" required />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("send")}>Back</Button>
                <Button type="submit" className="flex-1 gradient-primary text-white border-0 rounded-xl" disabled={verifyOtpMutation.isPending}>
                  {verifyOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
              </div>
              <button type="button" className="text-xs text-primary underline w-full text-center" onClick={handleSendOtp as any} disabled={sendOtpMutation.isPending}>
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" className="mt-1 rounded-xl" required />
              </div>
              <div>
                <Label>New Password</Label>
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="mt-1 rounded-xl" required />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="mt-1 rounded-xl" required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-white border-0 rounded-xl" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
