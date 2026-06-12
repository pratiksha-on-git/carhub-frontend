import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const monthly = [
  { m: "Jan", views: 1240, leads: 18 }, { m: "Feb", views: 1480, leads: 22 },
  { m: "Mar", views: 1820, leads: 28 }, { m: "Apr", views: 2100, leads: 34 },
  { m: "May", views: 2380, leads: 41 }, { m: "Jun", views: 2740, leads: 48 },
];
const sources = [
  { name: "Featured", value: 42, fill: "#F59E0B" },
  { name: "Search", value: 35, fill: "#2563EB" },
  { name: "Brand Page", value: 15, fill: "#16A34A" },
  { name: "Direct", value: 8, fill: "#0F172A" },
];

export default function DealerAnalytics() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card><CardContent className="p-6">
        <h2 className="font-display font-bold text-lg mb-3">Views & Leads</h2>
        <div className="h-72"><ResponsiveContainer>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
            <Area dataKey="views" stroke="#2563EB" fill="url(#g1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer></div>
      </CardContent></Card>
      <Card><CardContent className="p-6">
        <h2 className="font-display font-bold text-lg mb-3">Lead Sources</h2>
        <div className="h-72"><ResponsiveContainer>
          <PieChart><Pie data={sources} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2}>
            {sources.map((s, i) => <Cell key={i} fill={s.fill} />)}
          </Pie><Tooltip /><Legend /></PieChart>
        </ResponsiveContainer></div>
      </CardContent></Card>
    </div>
  );
}
