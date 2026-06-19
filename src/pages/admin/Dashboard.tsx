import { useQueries } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CarFront, Inbox, Clock } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";

const months = [
  { m: "Jan", regs: 12, leads: 240, rev: 320000 },
  { m: "Feb", regs: 18, leads: 320, rev: 412000 },
  { m: "Mar", regs: 22, leads: 410, rev: 520000 },
  { m: "Apr", regs: 28, leads: 520, rev: 640000 },
  { m: "May", regs: 34, leads: 680, rev: 780000 },
  { m: "Jun", regs: 41, leads: 820, rev: 920000 },
];

export default function AdminDashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ["admin-count-dealers"],  queryFn: async () => (await apiClient.get("/api/admin/dealer/count")).data },
      { queryKey: ["admin-count-vehicles"], queryFn: async () => (await apiClient.get("/api/admin/vehicle/count")).data },
      { queryKey: ["admin-count-pending"],  queryFn: async () => (await apiClient.get("/api/admin/pending/count")).data },
      { queryKey: ["admin-count-leads"],    queryFn: async () => (await apiClient.get("/api/admin/customer-lead/count")).data },
    ],
  });

  const [dealers, vehicles, pending, leads] = results;

  const stats = [
    { icon: <Users className="h-5 w-5" />,    label: "Total Dealers",  value: dealers.data?.totalDealers,         loading: dealers.isLoading },
    { icon: <CarFront className="h-5 w-5" />,  label: "Total Vehicles", value: vehicles.data?.totalVehicles,       loading: vehicles.isLoading },
    { icon: <Clock className="h-5 w-5" />,     label: "Pending",        value: pending.data?.totalPendingDealers,  loading: pending.isLoading, accent: true },
    { icon: <Inbox className="h-5 w-5" />,     label: "Total Leads",    value: leads.data?.totalCustomerLeads,     loading: leads.isLoading },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 grid place-items-center rounded-xl mb-3 ${s.accent ? "bg-warning text-warning-foreground" : "gradient-primary text-white"}`}>
                {s.icon}
              </div>
              {s.loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-2xl font-black font-display">{s.value ?? "—"}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card><CardContent className="p-6">
          <h2 className="font-display font-bold text-lg mb-3">Dealer Registrations</h2>
          <div className="h-64"><ResponsiveContainer><BarChart data={months}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="regs" fill="#2563EB" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <h2 className="font-display font-bold text-lg mb-3">Lead Analytics</h2>
          <div className="h-64"><ResponsiveContainer><LineChart data={months}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line dataKey="leads" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <h2 className="font-display font-bold text-lg mb-3">Revenue (₹)</h2>
          <div className="h-64"><ResponsiveContainer><AreaChart data={months}><defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F172A" stopOpacity={0.45} /><stop offset="100%" stopColor="#0F172A" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Area dataKey="rev" stroke="#0F172A" fill="url(#ar)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
        </CardContent></Card>
      </div>
    </div>
  );
}
