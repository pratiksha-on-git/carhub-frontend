import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export function useSendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data: body } = await apiClient.post(
        `/api/dealer/send-otp?email=${encodeURIComponent(email)}`,
      );
      return body;
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const { data: body } = await apiClient.post('/api/dealer/verify-otp', payload);
      return body;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; oldPassword: string; newPassword: string }) => {
      const { data: body } = await apiClient.post('/api/dealer/reset-password', payload);
      return body;
    },
  });
}
