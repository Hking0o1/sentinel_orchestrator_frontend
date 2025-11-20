"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
}

export function MovingBorderBtn({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 2000,
  className,
  ...otherProps
}: MovingBorderBtnProps) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-px overflow-hidden",
        containerClassName
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
      >
        <MovingBorder duration={duration} rx="20" ry="20">
          <div
            className={cn(
              "h-20 w-20 opacity-80 bg-[radial-gradient(var(--primary)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm",
          className
        )}
        
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "20",
  ry = "20",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const progress = useMotionValue(0);

  // Measure path when rendered
  useLayoutEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Animate progress along the full perimeter
  useAnimationFrame((time) => {
    if (!length) return;
    const pxPerMs = length / duration;
    progress.set((time * pxPerMs) % length);
  });

  const x = useTransform(progress, (v) =>
    pathRef.current?.getPointAtLength(v).x ?? 0
  );
  const y = useTransform(progress, (v) =>
    pathRef.current?.getPointAtLength(v).y ?? 0
  );

  const transform = useMotionTemplate`
    translateX(${x}px)
    translateY(${y}px)
    translate(-50%, -50%)
  `;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        {...otherProps}
      >
        {/* A real perimeter path so getPointAtLength works */}
        <path
          ref={pathRef}
          fill="none"
          stroke="transparent"
          d={`
            M ${rx},0
            H calc(100% - ${rx})
            A ${rx} ${ry} 0 0 1 100% ${ry}
            V calc(100% - ${ry})
            A ${rx} ${ry} 0 0 1 calc(100% - ${rx}) 100%
            H ${rx}
            A ${rx} ${ry} 0 0 1 0 calc(100% - ${ry})
            V ${ry}
            A ${rx} ${ry} 0 0 1 ${rx} 0
          `}
        />
      </svg>

      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
