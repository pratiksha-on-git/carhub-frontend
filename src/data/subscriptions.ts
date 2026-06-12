import type { SubscriptionPlan } from "@/types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 999,
    listings: 20,
    featured: false,
    features: ["20 active listings", "Standard placement", "Lead notifications via email", "Basic analytics dashboard", "Email support"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 2999,
    listings: 100,
    featured: false,
    highlight: false,
    features: ["100 active listings", "Higher search placement", "WhatsApp + email lead alerts", "Advanced analytics", "Priority email support", "Verified dealer badge"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 4999,
    listings: "Unlimited",
    featured: true,
    highlight: true,
    features: ["Unlimited listings", "Featured placement on home & search", "Instant WhatsApp lead alerts", "Full analytics suite", "Dedicated account manager", "Verified + Premium badges", "Homepage banner rotation"],
  },
];