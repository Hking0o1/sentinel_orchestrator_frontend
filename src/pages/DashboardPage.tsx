import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGetScanHistory } from '@/hooks/useScans';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Loader2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Activity,
  BarChart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ScanJob, ScanSeverity } from '@/types/scan';
import { format } from 'date-fns';

/**
 * A helper component for displaying a summary statistic card.
 */
const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}) => {
  const Icon = icon;
  return (
    <Card className="border-border bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

/**
 * A helper component to get the correct color and icon for a severity badge.
 */
const SeverityBadge = ({ severity }: { severity: ScanSeverity }) => {
  const config = {
    CRITICAL: {
      icon: ShieldAlert,
      color: 'bg-red-100 text-red-700',
      text: 'Critical',
    },
    HIGH: {
      icon: ShieldAlert,
      color: 'bg-orange-100 text-orange-700',
      text: 'High',
    },
    MEDIUM: {
      icon: ShieldCheck,
      color: 'bg-yellow-100 text-yellow-700',
      text: 'Medium',
    },
    LOW: {
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-700',
      text: 'Low',
    },
    INFO: {
      icon: FileText,
      color: 'bg-muted text-muted-foreground',
      text: 'Info',
    },
  };
  const { icon: Icon, color, text } = config[severity] || config.INFO;

  return (
    <Badge className={`capitalize ${color} hover:${color}`}>
      <Icon className="mr-1 h-3 w-3" />
      {text}
    </Badge>
  );
};

/**
 * A helper component to get the correct color for a status.
 */
const StatusBadge = ({ status }: { status: ScanJob['status'] }) => {
  const config: Record<string, string> = {
    COMPLETED: 'text-green-600',
    RUNNING: 'text-blue-600',
    PENDING: 'text-muted-foreground',
    FAILED: 'text-destructive',
  };
  return (
    <span className={`font-medium ${config[status] || 'text-muted-foreground'}`}>
      {status}
    </span>
  );
};

/**
 * DashboardPage (Functional)
 * The main "home" page for logged-in users.
 * Fetches and displays real-time scan data.
 */
export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || user?.email || 'User';

  // 1. Fetch data using our custom React Query hook
  const {
    data: scanHistory,
    isLoading,
    isError,
    error,
  } = useGetScanHistory();

  // 2. Memoize derived statistics to prevent re-calculation on every render
  const stats = React.useMemo(() => {
    if (!scanHistory) {
      return {
        totalScans: 0,
        criticalCount: 0,
        avgRisk: 0,
        running: 0,
      };
    }
    const criticalCount = scanHistory.filter(
      (scan) => scan.highestSeverity === 'CRITICAL'
    ).length;
    
    // A simple risk score (e.g., CRITICAL=4, HIGH=3...). In a real app, this logic would be more complex.
    const riskSum = scanHistory.reduce((acc, scan) => {
        if (scan.highestSeverity === 'CRITICAL') return acc + 4;
        if (scan.highestSeverity === 'HIGH') return acc + 3;
        if (scan.highestSeverity === 'MEDIUM') return acc + 2;
        if (scan.highestSeverity === 'LOW') return acc + 1;
        return acc;
    }, 0);

    return {
      totalScans: scanHistory.length,
      criticalCount: criticalCount,
      avgRisk: scanHistory.length > 0 ? (riskSum / scanHistory.length) : 0,
      running: scanHistory.filter((scan) => scan.status === 'RUNNING').length,
    };
  }, [scanHistory]);

  // 3. Handle Loading and Error states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive" className="bg-red-900/50 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load dashboard data</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unknown error occurred.'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!scanHistory || scanHistory.length === 0) {
      return (
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>No Scans Found</CardTitle>
            <CardDescription className="text-muted-foreground">
              You haven't run any scans yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="font-semibold"
              onClick={() => navigate('/app/scans')}
            >
              Start Your First Scan
            </Button>
          </CardContent>
        </Card>
      );
    }

    // 4. Render the data table if successful
    return (
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription className="text-muted-foreground">
            A list of your 5 most recent security scans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanHistory.slice(0, 5).map((scan) => (
                <TableRow key={scan.id}>
                  {/* --- FIX #1: Changed 'scan.targetUrl' to 'scan.target' --- */}
                  <TableCell className="font-medium">{scan.target}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={scan.highestSeverity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={scan.status} />
                  </TableCell>
                  <TableCell>
                    {/* --- FIX #2: Added a check to prevent 'Invalid time value' --- */}
                    {scan.createdAt ? 
                      format(new Date(scan.createdAt), 'dd MMM yyyy, h:mm a')
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/80"
                      onClick={() => navigate(`/app/scans/${scan.id}`)}
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* --- 1. Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {displayName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's a high-level overview of your security posture.
        </p>
      </div>

      {/* --- 2. Statistic Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Scans"
          value={stats.totalScans.toString()}
          description="Total number of scans performed."
          icon={Activity}
        />
        <StatCard
          title="Critical Vulnerabilities"
          value={stats.criticalCount.toString()}
          description="Actively unpatched critical issues."
          icon={ShieldAlert}
        />
        <StatCard
          title="Average Risk Score"
          value={stats.avgRisk.toFixed(1)}
          description="A weighted average of all findings."
          icon={BarChart}
        />
        <StatCard
          title="Scans Running"
          value={stats.running.toString()}
          description="Scans currently in progress."
          icon={Loader2}
        />
      </div>

      {/* --- 3. Risk Score Progress --- */}
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Security Posture</CardTitle>
          <CardDescription className="text-muted-foreground">
            This score represents your overall application security. 100 is
            perfect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">
              {/* Example calculation for posture score */}
              {(100 - (stats.avgRisk * 25)).toFixed(0)}
            </span>
            <Progress
              value={100 - (stats.avgRisk * 25)}
              className="h-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* --- 4. Recent Scans Table --- */}
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
