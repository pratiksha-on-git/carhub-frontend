import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerLogin, useCustomerRegister, type CustomerUser } from "@/hooks/public/useCustomerAuth";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (user: CustomerUser) => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [registerDone, setRegisterDone] = useState(false);

  const handleRegisterSuccess = () => {
    setRegisterDone(true);
    setTab("login");
  };

  // reset state when modal closes
  const handleOpenChange = (v: boolean) => {
    if (!v) setRegisterDone(false);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Welcome to AutoHub India</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex rounded-lg bg-muted p-1 gap-1">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "login" ? "bg-background shadow text-foreground" : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("register"); setRegisterDone(false); }}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "register" ? "bg-background shadow text-foreground" : "text-muted-foreground"
            }`}
          >
            Register
          </button>
        </div>

        {/* Success banner after registration */}
        {registerDone && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700">
            ✅ Registered successfully! Please login to continue.
          </div>
        )}

        {tab === "login" ? (
          <LoginForm onSuccess={(u) => { onSuccess(u); handleOpenChange(false); }} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (u: CustomerUser) => void }) {
  const { isLoggingIn, login } = useCustomerLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const user = await login({ email, password });
      toast.success("Logged in successfully!");
      onSuccess(user);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" required />
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <Button type="submit" className="w-full gradient-primary text-white border-0" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in…" : "Login"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { isSubmitting, register } = useCustomerRegister();
  const [form, setForm] = useState({ customerName: "", mobile: "", customerCity: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      // ✅ No data stored — just notify parent to switch to login tab
      onSuccess();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label>Full Name</Label>
        <Input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Aman Verma" className="mt-1" required />
      </div>
      <div>
        <Label>Mobile</Label>
        <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="+91 98xxx xxxxx" className="mt-1" required />
      </div>
      <div>
        <Label>City</Label>
        <Input value={form.customerCity} onChange={(e) => set("customerCity", e.target.value)} placeholder="Mumbai" className="mt-1" required />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className="mt-1" required />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" className="mt-1" required />
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <Button type="submit" className="w-full gradient-primary text-white border-0" disabled={isSubmitting}>
        {isSubmitting ? "Registering…" : "Register"}
      </Button>
    </form>
  );
}
