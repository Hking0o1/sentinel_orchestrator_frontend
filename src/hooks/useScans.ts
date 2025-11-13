import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as scanService from '@/services/scanService';
import type { StartScanPayload } from '@/types/scan';

/**
 * ---------------------------------------------------------------------------
 * Custom React Query Hooks for Scans
 * ---------------------------------------------------------------------------
 * This file centralizes all data-fetching logic related to scans.
 * Components will use these hooks to interact with the API,
 * which provides caching, error handling, and loading states.
 */

/**
 * Key for caching scan history data.
 */
export const SCAN_HISTORY_QUERY_KEY = 'scanHistory';
/**
 * Key for caching a single scan report.
 */
export const SCAN_REPORT_QUERY_KEY = 'scanReport';

/**
 * React Query hook to fetch the list of all scan jobs.
 *
 * @returns A query object containing the scan history data, loading state, etc.
 */
export const useGetScanHistory = () => {
  return useQuery({
    queryKey: [SCAN_HISTORY_QUERY_KEY],
    queryFn: scanService.getScanHistory,
    // Example: Refetch every 5 minutes
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * React Query hook to fetch the detailed report for a single scan job.
 *
 * @param jobId The ID of the scan job to fetch.
 * @returns A query object containing the scan report data, loading state, etc.
 */
// FIX 1: Renamed 'useGetScanReport' to 'useGetScanById' to match the import
export const useGetScanById = (jobId: string) => {
  return useQuery({
    // The queryKey is an array; the jobId is passed as part of it.
    // This ensures the query is unique for each scan report.
    queryKey: [SCAN_REPORT_QUERY_KEY, jobId],
    queryFn: () => scanService.getScanReport(jobId),
    // Only run the query if the jobId is provided
    enabled: !!jobId,
  });
};

/**
 * React Query hook to fetch the real-time status of a single scan job.
 * This can be used for polling.
 *
 * @param jobId The ID of the scan job to poll.
 * @returns A query object containing the scan status.
 */
export const useGetScanStatus = (jobId: string) => {
  return useQuery({
    queryKey: ['scanStatus', jobId],
    queryFn: () => scanService.getScanStatus(jobId),
    enabled: !!jobId,
    // Example: Poll for updates every 5 seconds
    refetchInterval: 5000,
  });
};

/**
 * React Query mutation hook for starting a new scan.
 *
 * @returns A mutation object to trigger the scan, with loading/error states.
 */
// FIX 2: Corrected the syntax error '(); =>' to '() =>'
export const useStartScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartScanPayload) => scanService.startScan(payload),
    /**
     * This function runs on a successful mutation.
     * We can use it to invalidate our scan history cache,
     * which will trigger a refetch of the getScanHistory query
     * to show the new scan in the list.
     */
    onSuccess: () => {
      // Invalidate and refetch the scan history list
      queryClient.invalidateQueries({ queryKey: [SCAN_HISTORY_QUERY_KEY] });
    },
    onError: (error) => {
      // We can add global error handling here, e.g., show a toast notification
      console.error('Failed to start scan:', error.message);
    },
  });
};