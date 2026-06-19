import { useQuery } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useDealerDashboard(dealerId: string) {
  return useQuery({
    queryKey: ['dealer-dashboard', dealerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/dealer/dashboard/${dealerId}`, {
        headers: getAuthHeaders(),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to fetch dashboard');
      // response is direct object: { dealerName, featuredVehicles, totalLeads, totalVehicles, vehicleViews }
      return body.data ?? body;
    },
    enabled: !!dealerId,
  });
}

export function useVehicleViews(dealerId: string) {
  return useQuery({
    queryKey: ['vehicle-views', dealerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/analytics/vehicle-view/${dealerId}`, {
        headers: getAuthHeaders(),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to fetch views');
      // response is direct array: [{ month, views }]
      return Array.isArray(body) ? body : (body.data ?? []);
    },
    enabled: !!dealerId,
  });
}

export function useVehicleLeads(dealerId: string) {
  return useQuery({
    queryKey: ['vehicle-leads', dealerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/analytics/vehicle-lead/${dealerId}`, {
        headers: getAuthHeaders(),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to fetch leads');
      // response: { status, message, data: [{ month, leads, conversions }] }
      return Array.isArray(body) ? body : (body.data ?? []);
    },
    enabled: !!dealerId,
  });
}
