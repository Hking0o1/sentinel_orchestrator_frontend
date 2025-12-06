import { useState, useMemo } from 'react';
import { useGetAllFindings } from '@/hooks/useScans';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ScanSeverity } from '@/types/scan';

// Reuse our SeverityBadge helper (best practice: move this to a shared component file later)
const SeverityBadge = ({ severity }: { severity: ScanSeverity }) => {
  const config = {
    CRITICAL: { icon: ShieldAlert, color: 'bg-red-900/50 text-red-200 border-red-800', text: 'Critical' },
    HIGH: { icon: ShieldAlert, color: 'bg-orange-900/50 text-orange-200 border-orange-800', text: 'High' },
    MEDIUM: { icon: ShieldCheck, color: 'bg-yellow-900/50 text-yellow-200 border-yellow-800', text: 'Medium' },
    LOW: { icon: ShieldCheck, color: 'bg-blue-900/50 text-blue-200 border-blue-800', text: 'Low' },
    INFO: { icon: FileText, color: 'bg-gray-800 text-gray-300 border-gray-700', text: 'Info' },
  };
  // @ts-expect-error
  const { icon: Icon, color, text } = config[severity] || config.INFO;
  return (
    <Badge variant="outline" className={`capitalize ${color} flex items-center gap-1 w-fit`}>
      <Icon className="h-3 w-3" />
      {text}
    </Badge>
  );
};

export const VulnerabilitiesPage = () => {
  const { data: findings, isLoading, isError, error } = useGetAllFindings();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredFindings = useMemo(() => {
    if (!findings) return [];
    return findings.filter((f) =>
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.location && f.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [findings, searchTerm]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!findings) return { total: 0, critical: 0, high: 0 };
    return {
      total: findings.length,
      critical: findings.filter(f => f.severity === 'CRITICAL').length,
      high: findings.filter(f => f.severity === 'HIGH').length
    };
  }, [findings]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="bg-red-950 border-red-900 text-red-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Findings</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
          <p className="text-lg text-muted-foreground">
            Global view of security findings across all projects.
          </p>
        </div>
        <div className="flex gap-4">
            <Card className="bg-card border-border p-4 w-32">
                <div className="text-xs text-muted-foreground uppercase font-bold">Total</div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </Card>
            <Card className="bg-card border-border p-4 w-32">
                <div className="text-xs text-red-400 uppercase font-bold">Critical</div>
                <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            </Card>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Active Findings</CardTitle>
                <CardDescription>Search and filter discovered issues.</CardDescription>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search vulnerabilities..." 
                    className="pl-9 bg-primary-dark border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-accent/50">
                <TableHead className="text-muted-foreground">Severity</TableHead>
                <TableHead className="text-muted-foreground">Vulnerability</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Tool</TableHead>
                <TableHead className="text-right text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFindings.length > 0 ? (
                filteredFindings.map((finding, idx) => (
                  <TableRow key={idx} className="border-border hover:bg-accent/50">
                    <TableCell>
                      <SeverityBadge severity={finding.severity} />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                        {finding.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs max-w-[300px] truncate" title={finding.location || ''}>
                        {finding.location || 'N/A'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {finding.tool}
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Details</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No findings match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VulnerabilitiesPage;