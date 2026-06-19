import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '@/lib/apiClient';

export class VehicleError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VehicleError";
    this.status = status;
  }
}

export function useUpdateVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { vehicleId: number; vehicleData: any }>({
    mutationFn: async ({ vehicleId, vehicleData }) => {
      try {
        const { data: body } = await apiClient.put(
          `/api/vehicle/update/${vehicleId}`,
          vehicleData,
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleError(
            body?.message ?? "Failed to update vehicle",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
    },
  });
}
