import apiClient from './apiClient';
import type {
  ScanObservabilityItemsResponse,
  ScanObservabilityOverview,
  ScanTimelineResponse,
  SchedulerMetricsSnapshot,
  SchedulerOverview,
} from '@/types/observability';

const unwrapError = (error: any, fallback: string): Error => {
  const detail = error?.response?.data?.detail;
  const message =
    typeof detail === 'string'
      ? detail
      : detail?.message || error?.message || fallback;
  return new Error(message);
};

export const getSchedulerMetrics = async (): Promise<SchedulerMetricsSnapshot> => {
  try {
    const response = await apiClient.get<SchedulerMetricsSnapshot>('/internal/scheduler/metrics');
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scheduler metrics.');
  }
};

export const getSchedulerOverview = async (): Promise<SchedulerOverview> => {
  try {
    const response = await apiClient.get<SchedulerOverview>('/internal/scheduler/overview');
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scheduler overview.');
  }
};

export const getScanObservabilityOverview = async (
  scanId: string
): Promise<ScanObservabilityOverview> => {
  try {
    const response = await apiClient.get<ScanObservabilityOverview>(
      `/scans/${scanId}/observability`
    );
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan observability overview.');
  }
};

export const getScanObservabilityEvents = async (
  scanId: string,
  limit = 200
): Promise<ScanObservabilityItemsResponse> => {
  try {
    const response = await apiClient.get<ScanObservabilityItemsResponse>(
      `/scans/${scanId}/observability/events`,
      { params: { limit } }
    );
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan events.');
  }
};

export const getScanObservabilityAlerts = async (
  scanId: string,
  limit = 200
): Promise<ScanObservabilityItemsResponse> => {
  try {
    const response = await apiClient.get<ScanObservabilityItemsResponse>(
      `/scans/${scanId}/observability/alerts`,
      { params: { limit } }
    );
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan alerts.');
  }
};

export const getScanObservabilityTimeline = async (
  scanId: string
): Promise<ScanTimelineResponse> => {
  try {
    const response = await apiClient.get<ScanTimelineResponse>(
      `/scans/${scanId}/observability/timeline`
    );
    return response.data;
  } catch (error: any) {
    throw unwrapError(error, 'Failed to fetch scan timeline.');
  }
};
