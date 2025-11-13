import apiClient from './apiClient';
import axios from 'axios'; // Import axios
import type {
  StartScanPayload,
  ScanJobStarted,
  ScanJob,
  ScanReport,
} from '@/types/scan';

/**
 * ---------------------------------------------------------------------------
 * Scan Service
 * ---------------------------------------------------------------------------
 * This service handles all API calls related to managing and retrieving
 * security scan jobs and reports.
 *
 * It uses the pre-configured `apiClient` which automatically handles
 * JWT token attachment and 401 error responses.
 */

/** Narrow unknown -> best-effort message extraction (handles Axios and native Errors) */
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // If backend sends structured error payload with `detail`
    const detail = (error.response?.data as any)?.detail;
    return detail ?? error.message ?? 'Request failed (Axios error)';
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};


export const startScan = async (
  payload: StartScanPayload
): Promise<ScanJobStarted> => {
  try {
    // This corresponds to the `/api/v1/scans/start` endpoint in our FastAPI backend.
    const response = await apiClient.post<ScanJobStarted>('/scans/start', payload);
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error('Start Scan Error:', message);
    throw new Error(message || 'Failed to start scan.');
  }
};

/**
 * Fetches the list of all scan jobs for the authenticated user.
 */
export const getScanHistory = async (): Promise<ScanJob[]> => {
  try {
    const response = await apiClient.get<ScanJob[]>('/scans'); // Example endpoint
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error('Get Scan History Error:', message);
    throw new Error(message || 'Failed to fetch scan history.');
  }
};

/**
 * Fetches the full, detailed report for a single scan job.
 */
export const getScanReport = async (jobId: string): Promise<ScanReport> => {
  try {
    const response = await apiClient.get<ScanReport>(`/scans/${jobId}`); // Example endpoint
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error('Get Scan Report Error:', message);
    throw new Error(message || 'Failed to fetch scan report.');
  }
};

/**
 * Polls the backend for the status of a specific scan job.
 */
export const getScanStatus = async (jobId: string): Promise<Partial<ScanJob>> => {
  try {
    const response = await apiClient.get<Partial<ScanJob>>(`/scans/status/${jobId}`); // Example endpoint
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error('Get Scan Status Error:', message);
    throw new Error(message || 'Failed to fetch scan status.');
  }
};
