import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { clearCustomer } from "@/hooks/public/useCustomerAuth";
import { Clock } from "lucide-react";

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const [expiredUserType, setExpiredUserType] = useState<"admin" | "dealer" | "customer" | null>(null);
  const { logout: logoutAdmin } = useAdminAuth();
  const { logout: logoutDealer } = useDealerAuth();

  useEffect(() => {
    const handleExpired = async (e: Event) => {
      const customEvent = e as CustomEvent<{ role: string }>;
      const role = customEvent.detail?.role;

      // Prevent duplicate modal triggers
      if (open) return;

      // Clear local storage and state for the expired session
      if (role === "admin") {
        setExpiredUserType("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        try {
          await logoutAdmin();
        } catch {
          // ignore
        }
      } else {
        setExpiredUserType("dealer");
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerData");
        try {
          await logoutDealer();
        } catch {
          // ignore
        }
      }

      setOpen(true);
    };

    const handleCustomerExpired = () => {
      if (open) return;
      setExpiredUserType("customer");
      clearCustomer();
      setOpen(true);
    };

    window.addEventListener("auth-session-expired", handleExpired);
    window.addEventListener("customer-session-expired", handleCustomerExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleExpired);
      window.removeEventListener("customer-session-expired", handleCustomerExpired);
    };
  }, [open, logoutAdmin, logoutDealer]);

  const handleConfirm = () => {
    setOpen(false);
    if (expiredUserType === "customer") {
      window.location.href = "/";
    } else {
      window.location.href = "/auth/login";
    }
  };

  const getModalDescription = () => {
    if (expiredUserType === "customer") {
      return "Your customer session has expired. Please login again to continue.";
    }
    return "Your session has expired. Please login again to continue.";
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md rounded-3xl border border-slate-100 p-6 sm:p-8 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          
          {/* Animated clock circle icon indicator */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4 border border-rose-100/50 shadow-inner">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>

          <AlertDialogTitle className="font-display text-2xl font-black text-slate-900 tracking-tight">
            Session Expired
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-slate-500 text-sm leading-relaxed mt-2.5 max-w-xs">
            {getModalDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 flex justify-center sm:justify-center w-full">
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full h-11 font-bold text-white rounded-xl hover:opacity-90 transition-all duration-200 cursor-pointer shadow-lg shadow-rose-500/10 uppercase text-xs tracking-wider border-0"
            style={{ background: "linear-gradient(135deg, #e11d48 0%, #0f172a 100%)" }}
          >
            Acknowledge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
