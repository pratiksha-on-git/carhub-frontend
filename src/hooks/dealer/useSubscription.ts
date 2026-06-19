import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SubscriptionPlan {
  planName: string;
  amount: number;
  vehicleLimit: number;
  validityMonths: number;
}

export interface CurrentPlan {
  dealerId: number;
  subscriptionPlan: string;
  amount: number;
  vehicleLimit: number;
  validityMonths: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  remainingDays: number;
}

export function useGetSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/dealer/subscription/plans`, {
        headers: getAuthHeaders(), // No Content-Type: browser sets multipart/form-data boundary automatically
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to fetch plans');
      return body.data;
    },
  });
}

export function useGetCurrentPlan(dealerId: string) {
  return useQuery<{ plan: CurrentPlan | null; message: string }>({
    queryKey: ['current-plan', dealerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/dealer/current-plan/${dealerId}`, {
        headers: getAuthHeaders(), // No Content-Type: browser sets multipart/form-data boundary automatically
      });
      const body = await res.json();
      if (!res.ok || body?.status === 500) return { plan: null, message: body?.message ?? 'No active plan' };
      return { plan: body.data, message: body?.message ?? '' };
    },
    enabled: !!dealerId,
  });
}

export function usePurchaseSubscription(dealerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionPlan: string) => {
      const res = await fetch(`${API_BASE_URL}/api/payment/subscription/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ dealerId: Number(dealerId), subscriptionPlan }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Purchase failed');
      return body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-plan', dealerId] });
    },
  });
}
