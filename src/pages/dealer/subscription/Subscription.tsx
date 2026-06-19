
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Loader2,
  CalendarDays,
  Car,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  useGetSubscriptionPlans,
  useGetCurrentPlan,
  usePurchaseSubscription,
} from "@/hooks/dealer/useSubscription";

const PLAN_ORDER = ["BASIC", "STANDARD", "PREMIUM"];

export default function DealerSubscription() {
  const { user } = useAuth();
  const dealerId = user?.id?.toString() || "";

  const { data: plans = [], isLoading: plansLoading } =
    useGetSubscriptionPlans();

  const { data: currentPlan, isLoading: currentLoading } =
    useGetCurrentPlan(dealerId);

  const purchaseMutation = usePurchaseSubscription(dealerId);

  const activePlan = currentPlan?.plan;
  const currentMessage = currentPlan?.message ?? "";

  const handlePurchase = async (planName: string) => {
    try {
      const res = await purchaseMutation.mutateAsync(planName);

      toast.success(
        `${res.data?.subscriptionPlan ?? planName
        } plan purchased! Transaction ID: ${res.data?.transactionId ?? ""
        }`
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Purchase failed"
      );
    }
  };

  const sortedPlans = [...plans].sort(
    (a, b) =>
      PLAN_ORDER.indexOf(a.planName) -
      PLAN_ORDER.indexOf(b.planName)
  );

  const isLoading = plansLoading || currentLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan
        </p>
      </div>


      {/* Active Subscription */}


      {activePlan ? (

        <Card className="border-0 shadow-md">

          <CardContent className="p-0">

            <div className="flex flex-col lg:flex-row lg:items-center">

              {/* Plan Info */}

              <div className="flex items-center gap-4 p-6 lg:w-[35%] border-b lg:border-b-0 lg:border-r">

                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">

                  <Star className="h-7 w-7 text-primary fill-primary" />

                </div>



                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-2xl font-bold">

                      {activePlan.subscriptionPlan}

                    </h2>



                    <Badge className="bg-green-600 text-white hover:bg-green-600">

                      Active

                    </Badge>

                  </div>



                  <p className="text-sm text-muted-foreground">

                    ₹{activePlan.amount.toLocaleString("en-IN")}

                    /month

                  </p>

                </div>

              </div>



              {/* Stats */}

              <div className="grid grid-cols-3 flex-1">

                <div className="p-6 text-center border-r">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">

                    Vehicle Limit

                  </p>



                  <p className="text-3xl font-black mt-2">

                    {activePlan.vehicleLimit}

                  </p>

                </div>



                <div className="p-6 text-center border-r">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">

                    Remaining

                  </p>



                  <p

                    className={`text-3xl font-black mt-2 ${activePlan.remainingDays <= 7

                        ? "text-red-600"

                        : "text-green-600"

                      }`}

                  >

                    {activePlan.remainingDays}

                  </p>



                  <p className="text-xs text-muted-foreground">

                    Days

                  </p>

                </div>



                <div className="p-6 text-center">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">

                    Expires On

                  </p>



                  <p className="text-lg font-bold mt-2">

                    {new Date(

                      activePlan.subscriptionEndDate

                    ).toLocaleDateString("en-IN", {

                      day: "numeric",

                      month: "short",

                      year: "numeric",

                    })}

                  </p>

                </div>

              </div>

            </div>



            {activePlan.remainingDays <= 7 && (

              <div className="border-t bg-red-50 px-6 py-3">

                <p className="text-sm text-red-600 font-medium">

                  Subscription expires in{" "}

                  {activePlan.remainingDays} days.

                  Please renew your plan.

                </p>

              </div>

            )}

          </CardContent>

        </Card>

      ) : (




        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>

            <p className="text-sm text-muted-foreground">
              {currentMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid xl:grid-cols-3  md:grid-cols-2 gap-6">
        {sortedPlans.map((plan) => {
          const isPopular =
            plan.planName === "STANDARD";

          const isCurrent =
            activePlan?.subscriptionPlan ===
            plan.planName;

          const isPending =
            purchaseMutation.isPending &&
            purchaseMutation.variables ===
            plan.planName;

          return (
            <Card
              key={plan.planName}
              className={`relative transition-all duration-300 hover:shadow-xl ${isCurrent
                ? "border-2 border-green-500 shadow-lg"
                : isPopular
                  ? "border-primary shadow-lg"
                  : ""
                }`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary text-white border-0 gap-1 px-3">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="font-black text-xl">
                  {plan.planName}
                </h3>

                <div className="mt-2">
                  <span className="text-4xl font-black">
                    ₹
                    {plan.amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    /month
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-sm flex-1">
                  <li className="flex gap-2 items-center">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    Up to {plan.vehicleLimit} vehicle
                    listings
                  </li>

                  <li className="flex gap-2 items-center">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {plan.validityMonths} month
                    validity
                  </li>
                </ul>

                <Button
                  onClick={() => handlePurchase(plan.planName)}
                  disabled={isCurrent || purchaseMutation.isPending}
                  variant="default"
                  className={`w-full mt-6 ${isCurrent
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : isPopular
                      ? "gradient-primary text-white border-0"
                      : ""
                    }`}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {isCurrent ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Active Plan
                    </>
                  ) : (
                    `Get ${plan.planName}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

