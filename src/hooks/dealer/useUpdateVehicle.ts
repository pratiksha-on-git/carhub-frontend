import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useUpdateVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { vehicleId: number; vehicleData: any }>({
    mutationFn: async ({ vehicleId, vehicleData }) => {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/update/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', ...getAuthHeaders(),
        },
        body: JSON.stringify(vehicleData),
      });

      let body: ApiResponse<any> | any = null;
      try {
        body = await response.json();
      } catch {
        throw new VehicleError("Server returned an invalid response.", response.status);
      }

      if (!response.ok) {
        throw new VehicleError(
          body?.message ?? "Failed to update vehicle",
          body?.status ?? response.status,
        );
      }

      return body?.data !== undefined ? body.data : body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
    },
  });
}
