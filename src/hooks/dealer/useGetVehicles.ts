import { useQuery } from '@tanstack/react-query';
import type { Vehicle } from '@/types';
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

export function useGetVehicles(dealerId: string) {
  return useQuery<Vehicle[], Error>({
    queryKey: ['vehicles', dealerId],
    queryFn: async () => {
      if (!dealerId) return [];
      const response = await fetch(`${API_BASE_URL}/api/vehicle/dealer/${dealerId}`, {
        headers: getAuthHeaders(),
      });
      
      let body: ApiResponse<Vehicle[]> | any = null;
      try {
        body = await response.json();
      } catch {
        throw new VehicleError("Server returned an invalid response.", response.status);
      }

      if (!response.ok) {
        throw new VehicleError(
          body?.message ?? "Failed to fetch vehicles",
          body?.status ?? response.status,
        );
      }
      
      const data = body?.data !== undefined ? body.data : body;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!dealerId,
  });
}
