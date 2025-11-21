import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export const VulnerabilitiesPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
        <p className="text-lg text-muted-foreground">
          Master list of all active security findings across all projects.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Active Findings
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-t border-border/50 mt-2">
          No vulnerabilities found (or this feature is under construction).
        </CardContent>
      </Card>
    </div>
  );
};

export default VulnerabilitiesPage;