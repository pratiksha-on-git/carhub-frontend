import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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

export function useDeleteVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (vehicleId: string) => {
      try {
        const { data: body } = await apiClient.delete(`/api/vehicle/delete/${vehicleId}`);
        return body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleError(
            body?.message ?? "Failed to delete vehicle",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Vehicle deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to remove vehicle");
    },
  });
}
