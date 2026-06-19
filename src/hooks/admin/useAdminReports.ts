import apiClient from '@/lib/apiClient';

type ReportEndpoint =
  | '/api/admin/reports/lead-conversion'
  | '/api/admin/reports/dealer-activity'
  | '/api/admin/reports/revenue-by-plan'
  | '/api/admin/reports/top-cities'
  | '/api/admin/reports/vehicle-inventory';

async function downloadReport(endpoint: ReportEndpoint, fallbackName: string): Promise<void> {
  const response = await apiClient.get(endpoint, { responseType: 'blob' });

  const contentDisposition = response.headers['content-disposition'] ?? '';
  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const serverFilename = filenameMatch ? filenameMatch[1].replace(/['"]/g, '') : null;

  const contentType = response.headers['content-type'] ?? '';
  let ext = '.csv';
  if (contentType.includes('pdf')) ext = '.pdf';
  else if (contentType.includes('excel') || contentType.includes('spreadsheetml')) ext = '.xlsx';
  else if (contentType.includes('zip')) ext = '.zip';

  const filename = serverFilename || `${fallbackName}${ext}`;
  const url = URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useAdminReports() {
  return {
    downloadLeadConversion: () => downloadReport('/api/admin/reports/lead-conversion', 'lead-conversion-report'),
    downloadDealerActivity: () => downloadReport('/api/admin/reports/dealer-activity', 'dealer-activity-report'),
    downloadRevenueByPlan: () => downloadReport('/api/admin/reports/revenue-by-plan', 'revenue-by-plan-report'),
    downloadTopCities: () => downloadReport('/api/admin/reports/top-cities', 'top-cities-report'),
    downloadVehicleInventory: () => downloadReport('/api/admin/reports/vehicle-inventory', 'vehicle-inventory-report'),
  };
}
