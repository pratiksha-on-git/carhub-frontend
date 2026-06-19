import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Users, IndianRupee, Inbox, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAdminReports } from "@/hooks/admin/useAdminReports";

type DownloadState = "idle" | "loading" | "success" | "error";

const reports = [
  { key: "leadConversion",    title: "Lead Conversion Report",    desc: "Lead funnel and conversion analytics",                    icon: <Inbox className="h-5 w-5" /> },
  { key: "dealerActivity",    title: "Dealer Activity Report",    desc: "Monthly dealer engagement, listings and leads",           icon: <Users className="h-5 w-5" /> },
  { key: "revenueByPlan",     title: "Revenue by Plan",           desc: "Subscription revenue split by plan type",                 icon: <IndianRupee className="h-5 w-5" /> },
  { key: "topCities",         title: "Top Cities Report",         desc: "Top performing cities by leads and listings",             icon: <MapPin className="h-5 w-5" /> },
  { key: "vehicleInventory",  title: "Vehicle Inventory Report",  desc: "Full vehicle inventory breakdown by status and type",     icon: <TrendingUp className="h-5 w-5" /> },
] as const;

type ReportKey = typeof reports[number]["key"];

export default function AdminReports() {
  const [states, setStates] = useState<Record<ReportKey, DownloadState>>({
    leadConversion: "idle", dealerActivity: "idle", revenueByPlan: "idle",
    topCities: "idle", vehicleInventory: "idle",
  });

  const {
    downloadLeadConversion,
    downloadDealerActivity,
    downloadRevenueByPlan,
    downloadTopCities,
    downloadVehicleInventory,
  } = useAdminReports();

  const downloaders: Record<ReportKey, () => Promise<void>> = {
    leadConversion: downloadLeadConversion,
    dealerActivity: downloadDealerActivity,
    revenueByPlan: downloadRevenueByPlan,
    topCities: downloadTopCities,
    vehicleInventory: downloadVehicleInventory,
  };

  const handleDownload = async (key: ReportKey) => {
    setStates((s) => ({ ...s, [key]: "loading" }));
    try {
      await downloaders[key]();
      setStates((s) => ({ ...s, [key]: "success" }));
    } catch {
      setStates((s) => ({ ...s, [key]: "error" }));
    } finally {
      setTimeout(() => setStates((s) => ({ ...s, [key]: "idle" })), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Download detailed reports for analysis</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {reports.map((r) => {
          const state = states[r.key];
          return (
            <Card key={r.key}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-white shrink-0">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2"
                      onClick={() => handleDownload(r.key)}
                      disabled={state === "loading"}
                    >
                      {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {state === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {state === "error"   && <AlertCircle className="h-4 w-4 text-destructive" />}
                      {state === "idle"    && <Download className="h-4 w-4" />}
                      {state === "loading" ? "Downloading..." : state === "success" ? "Downloaded!" : state === "error" ? "Failed" : "Download"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
