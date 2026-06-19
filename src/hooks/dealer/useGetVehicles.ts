import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Vehicle } from '@/types';
import apiClient from '@/lib/apiClient';

export class VehicleError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VehicleError";
    this.status = status;
  }
}

export function useGetVehicles(dealerId: string) {
  return useQuery<Vehicle[], Error>({
    queryKey: ['vehicles', dealerId],
    queryFn: async () => {
      if (!dealerId) return [];
      try {
        const { data: body } = await apiClient.get(`/api/vehicle/dealer/${dealerId}`);
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleError(
            body?.message ?? "Failed to fetch vehicles",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    enabled: !!dealerId,
  });
}
