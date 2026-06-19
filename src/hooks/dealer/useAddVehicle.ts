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

export function useAddVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { vehicleData: any; images: File[]; videos: File[] }>({
    mutationFn: async ({ vehicleData, images, videos }) => {
      const vehicleFormData = new FormData();
      vehicleFormData.append(
        "vehicle",
        new Blob([JSON.stringify(vehicleData)], { type: "application/json" })
      );
      for (const image of images) vehicleFormData.append("images", image);
      for (const video of videos) vehicleFormData.append("videos", video);

      try {
        const { data: body } = await apiClient.post(
          `/api/vehicle/add/${dealerId}`,
          vehicleFormData,
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleError(
            body?.message ?? "Failed to add vehicle",
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
