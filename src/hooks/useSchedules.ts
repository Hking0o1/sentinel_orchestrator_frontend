import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as scheduleService from '@/services/scheduleService';
import type { CreateSchedulePayload, UpdateSchedulePayload } from '@/types/schedule';
import { toast } from 'sonner';

/**
 * ---------------------------------------------------------------------------
 * Custom React Query Hooks for Schedules
 * ---------------------------------------------------------------------------
 * Centralizes data fetching and state management for scan schedules.
 */

export const SCHEDULES_QUERY_KEY = 'schedules';
export const SCHEDULE_QUERY_KEY = 'schedule';

/**
 * Hook to fetch all schedules for the current user.
 */
export const useGetSchedules = () => {
  return useQuery({
    queryKey: [SCHEDULES_QUERY_KEY],
    queryFn: scheduleService.getSchedules,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single schedule by ID.
 */
export const useGetScheduleById = (id: string) => {
  return useQuery({
    queryKey: [SCHEDULE_QUERY_KEY, id],
    queryFn: () => scheduleService.getScheduleById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new schedule.
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => scheduleService.createSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
      toast.success("Schedule created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create schedule");
    },
  });
};

/**
 * Hook to update an existing schedule.
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) => 
      scheduleService.updateSchedule(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_QUERY_KEY, data.id] });
      toast.success("Schedule updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update schedule");
    },
  });
};

/**
 * Hook to delete a schedule.
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
      toast.success("Schedule deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete schedule");
    },
  });
};