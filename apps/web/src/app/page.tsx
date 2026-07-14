"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShaderHero } from "@/components/ShaderHero";
import { HERO_LOOP_IDS, getCorpus } from "@/lib/corpus";
import { useMemo } from "react";

export default function HomePage() {
  const loops = useMemo(() => {
    const store = getCorpus();
    return HERO_LOOP_IDS.map((id) => store.loops.find((l) => l.id === id)).filter(
      Boolean,
    );
  }, []);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <ShaderHero className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#07090f]" />

      <section className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
            AuDHD recognition map
          </p>
          <h1 className="font-display text-6xl leading-[0.95] text-white md:text-8xl">
            Loopfield
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70 md:text-xl">
            Find the loops you already live in — subtle patterns at the ADHD ×
            autism intersection, grounded in mechanisms, told in felt language.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/field"
              className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-medium text-black"
            >
              Enter the field
            </Link>
            <Link
              href={`/loops/${HERO_LOOP_IDS[0]}`}
              className="rounded-full border border-white/25 bg-black/30 px-6 py-3 text-sm text-white backdrop-blur"
            >
              Ride a loop
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-[#07090f] px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl text-white md:text-4xl">
            Start with a story you might already know
          </h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Three cinematic rides through loops that rarely get spoken fully —
            then step into the live field of 44 patterns.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {loops.map((loop) =>
              loop ? (
                <Link
                  key={loop.id}
                  href={`/loops/${loop.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-peach-300 text-[#ff9b7a]">
                    {loop.role}
                  </p>
                  <h3 className="font-display mt-3 text-2xl text-white group-hover:text-cyan-100">
                    {loop.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm text-white/55">
                    {loop.desc}
                  </p>
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
