import type { ScanJob, ScanStatus, ScanProfile, ScanSeverity } from "@/types/scan";

export const MOCK_USER = {
  id: "dev-user-001",
  email: "admin@sentinel.com",
  full_name: "Dev Admin",
  is_active: true,
  is_admin: true
};

export const MOCK_SCANS: ScanJob[] = [
  {
    id: "scan-101",
    status: "COMPLETED",
    profile: "full",
    target: "https://staging.example.com",
    highestSeverity: "CRITICAL",
    createdAt: new Date().toISOString(),
  },
  {
    id: "scan-102",
    status: "RUNNING",
    profile: "web",
    target: "http://localhost:3000",
    highestSeverity: "INFO",
    createdAt: new Date(Date.now() - 1000000).toISOString(),
  },
  {
    id: "scan-103",
    status: "FAILED",
    profile: "developer",
    target: "/app/src/legacy",
    highestSeverity: "HIGH",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const MOCK_STATS = {
  totalScans: 42,
  criticalCount: 5,
  avgRisk: 75,
  running: 1
};