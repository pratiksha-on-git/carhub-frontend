import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Image as ImageIcon } from "lucide-react";

const ads = [
  { id: "a1", title: "Monsoon Sale Banner", placement: "Home Hero", status: "Live", impressions: 24800, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=300&fit=crop" },
  { id: "a2", title: "Premium Dealer Spotlight", placement: "Cars Sidebar", status: "Live", impressions: 18400, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=300&fit=crop" },
  { id: "a3", title: "Diwali Festive Offer", placement: "Cars Top", status: "Paused", impressions: 12100, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=300&fit=crop" },
];

export default function AdminAdvertisements() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{ads.length} active campaigns</p><Button className="gradient-primary text-white border-0 gap-2"><Plus className="h-4 w-4" /> Create campaign</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ads.map((a) => (
          <Card key={a.id} className="overflow-hidden">
            <div className="aspect-[16/9] bg-muted"><img src={a.image} alt={a.title} className="h-full w-full object-cover" /></div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-bold">{a.title}</h3><div className="text-xs text-muted-foreground mt-0.5"><ImageIcon className="h-3 w-3 inline" /> {a.placement}</div></div>
                <Badge variant={a.status === "Live" ? "default" : "secondary"} className={a.status === "Live" ? "bg-success border-0" : ""}>{a.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-3">{a.impressions.toLocaleString("en-IN")} impressions</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
