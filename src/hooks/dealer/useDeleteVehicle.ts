import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthHeaders } from '@/lib/authHeaders';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export class VehicleError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VehicleError";
    this.status = status;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useDeleteVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (vehicleId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/delete/${vehicleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      let body: ApiResponse<any> | any = null;
      try {
        body = await response.json();
      } catch {
        if (response.ok) return { message: "Vehicle Delete Successfully" };
        throw new VehicleError("Server returned an invalid response.", response.status);
      }

      if (!response.ok) {
        throw new VehicleError(
          body?.message ?? "Failed to delete vehicle",
          body?.status ?? response.status,
        );
      }

      return body;
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Vehicle Delete Successfully");
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to remove vehicle");
    }
  });
}
