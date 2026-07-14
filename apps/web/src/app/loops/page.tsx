import Link from "next/link";
import { getCorpus, HERO_LOOP_IDS } from "@/lib/corpus";

export default function LoopsIndexPage() {
  const store = getCorpus();
  return (
    <main className="mx-auto min-h-[100dvh] max-w-5xl px-6 pb-20 pt-28">
      <h1 className="font-display text-5xl text-white">Loops</h1>
      <p className="mt-3 max-w-2xl text-white/60">
        Feedback arcs that compound across patterns. Featured rides first —
        then the full atlas of {store.loops.length}.
      </p>

      <h2 className="mt-12 text-xs uppercase tracking-[0.25em] text-cyan-300/70">
        Featured rides
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {HERO_LOOP_IDS.map((id) => {
          const loop = store.loops.find((l) => l.id === id);
          if (!loop) return null;
          return (
            <Link
              key={id}
              href={`/loops/${id}`}
              className="rounded-3xl border border-cyan-300/25 bg-cyan-300/5 p-5 hover:bg-cyan-300/10"
            >
              <h3 className="font-display text-2xl">{loop.name}</h3>
              <p className="mt-2 text-sm text-white/55">{loop.role}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-14 text-xs uppercase tracking-[0.25em] text-white/45">
        Full atlas
      </h2>
      <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10">
        {store.loops.map((loop) => (
          <li key={loop.id}>
            <Link
              href={`/loops/${loop.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5"
            >
              <div>
                <div className="text-white">{loop.name}</div>
                <div className="text-sm text-white/45">{loop.role}</div>
              </div>
              <span className="text-sm text-cyan-200/70">Ride →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
