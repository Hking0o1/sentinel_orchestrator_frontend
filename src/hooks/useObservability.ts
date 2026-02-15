import { useQuery } from '@tanstack/react-query';
import * as observabilityService from '@/services/observabilityService';

export const SCHEDULER_METRICS_QUERY_KEY = 'schedulerMetrics';
export const SCHEDULER_OVERVIEW_QUERY_KEY = 'schedulerOverview';

export const useGetSchedulerMetrics = (enabled = true) => {
  return useQuery({
    queryKey: [SCHEDULER_METRICS_QUERY_KEY],
    queryFn: observabilityService.getSchedulerMetrics,
    enabled,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};

export const useGetSchedulerOverview = (enabled = true) => {
  return useQuery({
    queryKey: [SCHEDULER_OVERVIEW_QUERY_KEY],
    queryFn: observabilityService.getSchedulerOverview,
    enabled,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};

export const useGetScanObservabilityOverview = (scanId?: string) => {
  return useQuery({
    queryKey: ['scanObservabilityOverview', scanId],
    queryFn: () => observabilityService.getScanObservabilityOverview(scanId || ''),
    enabled: !!scanId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};

export const useGetScanObservabilityEvents = (scanId?: string, limit = 120) => {
  return useQuery({
    queryKey: ['scanObservabilityEvents', scanId, limit],
    queryFn: () => observabilityService.getScanObservabilityEvents(scanId || '', limit),
    enabled: !!scanId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};

export const useGetScanObservabilityAlerts = (scanId?: string, limit = 120) => {
  return useQuery({
    queryKey: ['scanObservabilityAlerts', scanId, limit],
    queryFn: () => observabilityService.getScanObservabilityAlerts(scanId || '', limit),
    enabled: !!scanId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};

export const useGetScanObservabilityTimeline = (scanId?: string) => {
  return useQuery({
    queryKey: ['scanObservabilityTimeline', scanId],
    queryFn: () => observabilityService.getScanObservabilityTimeline(scanId || ''),
    enabled: !!scanId,
    refetchInterval: 7000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 1,
  });
};
