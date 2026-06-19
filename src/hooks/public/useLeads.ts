import { useCallback, useState } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

type LeadPayload = {
  customerName: string;
  customerMobile: string;
  customerCity: string;
};

export function useGenerateLead() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateLead = useCallback(async (vehicleId: number, payload: LeadPayload) => {
    setIsSubmitting(true);
    try {
      await apiClient.post(`/api/lead/generate-lead/${vehicleId}`, payload);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new Error(body?.message ?? "Failed to submit lead");
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, generateLead };
}

export function useGenerateView() {
  const generateView = useCallback(async (vehicleId: number) => {
    try {
      await apiClient.get(`/api/lead/generate-view/${vehicleId}`);
    } catch {
      // silently fail — view tracking is non-critical
    }
  }, []);

  return { generateView };
}
