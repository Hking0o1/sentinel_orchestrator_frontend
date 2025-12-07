import apiClient from './apiClient';
import type { 
  ScanSchedule, 
  CreateSchedulePayload, 
  UpdateSchedulePayload 
} from '@/types/schedule';

/**
 * ---------------------------------------------------------------------------
 * Schedule Service
 * ---------------------------------------------------------------------------
 * Handles all API interaction for managing scheduled scans.
 */

const BASE_URL = '/schedules';

/**
 * Fetches all scan schedules for the current user.
 */
export const getSchedules = async (): Promise<ScanSchedule[]> => {
  try {
    const response = await apiClient.get<ScanSchedule[]>(BASE_URL);
    return response.data;
  } catch (error: any) {
    console.error('Get Schedules Error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch schedules.');
  }
};

/**
 * Fetches a single schedule by ID.
 */
export const getScheduleById = async (id: string): Promise<ScanSchedule> => {
  try {
    const response = await apiClient.get<ScanSchedule>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get Schedule Error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch schedule.');
  }
};

/**
 * Creates a new recurring scan schedule.
 */
export const createSchedule = async (payload: CreateSchedulePayload): Promise<ScanSchedule> => {
  try {
    const response = await apiClient.post<ScanSchedule>(BASE_URL, payload);
    return response.data;
  } catch (error: any) {
    console.error('Create Schedule Error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to create schedule.');
  }
};

/**
 * Updates an existing schedule (e.g., to pause it or change the crontab).
 */
export const updateSchedule = async (id: string, payload: UpdateSchedulePayload): Promise<ScanSchedule> => {
  try {
    const response = await apiClient.put<ScanSchedule>(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Update Schedule Error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to update schedule.');
  }
};

/**
 * Deletes a schedule.
 */
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${BASE_URL}/${id}`);
  } catch (error: any) {
    console.error('Delete Schedule Error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to delete schedule.');
  }
};