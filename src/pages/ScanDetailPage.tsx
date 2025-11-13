import { useParams } from 'react-router-dom';
import { useGetScanById } from '@/hooks/useScans';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Loader2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Package,
  Code,
  Globe,
  Network,
} from 'lucide-react';
import type { ScanSeverity, ScanFinding } from '@/types/scan';
import { format } from 'date-fns';

// Helper component for Severity Badges (can be moved to a shared file)
const SeverityBadge = ({ severity, count }: { severity: ScanSeverity, count?: number }) => {
  const config = {
    CRITICAL: {
      icon: ShieldAlert,
      color: 'bg-red-700 text-red-100',
      text: 'Critical',
    },
    HIGH: {
      icon: ShieldAlert,
      color: 'bg-accent-gold text-primary-dark',
      text: 'High',
    },
    MEDIUM: {
      icon: ShieldCheck,
      color: 'bg-yellow-600 text-yellow-100',
      text: 'Medium',
    },
    LOW: {
      icon: ShieldCheck,
      color: 'bg-accent-blue text-neutral-100',
      text: 'Low',
    },
    INFO: {
      icon: FileText,
      color: 'bg-neutral-600 text-neutral-300',
      text: 'Info',
    },
  };
  const { icon: Icon, color, text } = config[severity] || config.INFO;
  return (
    <Badge className={`capitalize ${color} hover:${color} text-xs`}>
      <Icon className="mr-1 h-3 w-3" />
      {text}
      {count !== undefined && <span className="ml-1.5 font-semibold">{count}</span>}
    </Badge>
  );
};

// Helper component for Finding Icons
const FindingIcon = ({ tool }: { tool: string }) => {
  if (tool.includes('SCA')) return <Package className="h-4 w-4 text-accent-blue" />;
  if (tool.includes('SAST')) return <Code className="h-4 w-4 text-accent-gold" />;
  if (tool.includes('DAST') || tool.includes('Nikto')) return <Globe className="h-4 w-4 text-red-500" />;
  return <Network className="h-4 w-4 text-neutral-400" />;
};

/**
 * ScanDetailPage Component
 * Fetches and displays the detailed report for a single scan job.
 */
export const ScanDetailPage = () => {
  const { scanId } = useParams<{ scanId: string }>();

  // Fetch data using our custom React Query hook
  const {
    data: scan,
    isLoading,
    isError,
    error,
  } = useGetScanById(scanId || '');

  // 1. Handle Loading State
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-accent-gold" />
      </div>
    );
  }

  // 2. Handle Error State
  if (isError || !scan) {
    return (
      <Alert variant="destructive" className="bg-red-900/50 border-red-700">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load scan report</AlertTitle>
        <AlertDescription>
          {error?.message || 'The scan ID may be invalid or the scan does not exist.'}
        </AlertDescription>
      </Alert>
    );
  }

  // 3. Render the full report page
  const summaryCounts = scan.findings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {} as Record<ScanSeverity, number>);

  return (
    <div className="flex flex-col gap-8">
      {/* --- 1. Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-100">Scan Report</h1>
        <p className="text-lg text-neutral-400">
          Detailed findings for job <span className="font-mono text-accent-gold text-sm">{scan.id}</span>
        </p>
      </div>

      {/* --- 2. Main Content Tabs --- */}
      <Tabs defaultValue="summary" className="w-full text-neutral-300">
        <TabsList className="grid w-full grid-cols-3 max-w-lg bg-primary-light border-neutral-700">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="report">Detailed Report</TabsTrigger>
          <TabsTrigger value="attack-path">Attack Path</TabsTrigger>
        </TabsList>

        {/* --- Summary Tab --- */}
        <TabsContent value="summary" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-primary-light border-neutral-700 text-neutral-100">
              <CardHeader>
                <CardTitle className="text-neutral-400 text-sm font-medium">Target</CardTitle>
                <CardDescription className="text-neutral-100 text-lg font-semibold truncate">
                  {scan.targetUrl || scan.sourceCodePath}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-primary-light border-neutral-700 text-neutral-100">
              <CardHeader>
                <CardTitle className="text-neutral-400 text-sm font-medium">Profile</CardTitle>
                <CardDescription className="text-neutral-100 text-lg font-semibold capitalize">
                  {scan.profile}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-primary-light border-neutral-700 text-neutral-100">
              <CardHeader>
                <CardTitle className="text-neutral-400 text-sm font-medium">Status</CardTitle>
                <CardDescription className={`text-lg font-semibold capitalize ${
                  scan.status === 'COMPLETED' ? 'text-green-400' :
                  scan.status === 'RUNNING' ? 'text-accent-blue' :
                  scan.status === 'FAILED' ? 'text-red-500' : 'text-neutral-400'
                }`}>
                  {scan.status}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-primary-light border-neutral-700 text-neutral-100">
              <CardHeader>
                <CardTitle className="text-neutral-400 text-sm font-medium">Date</CardTitle>
                <CardDescription className="text-neutral-100 text-lg font-semibold">
                  {format(new Date(scan.createdAt), 'dd MMM yyyy')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card className="mt-6 bg-primary-light border-neutral-700 text-neutral-100">
            <CardHeader>
              <CardTitle>Vulnerability Summary</CardTitle>
              <CardDescription className="text-neutral-400">
                Breakdown of all findings by severity level.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <SeverityBadge severity="CRITICAL" count={summaryCounts.CRITICAL || 0} />
              <SeverityBadge severity="HIGH" count={summaryCounts.HIGH || 0} />
              <SeverityBadge severity="MEDIUM" count={summaryCounts.MEDIUM || 0} />
              <SeverityBadge severity="LOW" count={summaryCounts.LOW || 0} />
              <SeverityBadge severity="INFO" count={summaryCounts.INFO || 0} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Detailed Report Tab --- */}
        <TabsContent value="report" className="mt-6">
          <Card className="bg-primary-light border-neutral-700 text-neutral-100">
            <CardHeader>
              <CardTitle>Detailed Findings</CardTitle>
              <CardDescription className="text-neutral-400">
                All vulnerabilities detected during the scan, grouped by tool.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {scan.findings.length > 0 ? scan.findings.map((finding: ScanFinding, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-neutral-700">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FindingIcon tool={finding.tool} />
                        <SeverityBadge severity={finding.severity} />
                        <span className="font-medium text-neutral-100 text-left">
                          {finding.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary-dark p-4 rounded-md">
                      <h4 className="font-semibold text-neutral-300">Description</h4>
                      <p className="text-neutral-400 mb-4">{finding.details}</p>
                      
                      <h4 className="font-semibold text-neutral-300">Location</h4>
                      <p className="text-neutral-400 mb-4 font-mono text-sm">
                        {finding.location || 'N/A'}
                      </p>

                      <h4 className="font-semibold text-neutral-300">Tool</h4>
                      <p className="text-neutral-400 mb-4">{finding.tool}</p>

                      <h4 className="font-semibold text-accent-gold">Remediation</h4>
                      <p className="text-neutral-300">
                        {finding.remediation || 'No specific remediation provided. Please investigate.'}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )) : (
                  <p className="text-center text-neutral-400 py-8">No findings reported for this scan.</p>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Attack Path Tab (Placeholder) --- */}
        <TabsContent value="attack-path" className="mt-6">
          <Card className="bg-primary-light border-neutral-700 text-neutral-100">
            <CardHeader>
              <CardTitle>AI-Generated Attack Path</CardTitle>
              <CardDescription className="text-neutral-400">
                A visual representation of how an attacker could chain vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-neutral-500">
                (GSAP Animation & Report Visualization Component will go here)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanDetailPage;

