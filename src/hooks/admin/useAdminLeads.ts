import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export interface AdminLead {
  id: number;
  customerName: string;
  customerMobile: string;
  customerCity: string;
  enquiryDate: string;
  leadStatus: string;
  vehicleName: string;
}

export function useAdminLeads() {
  return useQuery<AdminLead[]>({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/admin/all-leads');
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
  });
}
