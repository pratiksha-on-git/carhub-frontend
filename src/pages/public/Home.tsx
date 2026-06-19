import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BadgeCheck, ShieldCheck, Zap, MessageSquare, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleCard } from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { vehicleService } from "@/services/vehicleService";
import { dealerService } from "@/services/dealerService";
import { BRANDS, CITIES } from "@/data/vehicles";
import { BUDGET_BANDS, QUICK_BRANDS } from "@/utils/constants";
import { useState } from "react";

const stats = [
  { label: "Verified Dealers", value: "500+" },
  { label: "Vehicles Listed", value: "25,000+" },
  { label: "Cities Covered", value: "150+" },
  { label: "Monthly Visitors", value: "50,000+" },
];

const why = [
  { icon: BadgeCheck, title: "Verified Dealers", text: "Every dealer is KYC-verified and inspected before going live." },
  { icon: ShieldCheck, title: "Trusted Listings", text: "Inventory checked for authenticity, ownership and condition." },
  { icon: MessageSquare, title: "Direct Dealer Contact", text: "No middlemen. Talk to dealers directly via call or WhatsApp." },
  { icon: Zap, title: "Fast Lead Delivery", text: "Dealers receive your enquiry in real-time for faster response." },
];

const testimonials = [
  { name: "Rohit Mehra", role: "Buyer · Pune", text: "Found a certified 2022 Creta in 3 days. Dealer was responsive, paperwork was clean." },
  { name: "Mumbai Motors", role: "Verified Dealer", text: "AutoHub doubled our lead flow in the first month. The premium plan is well worth it." },
  { name: "Priya Nair", role: "Buyer · Bangalore", text: "Loved the transparency — verified badges and direct dealer contact saved me hours." },
];

export default function Home() {
  const featured = vehicleService.featured().slice(0, 8);
  const latest = vehicleService.list().slice(0, 12);
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (city) params.set("city", city);
    if (budget) params.set("budget", budget);
    if (q) params.set("q", q);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <>
      <SEO title="AutoHub India — Verified Used Cars from Trusted Dealers" description="Browse thousands of verified used cars from 500+ trusted dealers across 150+ Indian cities. Direct dealer contact, no middlemen." />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-primary text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.5), transparent 40%), radial-gradient(circle at 80% 60%, rgba(37,99,235,0.4), transparent 50%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium mb-5">
              <BadgeCheck className="h-3.5 w-3.5" /> India's #1 verified used-car marketplace
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
              India's Trusted Used Car<br />Dealer Marketplace
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl">
              Browse thousands of verified used cars from trusted dealers across India. Direct dealer contact. Real prices. No middlemen.
            </p>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 bg-card text-foreground rounded-2xl shadow-premium p-3 md:p-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2"
          >
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>{BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Model (e.g. Creta)" className="h-12" />
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-12"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Budget" /></SelectTrigger>
              <SelectContent>{BUDGET_BANDS.map((b) => <SelectItem key={b.label} value={b.label}>{b.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="submit" size="lg" className="h-12 gradient-primary text-white border-0 hover:opacity-90 gap-2">
              <Search className="h-4 w-4" /> Search
            </Button>
          </motion.form>

          <div className="mt-6 flex flex-wrap gap-2">
            {QUICK_BRANDS.map((b) => (
              <Link key={b} to={`/cars?brand=${encodeURIComponent(b)}`} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition-colors">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-black font-display text-gradient-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <Section title="Featured Vehicles" subtitle="Hand-picked premium listings from our top dealers" link="/cars">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      </Section>

      {/* Browse by brand */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse by Brand" subtitle="Find your favourite make from India's leading manufacturers" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
            {QUICK_BRANDS.map((b) => (
              <Link key={b} to={`/cars?brand=${encodeURIComponent(b)}`}>
                <Card className="hover:shadow-premium hover:border-accent/50 transition-all hover:-translate-y-0.5">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl gradient-premium grid place-items-center text-white font-display font-black">
                      {b[0]}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{b}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <Section title="Latest Listings" subtitle="Fresh inventory updated daily" link="/cars">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latest.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      </Section>

      {/* Budget */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse by Budget" subtitle="Pick a price range that fits you" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {BUDGET_BANDS.map((b) => (
              <Link key={b.label} to={`/cars?budget=${encodeURIComponent(b.label)}`}>
                <Card className="hover:shadow-premium hover:border-accent/50 transition-all hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Cars</div>
                    <div className="font-display font-bold text-lg mt-1">{b.label}</div>
                    <div className="text-xs text-accent mt-2 flex items-center gap-1">Explore <ArrowRight className="h-3 w-3" /></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <Section title="Why AutoHub India" subtitle="Built for buyers. Loved by dealers.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {why.map((w) => (
            <Card key={w.title} className="border-border/60">
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl gradient-primary grid place-items-center text-white mb-4">
                  <w.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base mb-1">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>



      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl gradient-premium text-white p-8 md:p-12 text-center shadow-premium">
            <h2 className="font-display text-3xl md:text-4xl font-black">Are you a used-car dealer?</h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">List your inventory on AutoHub India and reach 50,000+ buyers every month. Start free, upgrade as you grow.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
                <Link to="/auth/register">Register as Dealer</Link>
              </Button>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle?: string; link?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-black">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {link && <Link to={link} className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>}
    </div>
  );
}

function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={title} subtitle={subtitle} link={link} />
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
