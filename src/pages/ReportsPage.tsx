import { useState, useMemo } from 'react';
import { useGetScanHistory } from '@/hooks/useScans';
import { downloadReportPDF } from '@/services/scanService'; // Import our new service
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Download, Loader2, AlertCircle, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import type { ScanJob } from '@/types/scan';
import { toast } from 'sonner'; // For notifications

export const ReportsPage = () => {
  const { data: allScans, isLoading, isError, error } = useGetScanHistory();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const reports = useMemo(() => {
    if (!allScans) return [];
    return allScans.filter((scan) => scan.status === 'COMPLETED');
  }, [allScans]);

  // --- NEW: Functional Download Handler ---
  const handleDownload = async (scanId: string) => {
    setDownloadingId(scanId);
    try {
      await downloadReportPDF(scanId);
      toast.success("Report downloaded successfully");
    } catch (err) {
      toast.error("Failed to download report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-900">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading reports</AlertTitle>
        <AlertDescription>{error?.message || 'Unknown error'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Reports</h1>
        <p className="text-lg text-muted-foreground">
          Archive of all generated executive security reports.
        </p>
      </div>

      {reports.length === 0 ? (
        <Card className="bg-card border-border border-dashed p-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No reports available</h3>
          <p className="text-muted-foreground">
            Complete a scan successfully to generate a report.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((scan: ScanJob) => (
            <Card key={scan.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div className="space-y-1.5">
                  <CardTitle className="text-base font-semibold text-primary group-hover:text-accent-gold transition-colors">
                    Scan Report
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-muted-foreground">
                    ID: {scan.id.slice(0, 8)}...
                  </CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-accent-gold/10 group-hover:text-accent-gold transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="truncate max-w-[200px]" title={scan.target}>
                      {scan.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {scan.createdAt 
                        ? format(new Date(scan.createdAt), 'PPP p') 
                        : 'Unknown Date'}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-border hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDownload(scan.id)}
                  disabled={downloadingId === scan.id}
                >
                  {downloadingId === scan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingId === scan.id ? "Downloading..." : "Download PDF"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;