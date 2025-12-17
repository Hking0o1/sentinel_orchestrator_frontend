import apiClient from './apiClient';
import type {
  StartScanPayload,
  ScanJobStarted,
  ScanJob,
  ScanReport,
  ScanFinding // Ensure this is imported
} from '@/types/scan';
import { MOCK_SCANS } from '@/lib/mockData';

const USE_MOCK_MODE = true; 

// ... (previous functions: startScan, getScanHistory, getScanReport, getScanStatus) ...
export const startScan = async (payload: StartScanPayload): Promise<ScanJobStarted> => {
   if (USE_MOCK_MODE) {
        return { job_id: "mock-job-new", status: "PENDING", message: "Mock scan started" };
    }
  const response = await apiClient.post<ScanJobStarted>('/scans/start', payload);
  return response.data;
};

export const getScanHistory = async (): Promise<ScanJob[]> => {
  if (USE_MOCK_MODE) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SCANS as any), 500));
  }
  const response = await apiClient.get<ScanJob[]>('/scans');
  return response.data;
};

export const getScanReport = async (jobId: string): Promise<ScanReport> => {
  const response = await apiClient.get<ScanReport>(`/scans/${jobId}`);
  return response.data;
};

export const getScanStatus = async (jobId: string): Promise<Partial<ScanJob>> => {
  const response = await apiClient.get<Partial<ScanJob>>(`/scans/status/${jobId}`);
  return response.data;
};

// --- NEW FUNCTION: Download Report ---
export const downloadReportPDF = async (jobId: string): Promise<void> => {
  try {
    // We request the file as a 'blob' (binary large object)
    const response = await apiClient.get(`/scans/${jobId}/download`, {
      responseType: 'blob', 
    });
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a hidden <a> tag and click it to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sentinel_Report_${jobId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error: any) {
    console.error('Download Error:', error);
    throw new Error('Failed to download report. It may not exist yet.');
  }
};

export const getAllFindings = async (): Promise<ScanFinding[]> => {
  try {
    const response = await apiClient.get<ScanFinding[]>('/scans/findings/all');
    return response.data;
  } catch (error: any) {
    console.error('Get Findings Error:', error);
    throw new Error('Failed to fetch vulnerabilities.');
  }
};