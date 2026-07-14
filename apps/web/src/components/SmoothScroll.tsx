"use client";

import { ReactLenis } from "lenis/react";
import { useIntensity } from "@/lib/store";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const intensity = useIntensity((s) => s.intensity);
  if (intensity === "reduced") return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: intensity === "calm" ? 0.08 : 0.12 }}>
      {children}
    </ReactLenis>
  );
}
