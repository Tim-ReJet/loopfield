"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Node } from "@loopfield/engine";
import { SOURCE_COLORS } from "@/lib/corpus";
import { useConstellation } from "@/lib/store";
import { getVisitorId } from "@/lib/visitor";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function NodeDrawer({
  node,
  onClose,
}: {
  node: Node | null;
  onClose: () => void;
}) {
  const [depth, setDepth] = useState<"felt" | "lenses" | "neuro">("felt");
  const [visitorId, setVisitorId] = useState("");
  const toggle = useConstellation((s) => s.toggle);
  const inConstellation = useConstellation((s) =>
    node ? s.nodeIds.includes(node.id) : false,
  );
  const vote = useMutation(api.resonance.vote);
  const counts = useQuery(
    api.resonance.countsForNode,
    node ? { nodeId: node.id } : "skip",
  );

  useEffect(() => {
    setVisitorId(getVisitorId());
    setDepth("felt");
  }, [node?.id]);

  async function handleVote(signal: "know" | "not_me" | "close") {
    if (!node || !visitorId) return;
    await vote({ nodeId: node.id, signal, visitorId });
    if (signal === "know") toggle(node.id);
  }

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="pointer-events-auto absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0d14]/95 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: SOURCE_COLORS[node.source] }}
                />
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                  {node.source === "both" ? "AuDHD intersection" : node.source}
                </span>
              </div>
              <h2 className="font-display text-2xl text-white">{node.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="flex gap-1 border-b border-white/10 p-2">
            {(
              [
                ["felt", "Felt"],
                ["lenses", "Lenses"],
                ["neuro", "Why"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDepth(id)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-2 text-sm transition",
                  depth === id
                    ? "bg-white/10 text-cyan-200"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-[15px] leading-relaxed text-white/80">
            {depth === "felt" && <p>{node.brief}</p>}
            {depth === "lenses" && (
              <div className="space-y-4">
                <section>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-[#ff9b7a]">
                    ADHD lens
                  </h3>
                  <p>{node.adhd}</p>
                </section>
                <section>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-[#5ec8d8]">
                    ASD lens
                  </h3>
                  <p>{node.asd}</p>
                </section>
                <section>
                  <h3 className="mb-1 text-xs uppercase tracking-widest text-[#d4c4f0]">
                    Combined
                  </h3>
                  <p>{node.combined}</p>
                </section>
              </div>
            )}
            {depth === "neuro" && (
              <div className="space-y-3">
                <p>
                  <span className="text-white/45">Regions — </span>
                  {node.neuro.regions}
                </p>
                <p>
                  <span className="text-white/45">Typical — </span>
                  {node.neuro.normal}
                </p>
                <p>
                  <span className="text-white/45">ADHD — </span>
                  {node.neuro.adhd}
                </p>
                <p>
                  <span className="text-white/45">ASD — </span>
                  {node.neuro.asd}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-white/10 p-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleVote("know")}
                className="flex-1 rounded-full bg-cyan-300/90 px-3 py-2 text-sm font-medium text-black"
              >
                I know this
                {counts ? ` · ${counts.know}` : ""}
              </button>
              <button
                type="button"
                onClick={() => handleVote("close")}
                className="rounded-full border border-white/20 px-3 py-2 text-sm text-white/80"
              >
                Close
                {counts ? ` · ${counts.close}` : ""}
              </button>
              <button
                type="button"
                onClick={() => handleVote("not_me")}
                className="rounded-full border border-white/20 px-3 py-2 text-sm text-white/80"
              >
                Not me
                {counts ? ` · ${counts.not_me}` : ""}
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggle(node.id)}
              className={cn(
                "w-full rounded-full border px-3 py-2 text-sm transition",
                inConstellation
                  ? "border-peach-400/50 bg-[#ff9b7a]/15 text-[#ffc9b5]"
                  : "border-white/15 text-white/70",
              )}
            >
              {inConstellation
                ? "In your constellation"
                : "Add to constellation"}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
