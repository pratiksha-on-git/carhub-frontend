import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UpdateProfilePayload {
  businessName: string;
  ownerName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
}

export function useUpdateDealerProfile(dealerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await fetch(`${API_BASE_URL}/api/dealer/update-profile/${dealerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to update profile');
      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-profile', dealerId] });
    },
  });
}
