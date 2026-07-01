import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CarFront,
  Inbox,
  Clock,
  IndianRupee,
  TrendingUp,
  InboxIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  useMonthlyDealerRegistrations,
  useMonthlyLeads,
  useMonthlyRevenue,
  useAdminDealerCount,
  useAdminVehicleCount,
  useAdminPendingCount,
  useAdminLeadCount,
  useAdminTotalRevenue,
} from "@/hooks/admin/useAdminDashboard";
import { Button } from "@/components/ui/button";

// ── Chart skeleton ─────────────────────────────────────────────────────────────
function ChartSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <div className={`${height} flex items-end gap-1 px-2 pb-2`}>
      {[40, 60, 45, 80, 55, 90, 50, 70, 65, 85, 48, 75].map((h, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-sm"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ── Shared chart axis/grid props — always show all 12 months ───────────────────
const xAxisProps = {
  dataKey: "month",
  fontSize: 11,
  interval: 0 as const,
  tick: { fill: "#6b7280" },
  axisLine: { stroke: "#e5e7eb" },
  tickLine: false,
} as const;

const yAxisProps = {
  fontSize: 11,
  allowDecimals: false,
  tick: { fill: "#6b7280" },
  axisLine: false,
  tickLine: false,
  width: 40,
} as const;

const gridProps = {
  strokeDasharray: "3 3",
  stroke: "#f0f0f0",
  vertical: false,
} as const;

export default function AdminDashboard() {
  // ── Stat count hooks ──────────────────────────────────────────────────────────
  const { data: dealersData, isLoading: loadingDealers } =
    useAdminDealerCount();
  const { data: vehiclesData, isLoading: loadingVehicles } =
    useAdminVehicleCount();
  const { data: pendingData, isLoading: loadingPending } =
    useAdminPendingCount();
  const { data: leadsData, isLoading: loadingLeads } = useAdminLeadCount();
  const { data: revenueData, isLoading: loadingRevenue } =
    useAdminTotalRevenue();

  // ── Chart data hooks ──────────────────────────────────────────────────────────
  const { data: dealerRegs, isLoading: loadingDealerRegs } =
    useMonthlyDealerRegistrations();
  const { data: monthLeads, isLoading: loadingMonthLeads } = useMonthlyLeads();
  const { data: monthRev, isLoading: loadingMonthRev } = useMonthlyRevenue();

  const stats = [
    {
      icon: <Users className="h-5 w-5" />,
      label: "Total Dealers",
      value: dealersData?.totalDealers,
      loading: loadingDealers,
      yellow: true
    },
    {
      icon: <CarFront className="h-5 w-5" />,
      label: "Total Vehicles",
      value: vehiclesData?.totalVehicles,
      loading: loadingVehicles,
      blue: true
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Pending Dealer",
      value: pendingData?.totalPendingDealers,
      loading: loadingPending,
      accent: true,
    },
    {
      icon: <Inbox className="h-5 w-5" />,
      label: "Total Leads",
      value: leadsData?.totalCustomerLeads,
      loading: loadingLeads,
      purple: true,
    },
    {
      icon: <IndianRupee className="h-5 w-5" />,
      label: "Total Revenue",
      value:
        revenueData?.totalRevenue != null
          ? `₹${revenueData.totalRevenue.toLocaleString("en-IN")}`
          : undefined,
      loading: loadingRevenue,
      green: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat cards ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div
                className={`w-10 h-10 grid place-items-center rounded-xl mb-3 ${s.accent
                  ? "bg-rose-500 text-white"
                  : s.green
                    ? "bg-emerald-500 text-white"
                    : s.purple
                      ? "bg-purple-500 text-white"
                      : s.blue
                        ? "bg-blue-500 text-white"
                        : s.yellow
                          ? "bg-yellow-500 text-white"
                          : "gradient-primary text-white"
                  }`}
              >
                {s.icon}
              </div>
              {s.loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <div className="text-2xl font-black font-display truncate">
                  {s.value ?? "—"}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Top row: Dealer Registrations (wider) + Lead Analytics ────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Monthly Dealer Registrations */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 mb-10">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">
                  Monthly Dealer Registrations
                </h2>
              </div>
            </div>
            {loadingDealerRegs ? (
              <ChartSkeleton height="h-56" />
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dealerRegs}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip
                      cursor={{ fill: "#eff6ff" }}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [v, "Dealers"]}
                    />
                    <Bar
                      dataKey="dealer"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Analytics */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-10">
              <InboxIcon className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">Lead Analytics</h2>
            </div>
            {loadingMonthLeads ? (
              <ChartSkeleton height="h-56" />
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthLeads}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [v, "Leads"]}
                    />
                    <Line
                      dataKey="leads"
                      stroke="#1e293b"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: "#fff",
                        stroke: "#1e293b",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom row: Revenue Analytics (full-width green bar chart) ─────────── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-10">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Revenue Analytics</h2>
          </div>
          {loadingMonthRev ? (
            <ChartSkeleton height="h-56" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthRev}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid {...gridProps} />
                  <XAxis {...xAxisProps} />
                  <YAxis
                    {...yAxisProps}
                    width={60}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#f0fdf4" }}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [
                      `₹${v.toLocaleString("en-IN")}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
