import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class VehicleStatusError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VehicleStatusError";
    this.status = status;
  }
}

export function useUpdateVehicleStatus(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { vehicleId: number; status: string }>({
    mutationFn: async ({ vehicleId, status }) => {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/status/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });

      let body: any = null;
      try { body = await response.json(); } catch { /* ignore */ }

      if (!response.ok) {
        throw new VehicleStatusError(
          body?.message ?? "Failed to update vehicle status",
          body?.status ?? response.status,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
    },
  });
}
