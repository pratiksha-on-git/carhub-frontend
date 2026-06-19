import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CarFront, Star, Inbox, Eye, TrendingUp, RefreshCw } from "lucide-react";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { useVehicleViews, useVehicleLeads, useDealerDashboard } from "@/hooks/dealer/useDealerDashboard";

export default function DealerDashboard() {
  const { user } = useDealerAuth();
  const dealerId = user?.id?.toString() || "";

  const { data: dash, isLoading: dashLoading, refetch: refetchDash, isRefetching: dashRefetching } = useDealerDashboard(dealerId);
  const { data: viewsData = [], isLoading: viewsLoading, refetch: refetchViews, isRefetching: viewsRefetching } = useVehicleViews(dealerId);
  const { data: leadsData = [], isLoading: leadsLoading, refetch: refetchLeads, isRefetching: leadsRefetching } = useVehicleLeads(dealerId);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {dash?.dealerName ?? user?.name}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent></Card>
          ))
        ) : (
          <>
            <Stat icon={<CarFront />} label="Total Vehicles" value={dash?.totalVehicles ?? 0} />
            <Stat icon={<Star />} label="Featured" value={dash?.featuredVehicles ?? 0} accent />
            <Stat icon={<Inbox />} label="Total Leads" value={dash?.totalLeads ?? 0} />
            <Stat icon={<Eye />} label="Vehicle Views" value={(dash?.vehicleViews ?? 0).toLocaleString("en-IN")} />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-2  sm:grid-cols-1 gap-5">

        {/* Views Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Monthly Views</h2>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => refetchViews()} disabled={viewsRefetching}>
                <RefreshCw className={`h-3.5 w-3.5 ${viewsRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {viewsLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Monthly Leads & Conversions</h2>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => refetchLeads()} disabled={leadsRefetching}>
                <RefreshCw className={`h-3.5 w-3.5 ${leadsRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {leadsLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={leadsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="leads" name="Leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

   
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`w-10 h-10 grid place-items-center rounded-xl mb-3 ${accent ? "bg-amber-100 text-amber-600" : "gradient-primary text-white"}`}>
          {icon}
        </div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
