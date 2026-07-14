"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NodeObject, LinkObject } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import { getCorpus, SOURCE_COLORS } from "@/lib/corpus";
import { useConstellation, useIntensity } from "@/lib/store";
import type { Node as CorpusNode } from "@loopfield/engine";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

type GraphNode = NodeObject & {
  id: string;
  title: string;
  source: "adhd" | "asd" | "both";
  brief: string;
};

type GraphLink = LinkObject & {
  source: string | GraphNode;
  target: string | GraphNode;
};

export function PatternField({
  onSelect,
  highlightIds,
  focusLoopId,
}: {
  onSelect: (node: CorpusNode) => void;
  highlightIds?: string[];
  focusLoopId?: string | null;
}) {
  const store = useMemo(() => getCorpus(), []);
  const intensity = useIntensity((s) => s.intensity);
  const constellation = useConstellation((s) => s.nodeIds);
  const fgRef = useRef<any>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = store.nodes.map((n) => ({
      id: n.id,
      title: n.title,
      source: n.source,
      brief: n.brief,
    }));
    const links: GraphLink[] = [];
    const seen = new Set<string>();
    for (const n of store.nodes) {
      for (const c of n.connects) {
        const key = [n.id, c].sort().join("|");
        if (seen.has(key)) continue;
        if (!store.nodeById.has(c)) continue;
        seen.add(key);
        links.push({ source: n.id, target: c });
      }
    }
    return { nodes, links };
  }, [store]);

  const activeHighlight = useMemo(() => {
    if (highlightIds?.length) return new Set(highlightIds);
    if (focusLoopId) {
      const loop = store.loops.find((l) => l.id === focusLoopId);
      return new Set(loop?.impacts ?? []);
    }
    return new Set(constellation);
  }, [highlightIds, focusLoopId, constellation, store.loops]);

  const nodeColor = useCallback(
    (node: GraphNode) => {
      const base = SOURCE_COLORS[node.source];
      if (activeHighlight.size === 0) return base;
      return activeHighlight.has(node.id) ? base : "#334155";
    },
    [activeHighlight],
  );

  const handleClick = useCallback(
    (node: GraphNode) => {
      const full = store.nodeById.get(node.id);
      if (full) onSelect(full);
    },
    [onSelect, store],
  );

  useEffect(() => {
    if (!fgRef.current || intensity === "reduced") return;
    const controls = fgRef.current.controls?.();
    if (controls) {
      controls.autoRotate = intensity === "full";
      controls.autoRotateSpeed = 0.4;
    }
  }, [intensity]);

  if (intensity === "reduced") {
    return (
      <div className="grid h-full max-h-[100dvh] grid-cols-2 gap-2 overflow-auto p-4 md:grid-cols-3 lg:grid-cols-4">
        {store.nodes.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n)}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            <div
              className="mb-2 h-2 w-2 rounded-full"
              style={{ background: SOURCE_COLORS[n.source] }}
            />
            <div className="text-sm font-medium text-white">{n.title}</div>
            <div className="mt-1 line-clamp-2 text-xs text-white/55">
              {n.brief}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      width={dims.w}
      height={dims.h}
      graphData={graphData}
      backgroundColor="#07090f"
      nodeRelSize={intensity === "calm" ? 4 : 5.5}
      nodeOpacity={0.95}
      nodeColor={(n) => nodeColor(n as GraphNode)}
      linkColor={() => "rgba(160,200,220,0.25)"}
      linkWidth={0.6}
      linkOpacity={0.4}
      linkDirectionalParticles={intensity === "full" ? 1 : 0}
      linkDirectionalParticleWidth={1.2}
      linkDirectionalParticleSpeed={0.004}
      cooldownTicks={90}
      onNodeClick={(n) => handleClick(n as GraphNode)}
      nodeThreeObject={(node) => {
        const n = node as GraphNode;
        const group = new THREE.Group();
        const geo = new THREE.SphereGeometry(3.2, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
          color: nodeColor(n),
          transparent: true,
          opacity: activeHighlight.size && !activeHighlight.has(n.id) ? 0.25 : 0.9,
        });
        group.add(new THREE.Mesh(geo, mat));
        if (intensity === "full" || activeHighlight.has(n.id)) {
          const label = new SpriteText(n.title);
          label.color = "#e8eef5";
          label.textHeight = 2.4;
          label.position.y = 6;
          group.add(label);
        }
        return group;
      }}
      nodeThreeObjectExtend={false}
    />
  );
}
