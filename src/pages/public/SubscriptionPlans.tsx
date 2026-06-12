import { Check, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/shared/SEO";
import { subscriptionService } from "@/services/subscriptionService";
import { Link } from "react-router-dom";

export default function SubscriptionPlans() {
  const plans = subscriptionService.list();
  return (
    <>
      <SEO title="Dealer Subscription Plans — AutoHub India" description="Choose from Basic, Standard or Premium dealer subscriptions. List more vehicles, get more leads." />
      <div className="gradient-premium text-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-black">Plans built for dealers</h1>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">Start with what fits your inventory. Upgrade as you grow. Cancel anytime.</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className={p.highlight ? "border-accent shadow-premium scale-[1.02] relative" : ""}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-warning text-warning-foreground border-0"><Star className="h-3 w-3 fill-current" /> Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-7">
                <h3 className="font-display font-black text-2xl">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{p.listings} listings</div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full mt-7 ${p.highlight ? "gradient-primary text-white border-0 hover:opacity-90" : ""}`} variant={p.highlight ? "default" : "outline"}>
                  <Link to="/auth/register">Choose {p.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">All plans include verified dealer badge, secure payments and dedicated support.</p>
      </div>
    </>
  );
}
