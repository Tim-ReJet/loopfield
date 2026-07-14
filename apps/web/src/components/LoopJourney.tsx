"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { getCorpus, SOURCE_COLORS, HERO_LOOP_IDS } from "@/lib/corpus";
import { useIntensity } from "@/lib/store";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

export function LoopJourney({ loopId }: { loopId: string }) {
  const store = useMemo(() => getCorpus(), []);
  const loop = store.loops.find((l) => l.id === loopId);
  const intensity = useIntensity((s) => s.intensity);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showNeuro, setShowNeuro] = useState(false);

  useEffect(() => {
    if (!rootRef.current || !loop || intensity === "reduced") return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(".loop-step");
      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 40%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
        gsap.fromTo(
          el,
          { opacity: 0.25, y: 40 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 40%",
              scrub: intensity === "calm" ? 1.2 : 0.6,
            },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [loop, intensity]);

  if (!loop) {
    return (
      <div className="p-10 text-white">
        Loop not found.{" "}
        <Link href="/loops" className="underline">
          Browse loops
        </Link>
      </div>
    );
  }

  const impactNodes = loop.impacts
    .map((id) => store.nodeById.get(id))
    .filter(Boolean);

  return (
    <div ref={rootRef} className="relative bg-[#07090f] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07090f]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">
              {loop.role}
            </p>
            <h1 className="font-display text-2xl md:text-3xl">{loop.name}</h1>
          </div>
          <Link
            href={`/field?loop=${loop.id}`}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-medium text-black"
          >
            See in field
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1fr_280px]">
        <div>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/75">
            {loop.desc}
          </p>
          <ol className="space-y-16">
            {loop.steps.map((step, i) => (
              <li
                key={`${step.label}-${i}`}
                className={cn(
                  "loop-step relative border-l-2 pl-6 transition",
                  active === i ? "border-cyan-300" : "border-white/15",
                )}
              >
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                  Step {i + 1}
                </span>
                <h2 className="font-display text-3xl text-white">{step.label}</h2>
                <p className="mt-2 text-sm capitalize text-white/50">
                  Source signal: {step.source}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="md:sticky md:top-28 md:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">
              Pattern nodes
            </h3>
            <ul className="space-y-2">
              {impactNodes.map((n) =>
                n ? (
                  <li key={n.id} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: SOURCE_COLORS[n.source] }}
                    />
                    <span>{n.title}</span>
                  </li>
                ) : null,
              )}
            </ul>
            <button
              type="button"
              onClick={() => setShowNeuro((v) => !v)}
              className="mt-4 w-full rounded-full border border-white/15 px-3 py-2 text-sm text-white/70 hover:text-white"
            >
              {showNeuro ? "Hide" : "Show"} why this happens
            </button>
            {showNeuro && impactNodes[0] && (
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {impactNodes[0].neuro.normal} Under AuDHD load,{" "}
                {impactNodes[0].neuro.adhd} Meanwhile,{" "}
                {impactNodes[0].neuro.asd}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Other rides
            </p>
            {HERO_LOOP_IDS.filter((id) => id !== loop.id).map((id) => {
              const other = store.loops.find((l) => l.id === id);
              if (!other) return null;
              return (
                <Link
                  key={id}
                  href={`/loops/${id}`}
                  className="block rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 hover:border-cyan-300/40 hover:text-white"
                >
                  {other.name}
                </Link>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
  );
}
