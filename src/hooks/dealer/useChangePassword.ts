import { useMutation } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/authHeaders';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useSendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp?email=${encodeURIComponent(email)}`, {
        headers: getAuthHeaders(), // No Content-Type: browser sets multipart/form-data boundary automatically
        method: 'POST',
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to send OTP');
      return body;
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Invalid OTP');
      return body;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; oldPassword: string; newPassword: string }) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Failed to reset password');
      return body;
    },
  });
}
