"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Node } from "@loopfield/engine";
import { PatternField } from "./PatternField";
import { NodeDrawer } from "./NodeDrawer";
import { getCorpus } from "@/lib/corpus";

export function FieldExperience() {
  const params = useSearchParams();
  const loop = params.get("loop");
  const [selected, setSelected] = useState<Node | null>(null);
  const store = useMemo(() => getCorpus(), []);
  const highlightIds = useMemo(() => {
    if (!loop) return undefined;
    return store.loops.find((l) => l.id === loop)?.impacts;
  }, [loop, store]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#07090f]">
      <PatternField
        onSelect={setSelected}
        highlightIds={highlightIds}
        focusLoopId={loop}
      />
      <NodeDrawer node={selected} onClose={() => setSelected(null)} />
      <div className="pointer-events-none absolute bottom-6 left-6 z-20 max-w-sm rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white/70 backdrop-blur-md">
        Drag to orbit. Scroll to zoom. Click a node to open felt language —
        science is one tap deeper.
      </div>
    </div>
  );
}
