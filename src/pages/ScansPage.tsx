import React from 'react';
import { useGetScanHistory, useStartScan } from '@/hooks/useScans';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Loader2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Play,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ScanJob, ScanSeverity, ScanProfile } from '@/types/scan';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

/**
 * ---------------------------------------------------------------------------
 * Reusable Helper Components (already defined in DashboardPage, but good to have here)
 * ---------------------------------------------------------------------------
 */
const SeverityBadge = ({ severity }: { severity: ScanSeverity }) => {
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
    <Badge className={`capitalize ${color} hover:${color}`}>
      <Icon className="mr-1 h-3 w-3" />
      {text}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: ScanJob['status'] }) => {
  const config: Record<string, string> = {
    PENDING: 'text-neutral-400',
    RUNNING: 'text-accent-blue',
    COMPLETED: 'text-green-400',
    FAILED: 'text-red-500',
  };
  const statusClass = config[status] || 'text-neutral-500'; // Fallback
  return (
    <span className={`font-medium ${statusClass}`}>
      {status}
    </span>
  );
};

/**
 * ---------------------------------------------------------------------------
 * Start New Scan Form
 * ---------------------------------------------------------------------------
 */

// 1. Define the validation schema for the new scan form
const scanFormSchema = z.object({
  // FIX 2: Updated Zod enum syntax for custom error messages
  profile: z.enum(['developer', 'web', 'full']).describe('A scan profile is required.'),
  targetUrl: z.string().optional(),
  sourceCodePath: z.string().optional(),
}).refine(
  (data) => {
    if (data.profile === 'web' || data.profile === 'full') {
      return !!data.targetUrl && z.string().url().safeParse(data.targetUrl).success;
    }
    return true;
  },
  {
    message: 'A valid Target URL is required for "web" and "full" profiles.',
    path: ['targetUrl'],
  }
).refine(
  (data) => {
    if (data.profile === 'developer' || data.profile === 'full') {
      return !!data.sourceCodePath && data.sourceCodePath.length > 0;
    }
    return true;
  },
  {
    message: 'A Source Code Path is required for "developer" and "full" profiles.',
    path: ['sourceCodePath'],
  }
);

type ScanFormValues = z.infer<typeof scanFormSchema>;

// The "Start New Scan" modal component
const StartScanModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [apiError, setApiError] = React.useState<string | null>(null);
  
  // 2. Get the mutation hook from React Query
  const startScanMutation = useStartScan();
  
  const form = useForm<ScanFormValues>({
    resolver: zodResolver(scanFormSchema),
    defaultValues: {
      profile: 'web',
      targetUrl: '',
      sourceCodePath: '',
    },
  });

  const selectedProfile = form.watch('profile');

  // 3. Handle form submission
  const onSubmit = async (values: ScanFormValues) => {
    setApiError(null);
    const payload = {
      profile: values.profile as ScanProfile,
      target_url: values.targetUrl || '',
      source_code_path: values.sourceCodePath || '',
    };
    
    // Trigger the mutation
    startScanMutation.mutate(payload, {
      // FIX 3: Use 'variables' (the payload) instead of 'data' (the response)
      // to access profile and target_url for the toast description.
      onSuccess: (data, variables) => {
        toast.success(`Scan job ${data.job_id} started successfully!`, {
          description: `Profile: ${variables.profile}, Target: ${variables.target_url || 'N/A'}`,
        });
        setOpen(false); // Close the dialog
        form.reset();
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        setApiError(message);
      },
    });
  };

  return (
    <DialogContent className="bg-primary-light border-neutral-700 text-neutral-100 sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-accent-gold">Start a New Scan</DialogTitle>
        <DialogDescription className="text-neutral-200">
          Configure and launch a new security scan job.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {apiError && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to Start Scan</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300">Scan Profile</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-primary-dark border-neutral-600">
                      <SelectValue placeholder="Select a scan profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-primary-light border-neutral-700 text-neutral-100">
                    <SelectItem value="developer">Developer (SAST + SCA)</SelectItem>
                    <SelectItem value="web">Web (DAST + Resilience)</SelectItem>
                    <SelectItem value="full">Full (All Scans)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(selectedProfile === 'web' || selectedProfile === 'full') && (
            <FormField
              control={form.control}
              name="targetUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Target URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://staging.my-app.com"
                      {...field}
                      className="bg-primary-dark border-neutral-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(selectedProfile === 'developer' || selectedProfile === 'full') && (
            <FormField
              control={form.control}
              name="sourceCodePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Source Code Path</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/app/src"
                      {...field}
                      className="bg-primary-dark border-neutral-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-neutral-700 border-neutral-600 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent-gold text-primary-dark font-bold hover:bg-accent-gold/90"
              disabled={startScanMutation.isPending}
            >
              {startScanMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Start Scan
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};


/**
 * ---------------------------------------------------------------------------
 * Main ScansPage Component
 * ---------------------------------------------------------------------------
 */
export const ScansPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // 4. Fetch data using our custom React Query hook
  const {
    data: scanHistory,
    isLoading,
    isError,
    error,
  } = useGetScanHistory();

  // 5. Handle Loading and Error states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-accent-gold" />
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive" className="bg-red-900/50 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load scan history</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unknown error occurred.'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!scanHistory || scanHistory.length === 0) {
      return (
        <div className="text-center text-neutral-400 p-10 bg-primary-light border-2 border-dashed border-neutral-700 rounded-lg">
          <FileText className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium text-neutral-100">No scans found</h3>
          <p className="mt-2">
            Get started by running your first scan.
          </p>
        </div>
      );
    }

    // 6. Render the full data table
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-700 hover:bg-primary-dark">
            <TableHead className="text-neutral-300">Target</TableHead>
            <TableHead className="text-neutral-300">Profile</TableHead>
            <TableHead className="text-neutral-300">Severity</TableHead>
            <TableHead className="text-neutral-300">Status</TableHead>
            <TableHead className="text-neutral-300">Date</TableHead>
            <TableHead className="text-right text-neutral-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scanHistory.map((scan) => (
            <TableRow
              key={scan.id}
              className="border-neutral-700 hover:bg-primary-dark"
            >
              <TableCell className="font-medium">
                {scan.target || 'N/A'}
              </TableCell>
              <TableCell className="capitalize">{scan.profile}</TableCell>
              <TableCell>
                <SeverityBadge severity={scan.highestSeverity} />
              </TableCell>
              <TableCell>
                <StatusBadge status={scan.status} />
              </TableCell>
              <TableCell>
                {scan.createdAt
                  ? format(new Date(scan.createdAt), 'dd MMM yyyy, h:mm a')
                  : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  className="text-accent-gold hover:text-accent-gold/80"
                  onClick={() => navigate(`/scans/${scan.id}`)}
                >
                  View Report
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* --- 1. Page Header --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100">Scan Management</h1>
          <p className="text-lg text-neutral-400">
            Review scan history and launch new scans.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gold text-primary-dark font-bold hover:bg-accent-gold/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Start New Scan
            </Button>
          </DialogTrigger>
          {/* We pass setOpen so the modal can close itself on success.
            We also mount it only when open to ensure the form resets.
          */}
          {isModalOpen && <StartScanModal setOpen={setIsModalOpen} />}
        </Dialog>
      </div>

      {/* --- 2. Main Content Table --- */}
      <div className="bg-primary-light border border-neutral-700 rounded-lg shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default ScansPage;

