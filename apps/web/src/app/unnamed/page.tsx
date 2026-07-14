"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getCorpus } from "@/lib/corpus";
import { useMemo } from "react";
import Link from "next/link";

export default function UnnamedPage() {
  const mapped = useQuery(api.submissions.listMapped);
  const store = useMemo(() => getCorpus(), []);

  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-6 pb-20 pt-28">
      <h1 className="font-display text-5xl text-white">The Unnamed</h1>
      <p className="mt-3 text-white/60">
        Experiences that have been recognized and queued for full scientific
        mapping. Not a diagnosis feed — a naming workshop.
      </p>
      <Link
        href="/contribute"
        className="mt-6 inline-block rounded-full bg-[#ff9b7a] px-5 py-2 text-sm font-medium text-black"
      >
        Contribute one
      </Link>

      <div className="mt-12 space-y-4">
        {!mapped && (
          <p className="text-white/45">Loading mapped submissions…</p>
        )}
        {mapped && mapped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-white/50">
            Nothing mapped yet. Early corpus growth — your submission can be
            first.
          </p>
        )}
        {mapped?.map((item) => (
          <article
            key={item._id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="whitespace-pre-wrap text-white/80">{item.text}</p>
            {item.relatedNodeIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.relatedNodeIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/50"
                  >
                    {store.nodeById.get(id)?.title ?? id}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
