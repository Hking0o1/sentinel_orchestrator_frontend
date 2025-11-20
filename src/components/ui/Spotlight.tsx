"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

// ---- Safe Client-Only Stable ID Generator ----
function useStableId(prefix = "spotlight") {
  const [id] = React.useState(() => `${prefix}-${Math.random().toString(36).slice(2)}`);
  return id;
}
// ----------------------------------------------

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  const filterId = useStableId(); // safe for React 18/19 + Next.js

  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-1 h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter={`url(#${filterId})`}>
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        />
      </g>

      <defs>
        <filter
          id={filterId}
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
};
