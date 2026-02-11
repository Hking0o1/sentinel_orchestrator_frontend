import apiClient from './apiClient';
import type {
  StartScanPayload,
  ScanJobStarted,
  ScanJob,
  ScanReport,
  ScanFinding,
} from '@/types/scan';

const unwrapError = (error: any, fallback: string): Error => {
  const detail = error?.response?.data?.detail;
  const message =
    typeof detail === 'string'
      ? detail
      : detail?.message || error?.message || fallback;
  return new Error(message);
};

export const startScan = async (payload: StartScanPayload): Promise<ScanJobStarted> => {
  try {
    const response = await apiClient.post<ScanJobStarted>('/scans/start', payload);
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to start scan.');
  }
};

export const getScanHistory = async (): Promise<ScanJob[]> => {
  try {
    const response = await apiClient.get<ScanJob[]>('/scans');
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan history.');
  }
};

export const getScanReport = async (jobId: string): Promise<ScanReport> => {
  try {
    const response = await apiClient.get<ScanReport>(`/scans/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan report.');
  }
};

export const getScanStatus = async (jobId: string): Promise<Partial<ScanJob>> => {
  try {
    const response = await apiClient.get<Partial<ScanJob>>(`/scans/status/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan status.');
  }
};

export const downloadReportPDF = async (jobId: string): Promise<void> => {
  try {
    const response = await apiClient.get(`/scans/${jobId}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sentinel_Report_${jobId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw unwrapError(error, 'Failed to download report. It may not exist yet.');
  }
};

export const getAllFindings = async (): Promise<ScanFinding[]> => {
  try {
    const response = await apiClient.get<ScanFinding[]>('/scans/findings/all');
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch vulnerabilities.');
  }
};
