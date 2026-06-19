import { useQuery } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useGetDealerProfile(dealerId: string) {
  return useQuery({
    queryKey: ['dealer-profile', dealerId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/dealer/dealer-profile/${dealerId}`, {
        headers: getAuthHeaders(),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to fetch profile');
      return body.data;
    },
    enabled: !!dealerId,
  });
}
