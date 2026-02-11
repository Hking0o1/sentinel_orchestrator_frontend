import React from 'react';
import { Network, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface AnimatedAttackPathProps {
  analysisText?: string | null;
}

export const AnimatedAttackPath: React.FC<AnimatedAttackPathProps> = ({ analysisText }) => {
  const content = (analysisText || '').trim();

  if (!content) {
    return (
      <Card className="bg-primary-light border-neutral-700 text-neutral-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="text-accent-blue" />
            AI Attack Path
          </CardTitle>
          <CardDescription className="text-neutral-400">
            No attack path analysis was generated for this scan.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Card className="bg-primary-light border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="text-accent-blue" />
          AI Attack Path
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Generated exploit chain and mitigations from correlated findings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lines.map((line, idx) => {
          const isStep = /^\d+\./.test(line);
          return (
            <div
              key={`${idx}-${line.slice(0, 16)}`}
              className={`rounded-md border p-3 text-sm ${
                isStep
                  ? 'border-accent-gold/30 bg-accent-gold/5 text-neutral-100'
                  : 'border-neutral-700 bg-primary-dark/40 text-neutral-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {isStep ? <ShieldAlert className="mt-0.5 h-4 w-4 text-accent-gold" /> : null}
                <span>{line}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AnimatedAttackPath;
