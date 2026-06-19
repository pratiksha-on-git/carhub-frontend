import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface AdminSubscription {
  dealerId: number;
  dealerName: string;
  subscriptionActive: boolean;
  subscriptionPlan: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
}

export interface PaymentRecord {
  transactionId: string;
  dealerId: number;
  subscriptionPlan: string;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
}

export function useAdminSubscriptions() {
  return useQuery<AdminSubscription[]>({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data: body } = await apiClient.get('/api/admin/subscriptions');
      return body.data;
    },
  });
}

export function useAdminPayments() {
  return useQuery<PaymentRecord[]>({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data: body } = await apiClient.get('/api/admin/payments');
      return body.data ?? body;
    },
  });
}
