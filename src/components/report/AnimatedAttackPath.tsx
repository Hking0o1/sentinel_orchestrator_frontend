import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Network, User, ShieldAlert, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
/**
 * AnimatedAttackPath Component
 *
 * This component visualizes a potential attack path using GSAP animations.
 * It's designed to be embedded in the ScanDetailPage.
 *
 * This is a placeholder/mockup and would be driven by real data in a full implementation.
 */
export const AnimatedAttackPath: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const attackerRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<HTMLDivElement>(null);
  const vulnRef = useRef<HTMLDivElement>(null);
  const path2Ref = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure all elements are mounted
    if (
      !containerRef.current ||
      !attackerRef.current ||
      !path1Ref.current ||
      !vulnRef.current ||
      !path2Ref.current ||
      !targetRef.current
    ) {
      return;
    }

    // Set initial states (invisible)
    gsap.set(
      [
        attackerRef.current,
        vulnRef.current,
        targetRef.current,
        path1Ref.current,
        path2Ref.current,
      ],
      { opacity: 0 }
    );
    gsap.set(path1Ref.current, { width: 0 });
    gsap.set(path2Ref.current, { width: 0 });
    gsap.set([attackerRef.current, vulnRef.current, targetRef.current], {
      y: 20,
      scale: 0.9,
    });

    // Create the animation timeline
    const tl = gsap.timeline({ delay: 0.5 });

    tl
      // 1. Attacker appears
      .to(attackerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      })
      // 2. First path "draws"
      .to(path1Ref.current, {
        opacity: 1,
        width: '100%',
        duration: 1,
        ease: 'power2.inOut',
      })
      // 3. Vulnerability is revealed
      .to(vulnRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      })
      // 4. Second path "draws"
      .to(path2Ref.current, {
        opacity: 1,
        width: '100%',
        duration: 1,
        ease: 'power2.inOut',
      })
      // 5. Target is compromised
      .to(targetRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      });

    // Cleanup function to kill the timeline on unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Card className="bg-primary-light border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="text-accent-blue" />
          AI-Generated Attack Path
        </CardTitle>
        <CardDescription className="text-neutral-400">
          A visual representation of the most likely attack vector.
        </CardDescription>
      </CardHeader>
      <CardContent
        ref={containerRef}
        className="flex flex-col md:flex-row items-center justify-center gap-4 p-8 min-h-[300px]"
      >
        {/* Node 1: Attacker */}
        <div
          ref={attackerRef}
          className="flex flex-col items-center gap-2 p-4 bg-primary-dark rounded-lg border border-neutral-700"
        >
          <User className="w-10 h-10 text-red-500" />
          <span className="font-semibold text-neutral-100">Attacker</span>
          <span className="text-xs text-neutral-400">External Threat</span>
        </div>

        {/* Path 1 */}
        <div
          ref={path1Ref}
          className="w-full md:w-0 h-1 md:h-0 md:flex-1 bg-neutral-600 border-t-2 border-b-2 border-neutral-600 border-dashed opacity-0"
        />

        {/* Node 2: Vulnerability */}
        <div
          ref={vulnRef}
          className="flex flex-col items-center gap-2 p-4 bg-primary-dark rounded-lg border border-neutral-700"
        >
          <ShieldAlert className="w-10 h-10 text-accent-gold" />
          <span className="font-semibold text-neutral-100">SQL Injection</span>
          <span className="text-xs text-neutral-400">High Severity</span>
        </div>

        {/* Path 2 */}
        <div
          ref={path2Ref}
          className="w-full md:w-0 h-1 md:h-0 md:flex-1 bg-neutral-600 border-t-2 border-b-2 border-neutral-600 border-dashed opacity-0"
        />

        {/* Node 3: Target */}
        <div
          ref={targetRef}
          className="flex flex-col items-center gap-2 p-4 bg-primary-dark rounded-lg border border-neutral-700"
        >
          <Database className="w-10 h-10 text-green-500" />
          <span className="font-semibold text-neutral-100">User Database</span>
          <span className="text-xs text-neutral-400">Compromised</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimatedAttackPath;

