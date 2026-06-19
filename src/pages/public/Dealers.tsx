import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/shared/SEO";
import { dealerService } from "@/services/dealerService";
import { useState, useMemo } from "react";

export default function Dealers() {
  const dealers = useMemo(() => dealerService.approved(), []);
  const [q, setQ] = useState("");
  const filtered = dealers.filter((d) =>
    !q || d.businessName.toLowerCase().includes(q.toLowerCase()) || d.city.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <>
      <SEO title="Verified Used Car Dealers in India — AutoHub India" description="Browse 500+ KYC-verified used car dealers across India. Filter by city, contact directly, view inventory." />
      <div className="gradient-premium text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-black">Verified Dealers</h1>
          <p className="text-white/80 mt-2 max-w-xl">Browse 500+ KYC-verified used-car dealers across India.</p>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or city…" className="mt-5 max-w-md bg-white text-foreground" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="overflow-hidden hover:shadow-premium transition-shadow">
                <div className="aspect-[16/9] bg-muted">
                  <img src={d.showroomImage} alt={d.businessName} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <img src={d.logo} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0 -mt-10 border-4 border-card shadow-card" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold truncate">{d.businessName}</h3>
                        <BadgeCheck className="h-4 w-4 text-success shrink-0" />
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {d.city}, {d.state}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {d.rating}</span>
                    <span className="text-muted-foreground">·</span>
                    <span>{d.totalListings} listings</span>
                    <Badge variant="secondary" className="ml-auto">{d.subscription}</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="flex-1 gradient-primary text-white border-0">
                      <Link to={`/cars?city=${d.city}`}>View inventory</Link>
                    </Button>
                    <a href={`tel:${d.mobile}`}>
                      <Button size="sm" variant="outline"><Phone className="h-4 w-4" /></Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
