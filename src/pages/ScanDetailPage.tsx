import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetScanById } from '@/hooks/useScans';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

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
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  FileText,
  Download,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Package,
  Code,
  Globe,
  Network,
  Activity
} from 'lucide-react';
import type { ScanSeverity, ScanFinding } from '@/types/scan';

// Import the Attack Path Visualization
import AnimatedAttackPath from '@/components/report/AnimatedAttackPath';

// --- Helper Components ---

const SeverityBadge = ({ severity, count }: { severity: ScanSeverity, count?: number }) => {
  const config = {
    CRITICAL: { icon: ShieldAlert, color: 'bg-red-900/50 text-red-200 border-red-800', text: 'Critical' },
    HIGH: { icon: ShieldAlert, color: 'bg-orange-900/50 text-orange-200 border-orange-800', text: 'High' },
    MEDIUM: { icon: ShieldCheck, color: 'bg-yellow-900/50 text-yellow-200 border-yellow-800', text: 'Medium' },
    LOW: { icon: ShieldCheck, color: 'bg-blue-900/50 text-blue-200 border-blue-800', text: 'Low' },
    INFO: { icon: FileText, color: 'bg-gray-800 text-gray-300 border-gray-700', text: 'Info' },
  };
  // @ts-ignore
  const { icon: Icon, color, text } = config[severity] || config.INFO;
  return (
    <Badge variant="outline" className={`capitalize ${color} flex items-center gap-1 px-2 py-1`}>
      <Icon className="h-3 w-3" />
      {text}
      {count !== undefined && <span className="ml-1.5 font-semibold text-xs bg-black/20 px-1.5 py-0.5 rounded-full">{count}</span>}
    </Badge>
  );
};

const FindingIcon = ({ tool }: { tool: string }) => {
  const t = tool.toLowerCase();
  if (t.includes('sca') || t.includes('dependency')) return <Package className="h-4 w-4 text-blue-400" />;
  if (t.includes('sast') || t.includes('semgrep')) return <Code className="h-4 w-4 text-yellow-400" />;
  if (t.includes('dast') || t.includes('zap') || t.includes('nikto')) return <Globe className="h-4 w-4 text-red-400" />;
  if (t.includes('container') || t.includes('trivy')) return <Package className="h-4 w-4 text-green-400" />;
  return <Network className="h-4 w-4 text-gray-400" />;
};

// --- Main Page Component ---

export const ScanDetailPage = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const { data: scan, isLoading, isError, error } = useGetScanById(scanId || '');
  
  // Ref for the markdown content container (for PDF generation)
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `Sentinel_Report_${scan?.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt as any).from(element).save();
  };

  if (isLoading) return (
    <div className="flex h-[80vh] justify-center items-center flex-col gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-accent-gold"/>
      <p className="text-muted-foreground animate-pulse">Loading scan results...</p>
    </div>
  );

  if (isError || !scan) return (
    <Alert variant="destructive" className="bg-red-950 border-red-900 text-red-200">
      <AlertCircle className="h-4 w-4"/>
      <AlertTitle>Error Loading Report</AlertTitle>
      <AlertDescription>{error?.message || "Scan not found"}</AlertDescription>
    </Alert>
  );

  // Calculate summary counts
  const summaryCounts = scan.findings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {} as Record<ScanSeverity, number>);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border border-border">
        <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Scan Report</h1>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                {scan.id.split('-')[0]}...
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="truncate max-w-[300px]">{scan.targetUrl || scan.sourceCodePath || 'Unknown Target'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                <span className="capitalize">{scan.status.toLowerCase()}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div>{format(new Date(scan.createdAt), 'PPP p')}</div>
            </div>
        </div>
        <Button onClick={handleDownloadPdf} className="bg-accent-gold text-primary-dark hover:bg-accent-gold/90 font-semibold shadow-lg shadow-accent-gold/10">
            <Download className="mr-2 h-4 w-4"/> Export PDF
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="summary" className="w-full space-y-6">
        <TabsList className="bg-card border border-border p-1 h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger value="summary" className="data-[state=active]:bg-primary-light data-[state=active]:text-accent-gold px-6 py-2">Summary</TabsTrigger>
            <TabsTrigger value="findings" className="data-[state=active]:bg-primary-light data-[state=active]:text-accent-gold px-6 py-2">Detailed Findings</TabsTrigger>
            <TabsTrigger value="ai-report" className="data-[state=active]:bg-primary-light data-[state=active]:text-accent-gold px-6 py-2">AI Executive Report</TabsTrigger>
            <TabsTrigger value="attack-path" className="data-[state=active]:bg-primary-light data-[state=active]:text-accent-gold px-6 py-2">Attack Path</TabsTrigger>
        </TabsList>

        {/* 1. Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <Card className="bg-card border-border">
               <CardContent className="p-6 flex flex-col items-center justify-center">
                 <SeverityBadge severity="CRITICAL" count={summaryCounts.CRITICAL || 0} />
               </CardContent>
             </Card>
             <Card className="bg-card border-border">
               <CardContent className="p-6 flex flex-col items-center justify-center">
                 <SeverityBadge severity="HIGH" count={summaryCounts.HIGH || 0} />
               </CardContent>
             </Card>
             <Card className="bg-card border-border">
               <CardContent className="p-6 flex flex-col items-center justify-center">
                 <SeverityBadge severity="MEDIUM" count={summaryCounts.MEDIUM || 0} />
               </CardContent>
             </Card>
             <Card className="bg-card border-border">
               <CardContent className="p-6 flex flex-col items-center justify-center">
                 <SeverityBadge severity="LOW" count={summaryCounts.LOW || 0} />
               </CardContent>
             </Card>
             <Card className="bg-card border-border">
               <CardContent className="p-6 flex flex-col items-center justify-center">
                 <SeverityBadge severity="INFO" count={summaryCounts.INFO || 0} />
               </CardContent>
             </Card>
          </div>
          
          <Card className="bg-card border-border">
             <CardHeader>
               <CardTitle>Scan Configuration</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
               <div className="flex justify-between py-2 border-b border-border">
                 <span className="text-muted-foreground">Profile</span>
                 <span className="font-mono text-foreground uppercase">{scan.profile}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-border">
                 <span className="text-muted-foreground">Job ID</span>
                 <span className="font-mono text-foreground">{scan.id}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-border">
                 <span className="text-muted-foreground">Duration</span>
                 <span className="font-mono text-foreground">
                   {scan.completedAt 
                     ? `${Math.round((new Date(scan.completedAt).getTime() - new Date(scan.createdAt).getTime()) / 1000)}s` 
                     : 'In Progress'}
                 </span>
               </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Findings Tab */}
        <TabsContent value="findings" className="mt-0">
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Detailed Findings ({scan.findings.length})</CardTitle>
                    <CardDescription>Technical details of all discovered vulnerabilities.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full space-y-2">
                        {scan.findings.map((finding: ScanFinding, index: number) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4 bg-primary-dark/30">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-4 text-left w-full">
                                        <FindingIcon tool={finding.tool} />
                                        <SeverityBadge severity={finding.severity} />
                                        <span className="font-medium flex-1 pr-4 truncate">{finding.title}</span>
                                        <span className="text-xs text-muted-foreground font-mono hidden md:inline-block">{finding.tool}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-6 border-t border-border/50 mt-2">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Description</h4>
                                            <p className="text-sm text-foreground leading-relaxed">{finding.details}</p>
                                        </div>
                                        <div className="space-y-4">
                                            {finding.location && (
                                                <div className="bg-black/30 p-3 rounded border border-border/50 font-mono text-xs break-all">
                                                    <span className="text-accent-blue">LOCATION:</span> {finding.location}
                                                </div>
                                            )}
                                            {finding.remediation && (
                                                 <div className="space-y-1">
                                                    <h4 className="text-xs font-bold uppercase text-accent-gold tracking-wider">Remediation</h4>
                                                    <p className="text-sm text-foreground/90">{finding.remediation}</p>
                                                 </div>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        {scan.findings.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No vulnerabilities found.</p>
                            </div>
                        )}
                     </Accordion>
                </CardContent>
            </Card>
        </TabsContent>

        {/* 3. AI Report Tab (Markdown) */}
        <TabsContent value="ai-report" className="mt-0">
            <Card className="bg-white text-black border-none overflow-hidden shadow-xl">
                <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-gray-900">Executive Security Report</CardTitle>
                            <CardDescription className="text-gray-500">Generated by Gemini 1.5 Flash</CardDescription>
                        </div>
                        <FileText className="text-gray-300 h-8 w-8" />
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12 bg-white min-h-[600px]">
                    {/* This div is what gets printed to PDF */}
                    <div ref={reportRef} className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-blue-600">
                        {scan.aiReportText ? (
                            <ReactMarkdown>{scan.aiReportText}</ReactMarkdown>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <Loader2 className="h-8 w-8 animate-spin mb-4 text-gray-300" />
                                <p>AI report is being generated or is unavailable.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* 4. Attack Path Tab */}
        <TabsContent value="attack-path" className="mt-0">
           <AnimatedAttackPath />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanDetailPage;