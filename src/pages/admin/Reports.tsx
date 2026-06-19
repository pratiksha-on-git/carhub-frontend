import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, IndianRupee, Inbox } from "lucide-react";

const reports = [
  { title: "Dealer Activity Report", desc: "Monthly dealer engagement, listings, leads", icon: <Users className="h-5 w-5" /> },
  { title: "Revenue Report", desc: "Subscription revenue split by plan & city", icon: <IndianRupee className="h-5 w-5" /> },
  { title: "Lead Conversion Report", desc: "Lead funnel and conversion analytics", icon: <Inbox className="h-5 w-5" /> },
  { title: "Marketplace Trends", desc: "Top brands, models, cities by demand", icon: <TrendingUp className="h-5 w-5" /> },
];

export default function AdminReports() {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {reports.map((r) => (
        <Card key={r.title}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-white">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                <Button variant="outline" size="sm" className="mt-3 gap-2"><Download className="h-4 w-4" /> Download CSV</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
