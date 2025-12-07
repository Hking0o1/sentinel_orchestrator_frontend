import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import cronstrue from 'cronstrue';
import {
  useGetSchedules,
  useCreateSchedule,
  useDeleteSchedule,
} from '@/hooks/useSchedules';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PlusCircle, CalendarClock, Trash2, AlertCircle } from 'lucide-react';

// --- Validation Schema ---
const scheduleFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  crontab: z.string().regex(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/, {
    message: "Invalid cron expression (e.g., '0 2 * * *')",
  }),
  profile: z.enum(['developer', 'web', 'full']),
  target_url: z.string().optional(),
  source_code_path: z.string().optional(),
}).refine((data) => {
    if (data.profile === 'web' || data.profile === 'full') {
      return !!data.target_url;
    }
    return true;
}, { message: "Target URL required for Web/Full profiles", path: ['target_url'] });

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export const SchedulesPage = () => {
  const { data: schedules, isLoading, isError, error } = useGetSchedules();
  const createMutation = useCreateSchedule();
  const deleteMutation = useDeleteSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: '',
      crontab: '0 2 * * *', // Default: 2 AM daily
      profile: 'web',
      target_url: '',
      source_code_path: '',
    },
  });

  const onSubmit = (values: ScheduleFormValues) => {
    createMutation.mutate({
      ...values,
      isActive: true,
      description: 'Created via Dashboard'
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.reset();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-accent-gold" /></div>;

  if (isError) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error?.message}</AlertDescription></Alert>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheduled Scans</h1>
          <p className="text-lg text-muted-foreground">Manage recurring security jobs.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gold text-primary-dark font-bold hover:bg-accent-gold/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Scan Schedule</DialogTitle>
              <DialogDescription>Configure a recurring scan job.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Name</FormLabel>
                      <FormControl><Input placeholder="Weekly Production Scan" {...field} className="bg-background" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crontab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency (Cron)</FormLabel>
                      <FormControl><Input placeholder="0 2 * * *" {...field} className="bg-background" /></FormControl>
                      <div className="text-xs text-muted-foreground">
                        {tryParseCron(field.value)}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target URL</FormLabel>
                      <FormControl><Input placeholder="https://example.com" {...field} className="bg-background" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground">
                    {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schedules?.map((schedule) => (
          <Card key={schedule.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-foreground">{schedule.name}</CardTitle>
                <CardDescription className="text-xs font-mono">{schedule.crontab}</CardDescription>
              </div>
              <Badge variant={schedule.isActive ? 'default' : 'secondary'} className={schedule.isActive ? 'bg-green-900 text-green-100' : ''}>
                {schedule.isActive ? 'Active' : 'Paused'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <CalendarClock className="h-4 w-4 text-accent-gold" />
                  <span>{tryParseCron(schedule.crontab)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Target: </span>
                  <span className="font-medium text-foreground">{schedule.targetUrl || 'Local Code'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Profile: </span>
                  <span className="uppercase text-xs font-bold tracking-wide">{schedule.profile}</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleDelete(schedule.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {schedules?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
            No active schedules found. Create one to automate your security scans.
          </div>
        )}
      </div>
    </div>
  );
};

function tryParseCron(cron: string) {
  try {
    return cronstrue.toString(cron);
  } catch (e) {
    return "Invalid cron expression"+e;
  }
}

export default SchedulesPage;