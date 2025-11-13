/**
 * ---------------------------------------------------------------------------
 * Scan Type Definitions
 * ---------------------------------------------------------------------------
 * This file defines the TypeScript interfaces for all data structures
 * related to security scans, ensuring type safety across our app.
 */

/**
 * Defines the available scan profiles.
 * This must be kept in sync with the backend orchestrator.
 */
export type ScanProfile = 'developer' | 'web' | 'full';

/**
 * Defines the data required to start a new scan job.
 * This matches the Pydantic model in our FastAPI backend.
 */
export interface StartScanPayload {
  profile: ScanProfile;
  target_url: string;
  source_code_path: string;
}

/**
 * Defines the response from the backend when a scan is successfully started.
 * This matches the Pydantic model in our FastAPI backend.
 */
export interface ScanJobStarted {
  job_id: string; // The Celery task ID
  status: 'PENDING' | 'RECEIVED';
  message: string;
}

/**
 * Defines the status of a running or completed scan.
 * This MUST match the Pydantic 'ScanStatus' enum in the backend.
 */
export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

/**
 * Defines the severity of a finding.
 * This MUST match the Pydantic 'ScanSeverity' enum in the backend.
 */
export type ScanSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';


/**
 * Represents a single finding from a scan report.
 * This MUST match the Pydantic 'ScanFinding' model (and its camelCase output).
 */
export interface ScanFinding {
  severity: ScanSeverity;
  title: string;
  tool: string;
  details: string;
  remediation: string | null;
  location: string | null;
}

/**
 * Represents a scan job in a list (e.g., in the scan history table).
 * This MUST match the Pydantic 'ScanJobSummary' model (and its camelCase output).
 */
export interface ScanJob {
  id: string;
  status: ScanStatus;
  profile: ScanProfile;
  target: string; // A display string for the target (e.g., URL or src path)
  highestSeverity: ScanSeverity;
  createdAt: string; // ISO 8601 date string
}

/**
 * Represents the full, detailed report for a single scan.
 * This MUST match the Pydantic 'ScanJob' model (and its camelCase output).
 */
export interface ScanReport {
  id: string;
  status: ScanStatus;
  profile: ScanProfile;
  targetUrl: string | null;
  sourceCodePath: string | null;
  createdAt: string; // ISO 8601 date string
  completedAt: string | null; // ISO 8601 date string
  highestSeverity: ScanSeverity;
  findings: ScanFinding[];
  
  // These fields will be populated by the AI nodes
  attackPathAnalysis?: string; 
  geminiReportMarkdown?: string;
  reportPdfUrl?: string; 
}
