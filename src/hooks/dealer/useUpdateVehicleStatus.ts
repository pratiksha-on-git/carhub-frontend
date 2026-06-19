import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '@/lib/apiClient';

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
      try {
        await apiClient.patch(`/api/vehicle/status/${vehicleId}`, { status });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleStatusError(
            body?.message ?? "Failed to update vehicle status",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
    },
  });
}
