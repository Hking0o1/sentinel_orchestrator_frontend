import React from 'react';
import { format, parseISO } from 'date-fns';
import {
  Activity,
  AlertCircle,
  Clock3,
  Gauge,
  Layers3,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useGetScanHistory } from '@/hooks/useScans';
import {
  useGetScanObservabilityAlerts,
  useGetScanObservabilityEvents,
  useGetScanObservabilityOverview,
  useGetScanObservabilityTimeline,
  useGetSchedulerMetrics,
  useGetSchedulerOverview,
} from '@/hooks/useObservability';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type MetricPoint = { t: number; value: number };
const MAX_POINTS = 60;

const formatTime = (iso: string | undefined | null) => {
  if (!iso) return 'n/a';
  try {
    return format(parseISO(iso), 'HH:mm:ss');
  } catch {
    return 'n/a';
  }
};

const TimeSeriesPanel = ({
  title,
  subtitle,
  data,
  color,
  currentValue,
}: {
  title: string;
  subtitle: string;
  data: MetricPoint[];
  color: string;
  currentValue: string;
}) => {
  const width = 1000;
  const height = 240;
  const padding = 28;
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = data
    .map((d, idx) => {
      const x = padding + (idx / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <Card className="border-border/80 bg-card/85">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono">
            {currentValue}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <div className="flex h-[220px] items-center justify-center rounded-md border border-border/60 bg-muted/20 text-sm text-muted-foreground">
            Waiting for realtime points...
          </div>
        ) : (
          <div className="h-[220px] w-full rounded-lg border border-border/60 bg-background/40 p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding + ratio * (height - padding * 2);
                return (
                  <line
                    key={ratio}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="rgba(148, 163, 184, 0.22)"
                    strokeDasharray="4 6"
                  />
                );
              })}
              <polyline fill={`${color}20`} points={areaPoints} />
              <polyline
                fill="none"
                stroke={color}
                strokeWidth={3}
                points={points}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatTile = ({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: React.ElementType;
}) => (
  <Card className="border-border/80 bg-card/85">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-cyan-300" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;

  const {
    data: scanHistory,
    isLoading: scansLoading,
    isError: scansError,
    error: scansErrorObj,
    refetch: refetchScans,
    isRefetching: scansRefetching,
  } = useGetScanHistory({
    staleTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const {
    data: schedulerMetrics,
    isError: schedulerMetricsError,
    refetch: refetchSchedulerMetrics,
  } = useGetSchedulerMetrics(isAdmin);
  const {
    data: schedulerOverview,
    isError: schedulerOverviewError,
    refetch: refetchSchedulerOverview,
  } = useGetSchedulerOverview(isAdmin);

  const [selectedScanId, setSelectedScanId] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    if (!scanHistory?.length) {
      setSelectedScanId(undefined);
      return;
    }
    if (selectedScanId && scanHistory.some((s) => s.id === selectedScanId)) {
      return;
    }
    const running = scanHistory.find((scan) => scan.status === 'RUNNING');
    setSelectedScanId(running?.id || scanHistory[0].id);
  }, [scanHistory, selectedScanId]);

  const { data: scanObsOverview, refetch: refetchScanObs } = useGetScanObservabilityOverview(selectedScanId);
  const { data: scanAlerts, refetch: refetchScanAlerts } = useGetScanObservabilityAlerts(selectedScanId, 30);
  const { data: scanEvents, refetch: refetchScanEvents } = useGetScanObservabilityEvents(selectedScanId, 40);
  const { data: scanTimeline, refetch: refetchScanTimeline } = useGetScanObservabilityTimeline(selectedScanId);

  const [queueSeries, setQueueSeries] = React.useState<MetricPoint[]>([]);
  const [inFlightSeries, setInFlightSeries] = React.useState<MetricPoint[]>([]);
  const [completionRateSeries, setCompletionRateSeries] = React.useState<MetricPoint[]>([]);

  React.useEffect(() => {
    if (!schedulerMetrics) return;
    const t = Date.now();
    setQueueSeries((prev) => [...prev, { t, value: schedulerMetrics.ready_queue_size }].slice(-MAX_POINTS));
    setInFlightSeries((prev) => [...prev, { t, value: schedulerMetrics.in_flight_count }].slice(-MAX_POINTS));
    setCompletionRateSeries((prev) => [...prev, { t, value: schedulerMetrics.completion_rate_per_minute }].slice(-MAX_POINTS));
  }, [schedulerMetrics]);

  const highLevelStats = React.useMemo(() => {
    const scans = scanHistory || [];
    return {
      totalScans: scans.length,
      critical: scans.filter((scan) => scan.highestSeverity === 'CRITICAL').length,
      running: scans.filter((scan) => scan.status === 'RUNNING').length,
    };
  }, [scanHistory]);

  const tokenUsagePct = React.useMemo(() => {
    if (!schedulerOverview) return 0;
    const maxTokens = schedulerOverview.global.max_tokens || 1;
    return Math.min(100, Math.round((schedulerOverview.global.used_tokens / maxTokens) * 100));
  }, [schedulerOverview]);

  const handleRefreshNow = () => {
    refetchScans();
    refetchSchedulerMetrics();
    refetchSchedulerOverview();
    refetchScanObs();
    refetchScanAlerts();
    refetchScanEvents();
    refetchScanTimeline();
  };

  if (scansLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (scansError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load dashboard</AlertTitle>
        <AlertDescription>{(scansErrorObj as Error)?.message || 'Unknown error'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border/70 bg-card/70 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Security Operations Console</h1>
            <p className="text-sm text-muted-foreground">
              Industrial realtime monitoring for scheduler and scan execution.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300">Autorefresh 5s</Badge>
            <Button variant="outline" size="sm" onClick={handleRefreshNow}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${scansRefetching ? 'animate-spin' : ''}`} />
              Refresh now
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile title="Total Scans" value={highLevelStats.totalScans} hint="All submitted scans" icon={Layers3} />
        <StatTile title="Critical Scans" value={highLevelStats.critical} hint="Highest severity critical" icon={ShieldAlert} />
        <StatTile title="Running Scans" value={highLevelStats.running} hint="Active execution" icon={Activity} />
        <StatTile title="Token Utilization" value={isAdmin ? `${tokenUsagePct}%` : 'N/A'} hint="Scheduler budget usage" icon={Gauge} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {!isAdmin && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Scheduler metrics require admin role</AlertTitle>
              <AlertDescription>
                You still have live scan observability streams below.
              </AlertDescription>
            </Alert>
          )}

          {(schedulerMetricsError || schedulerOverviewError) && isAdmin && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Scheduler telemetry unavailable</AlertTitle>
              <AlertDescription>
                Check backend `/api/v1/internal/scheduler/*` authorization and service status.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <TimeSeriesPanel
              title="Ready Queue Trend"
              subtitle="Tasks waiting for dispatch"
              data={queueSeries}
              color="#22d3ee"
              currentValue={`${schedulerMetrics?.ready_queue_size ?? 0}`}
            />
            <TimeSeriesPanel
              title="In-Flight Trend"
              subtitle="Currently running tasks"
              data={inFlightSeries}
              color="#34d399"
              currentValue={`${schedulerMetrics?.in_flight_count ?? 0}`}
            />
          </div>
          <TimeSeriesPanel
            title="Completion Throughput"
            subtitle="Completions per minute"
            data={completionRateSeries}
            color="#f59e0b"
            currentValue={`${schedulerMetrics?.completion_rate_per_minute ?? 0}/min`}
          />
        </div>

        <Card className="border-border/80 bg-card/85">
          <CardHeader>
            <CardTitle>Scheduler Snapshot</CardTitle>
            <CardDescription>Global state right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active scans</span>
              <span className="font-medium">{schedulerOverview?.active_scan_count ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ready queue</span>
              <span className="font-medium">{schedulerOverview?.global.ready_queue_size ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">In flight</span>
              <span className="font-medium">{schedulerOverview?.global.in_flight_count ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tokens used</span>
              <span className="font-medium">
                {schedulerOverview?.global.used_tokens ?? 0}/{schedulerOverview?.global.max_tokens ?? 0}
              </span>
            </div>
            <div className="rounded border border-border/60 bg-muted/20 p-2 text-xs text-muted-foreground">
              <Clock3 className="mr-1 inline h-3.5 w-3.5 text-cyan-300" />
              Last refresh: {format(new Date(), 'HH:mm:ss')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 bg-card/85">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Scan Observability Feed</CardTitle>
              <CardDescription>Events, alerts and timeline for selected scan.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="scan-selector" className="text-xs text-muted-foreground">
                Scan
              </label>
              <select
                id="scan-selector"
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                value={selectedScanId || ''}
                onChange={(e) => setSelectedScanId(e.target.value || undefined)}
              >
                {(scanHistory || []).map((scan) => (
                  <option key={scan.id} value={scan.id}>
                    {scan.id.slice(0, 8)}... ({scan.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <h3 className="mb-2 text-sm font-semibold">Event stream</h3>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {(scanEvents?.items || scanObsOverview?.latest_events || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No events yet.</p>
              )}
              {(scanEvents?.items || scanObsOverview?.latest_events || []).map((event, idx) => {
                const eventType = String(event.event_type || event.event || 'UNKNOWN');
                const ts = String(event.timestamp || '');
                const reason = String(event.reason || '');
                return (
                  <div key={`${eventType}-${idx}`} className="rounded border border-border/60 bg-muted/20 p-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-cyan-300">{eventType}</span>
                      <span className="text-muted-foreground">{formatTime(ts)}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">{reason || 'No reason provided'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <h3 className="mb-2 text-sm font-semibold">Alert feed</h3>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {(scanAlerts?.items || scanObsOverview?.latest_alerts || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No alerts raised.</p>
              )}
              {(scanAlerts?.items || scanObsOverview?.latest_alerts || []).map((alert, idx) => {
                const level = String(alert.level || 'INFO');
                const type = String(alert.type || 'UNKNOWN');
                const ts = String(alert.timestamp || '');
                return (
                  <div key={`${type}-${idx}`} className="rounded border border-border/60 bg-muted/20 p-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={level === 'CRITICAL' ? 'font-semibold text-red-300' : 'font-semibold text-amber-300'}>
                        {type}
                      </span>
                      <span className="text-muted-foreground">{formatTime(ts)}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">Severity: {level}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <h3 className="mb-2 text-sm font-semibold">Timeline coverage</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Selected scan</span>
                <span className="font-mono text-xs">{selectedScanId?.slice(0, 12) || 'n/a'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Timeline available</span>
                <span className="font-medium">{scanTimeline?.available ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tracked tasks</span>
                <span className="font-medium">{Object.keys(scanTimeline?.timeline?.tasks || {}).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Scan status</span>
                <span className="font-medium">{scanObsOverview?.status || 'N/A'}</span>
              </div>
              <Button variant="outline" className="mt-2 w-full" onClick={() => selectedScanId && navigate(`/app/scans/${selectedScanId}`)}>
                <Zap className="mr-2 h-4 w-4" />
                Open scan detail
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
