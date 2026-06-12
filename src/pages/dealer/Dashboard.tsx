import { Card, CardContent } from "@/components/ui/card";
import { CarFront, Star, Inbox, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { vehicleService } from "@/services/vehicleService";
import { leadService } from "@/services/leadService";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DealerDashboard() {
  const { user } = useAuth();
  const dealerId = user?.dealerId || "d1";
  const myVehicles = vehicleService.byDealer(dealerId);
  const myLeads = leadService.byDealer(dealerId);
  const featured = myVehicles.filter((v) => v.featured).length;
  const views = myVehicles.reduce((a, v) => a + v.views, 0);

  const viewData = months.slice(0, 6).map((m, i) => ({ month: m, views: 400 + i * 220 + (i % 2) * 180 }));
  const leadData = months.slice(0, 6).map((m, i) => ({ month: m, leads: 12 + i * 4 + (i % 3) * 3 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<CarFront />} label="Total Vehicles" value={myVehicles.length} />
        <Stat icon={<Star />} label="Featured" value={featured} accent />
        <Stat icon={<Inbox />} label="Total Leads" value={myLeads.length} />
        <Stat icon={<Eye />} label="Vehicle Views" value={views.toLocaleString("en-IN")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-bold text-lg mb-4">Monthly Views</h2>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={viewData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-bold text-lg mb-4">Monthly Leads</h2>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={leadData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#0F172A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display font-bold text-lg mb-4">Recent Leads</h2>
          <div className="space-y-2">
            {myLeads.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-border last:border-0 py-2.5 text-sm">
                <div><div className="font-medium">{l.customerName}</div><div className="text-xs text-muted-foreground">{l.vehicleTitle}</div></div>
                <div className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleDateString("en-IN")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`w-10 h-10 grid place-items-center rounded-xl mb-3 ${accent ? "bg-warning text-warning-foreground" : "gradient-primary text-white"}`}>{icon}</div>
        <div className="text-2xl font-black font-display">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
