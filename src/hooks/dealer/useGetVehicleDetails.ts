import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Vehicle } from '@/types';
import apiClient from '@/lib/apiClient';

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

export function useGetVehicleDetails(vehicleId?: number) {
  return useQuery<Vehicle, Error>({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      if (!vehicleId) throw new Error("No vehicle ID provided");
      try {
        const { data: body } = await apiClient.get<ApiResponse<Vehicle>>(
          `/api/vehicle/${vehicleId}`,
        );
        return body?.data !== undefined ? body.data : (body as unknown as Vehicle);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleError(
            body?.message ?? "Failed to fetch vehicle details",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    enabled: !!vehicleId,
  });
}
