import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

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
      const { data: body } = await apiClient.put(
        `/api/dealer/update-profile/${dealerId}`,
        payload,
      );
      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-profile', dealerId] });
    },
  });
}
