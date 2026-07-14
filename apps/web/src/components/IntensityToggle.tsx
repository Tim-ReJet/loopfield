"use client";

import { useIntensity, type Intensity } from "@/lib/store";
import { cn } from "@/lib/cn";

const OPTIONS: { id: Intensity; label: string }[] = [
  { id: "full", label: "Full" },
  { id: "calm", label: "Calm" },
  { id: "reduced", label: "Still" },
];

export function IntensityToggle({ className }: { className?: string }) {
  const intensity = useIntensity((s) => s.intensity);
  const setIntensity = useIntensity((s) => s.setIntensity);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Visual intensity"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setIntensity(opt.id)}
          className={cn(
            "rounded-full px-3 py-1 text-xs tracking-wide transition",
            intensity === opt.id
              ? "bg-cyan-300/90 text-black"
              : "text-white/70 hover:text-white",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
