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

export function useAddVehicle(dealerId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { vehicleData: any; images: File[]; videos: File[] }>({
    mutationFn: async ({ vehicleData, images, videos }) => {
      // Step 1: Create Vehicle Info with Media
      const vehicleFormData = new FormData();
      vehicleFormData.append(
        "vehicle", 
        new Blob([JSON.stringify(vehicleData)], { type: "application/json" })
      );

      for (let i = 0; i < images.length; i++) {
        vehicleFormData.append("images", images[i]);
      }
      for (let i = 0; i < videos.length; i++) {
        vehicleFormData.append("videos", videos[i]);
      }

      const vehicleResponse = await fetch(`${API_BASE_URL}/api/vehicle/add/${dealerId}`, {
        method: 'POST',
        headers: getAuthHeaders(), // No Content-Type: browser sets multipart/form-data boundary automatically
        body: vehicleFormData,
      });

      let vehicleBody: ApiResponse<any> | any = null;
      try {
        vehicleBody = await vehicleResponse.json();
      } catch {
        throw new VehicleError("Server returned an invalid response.", vehicleResponse.status);
      }

      if (!vehicleResponse.ok) {
        throw new VehicleError(
          vehicleBody?.message ?? "Failed to add vehicle info",
          vehicleBody?.status ?? vehicleResponse.status,
        );
      }

      const createdVehicle = vehicleBody?.data !== undefined ? vehicleBody.data : vehicleBody;
      return createdVehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', dealerId] });
    },
  });
}
