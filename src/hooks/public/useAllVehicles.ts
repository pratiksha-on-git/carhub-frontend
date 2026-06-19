import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import type { Vehicle } from "@/types";

interface ApiResponse {
  status: number;
  message: string;
  data: Vehicle[];
}

interface UseAllVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAllVehicles(): UseAllVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: body } = await apiClient.get<ApiResponse>("/api/vehicle/all-vehicle");
      setVehicles(body.data ?? []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? err.message;
        setError(msg);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}
