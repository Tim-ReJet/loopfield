"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getCorpus, SOURCE_COLORS } from "@/lib/corpus";
import { useConstellation } from "@/lib/store";
import { getVisitorId } from "@/lib/visitor";
import { findTopCandidates } from "@loopfield/engine";

export default function ConstellationPage() {
  const store = useMemo(() => getCorpus(), []);
  const nodeIds = useConstellation((s) => s.nodeIds);
  const setAll = useConstellation((s) => s.setAll);
  const clear = useConstellation((s) => s.clear);
  const [visitorId, setVisitorId] = useState("");
  const save = useMutation(api.constellations.save);
  const remote = useQuery(
    api.constellations.get,
    visitorId ? { visitorId } : "skip",
  );
  const [syncNote, setSyncNote] = useState("");

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  useEffect(() => {
    if (remote?.nodeIds?.length && nodeIds.length === 0) {
      setAll(remote.nodeIds);
    }
  }, [remote, nodeIds.length, setAll]);

  const nodes = nodeIds
    .map((id) => store.nodeById.get(id))
    .filter(Boolean);

  const suggestions = useMemo(() => {
    if (nodeIds.length < 1) return [];
    const scores = findTopCandidates(store, 8, 0.15);
    return scores
      .filter(
        (s) =>
          (nodeIds.includes(s.nodeA) || nodeIds.includes(s.nodeB)) &&
          !(nodeIds.includes(s.nodeA) && nodeIds.includes(s.nodeB)),
      )
      .slice(0, 5);
  }, [nodeIds, store]);

  const matchingLoops = store.loops.filter((loop) =>
    loop.impacts.some((id) => nodeIds.includes(id)),
  );

  async function handleSync() {
    if (!visitorId) return;
    await save({ visitorId, nodeIds });
    setSyncNote("Synced to the cloud for this device.");
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-4xl px-6 pb-20 pt-28">
      <h1 className="font-display text-5xl text-white">Your constellation</h1>
      <p className="mt-3 text-white/60">
        Patterns you marked &ldquo;I know this.&rdquo; Local first — sync when
        you want continuity across sessions.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSync}
          className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-medium text-black"
        >
          Sync constellation
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70"
        >
          Clear
        </button>
        <Link
          href="/field"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70"
        >
          Back to field
        </Link>
      </div>
      {syncNote && (
        <p className="mt-3 text-sm text-cyan-100/80">{syncNote}</p>
      )}

      {nodes.length === 0 ? (
        <p className="mt-12 text-white/50">
          Empty sky. Open the field and tap{" "}
          <span className="text-cyan-200">I know this</span> on patterns that
          land.
        </p>
      ) : (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {nodes.map((n) =>
            n ? (
              <li
                key={n.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: SOURCE_COLORS[n.source] }}
                  />
                  <span className="font-medium text-white">{n.title}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-white/55">
                  {n.brief}
                </p>
              </li>
            ) : null,
          )}
        </ul>
      )}

      {matchingLoops.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.25em] text-white/45">
            Loops touching your sky
          </h2>
          <ul className="mt-4 space-y-2">
            {matchingLoops.slice(0, 8).map((loop) => (
              <li key={loop.id}>
                <Link
                  href={`/loops/${loop.id}`}
                  className="text-cyan-100 hover:underline"
                >
                  {loop.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xs uppercase tracking-[0.25em] text-white/45">
            Suggested neighbors
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {suggestions.map((s) => {
              const other = nodeIds.includes(s.nodeA) ? s.nodeB : s.nodeA;
              const node = store.nodeById.get(other);
              return (
                <li key={`${s.nodeA}-${s.nodeB}`}>
                  {node?.title ?? other}{" "}
                  <span className="text-white/35">
                    ({Math.round(s.score * 100)}% structural)
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
