import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { useAuth } from "@/contexts/AuthContext";
import { dealerService } from "@/services/dealerService";
import { toast } from "sonner";
import { useState } from "react";

export default function DealerSubscription() {
  const { user } = useAuth();
  const dealer = dealerService.get(user?.dealerId || "d1")!;
  const [current, setCurrent] = useState(dealer.subscription);
  const plans = subscriptionService.list();

  return (
    <div className="space-y-6">
      <Card><CardContent className="p-6 flex flex-wrap items-center gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Current plan</div>
          <div className="font-display font-black text-2xl">{current}</div>
        </div>
        <Badge className="bg-success/15 text-success border-0">Active · Renews 12 Jul 2026</Badge>
      </CardContent></Card>
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <Card key={p.id} className={p.highlight ? "border-accent shadow-premium relative" : ""}>
            {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-warning text-warning-foreground border-0 gap-1"><Star className="h-3 w-3 fill-current" /> Most Popular</Badge></div>}
            <CardContent className="p-6">
              <h3 className="font-display font-black text-xl">{p.name}</h3>
              <div className="text-3xl font-black font-display mt-2">₹{p.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <div className="text-xs text-muted-foreground">{p.listings} listings</div>
              <ul className="mt-4 space-y-2 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Button onClick={() => { setCurrent(p.name); dealerService.update(dealer.id, { subscription: p.name }); toast.success(`Switched to ${p.name}`); }} className={`w-full mt-5 ${p.highlight ? "gradient-primary text-white border-0" : ""}`} variant={p.highlight ? "default" : "outline"} disabled={current === p.name}>
                {current === p.name ? "Current plan" : `Switch to ${p.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
