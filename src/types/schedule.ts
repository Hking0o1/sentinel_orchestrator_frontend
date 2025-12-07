import type { ScanProfile } from './scan';

/**
 * ---------------------------------------------------------------------------
 * Schedule Type Definitions
 * ---------------------------------------------------------------------------
 * Defines the shape of Scan Schedule objects for the frontend.
 */

export interface ScanSchedule {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  crontab: string; // e.g., "0 0 * * *"
  
  // Configuration for the scan to run
  profile: ScanProfile;
  targetUrl: string | null;
  sourceCodePath: string | null;
  authCookie: string | null;
  
  ownerId: string;
  
  // Note: Backend might not send 'lastRun' yet, but good to have in type for future
  lastRun?: string; 
  nextRun?: string;
}

export interface CreateSchedulePayload {
  name: string;
  description?: string;
  crontab: string;
  isActive?: boolean;
  profile: ScanProfile;
  target_url?: string;
  source_code_path?: string;
  auth_cookie?: string;
}

export interface UpdateSchedulePayload {
  name?: string;
  crontab?: string;
  isActive?: boolean;
  profile?: ScanProfile;
}