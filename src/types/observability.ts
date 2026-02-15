export interface SchedulerMetricsSnapshot {
  ready_queue_size: number;
  in_flight_count: number;
  tasks_completed_total: number;
  tasks_failed_total: number;
  average_task_latency: number;
  tokens_in_use_per_tier: Record<string, number>;
  blocked_due_to_resource_total: number;
  completion_rate_per_minute: number;
}

export interface SchedulerOverview {
  active_scan_count: number;
  global: {
    ready_queue_size: number;
    in_flight_count: number;
    used_tokens: number;
    max_tokens: number;
  };
  per_scan: Record<
    string,
    {
      task_counts: Record<string, number>;
      ready_queue_size: number;
      in_flight_count: number;
    }
  >;
}

export interface ScanObservabilityOverview {
  scan_id: string;
  status: string;
  files: {
    scheduler_events: string;
    alerts: string;
    timeline: string;
  };
  counts: {
    events_tail_count: number;
    alerts_tail_count: number;
    timeline_task_count: number;
  };
  latest_events: Array<Record<string, unknown>>;
  latest_alerts: Array<Record<string, unknown>>;
  timeline_available: boolean;
}

export interface ScanObservabilityItemsResponse {
  scan_id: string;
  count: number;
  items: Array<Record<string, unknown>>;
}

export interface ScanTimelineResponse {
  scan_id: string;
  available: boolean;
  timeline: {
    scan_id: string;
    generated_at_utc: string;
    tasks: Record<
      string,
      {
        admitted_at: string | null;
        ready_at: string | null;
        dispatched_at: string | null;
        running_at: string | null;
        completed_at: string | null;
      }
    >;
  } | null;
}
