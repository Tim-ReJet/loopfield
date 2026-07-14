"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getCorpus, SOURCE_COLORS } from "@/lib/corpus";
import { getVisitorId } from "@/lib/visitor";
import { cn } from "@/lib/cn";
import { useConvexAvailable } from "./Providers";

function ConvexSubmissionForm() {
  const store = useMemo(() => getCorpus(), []);
  const create = useMutation(api.submissions.create);
  const [text, setText] = useState("");
  const [related, setRelated] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  function toggleRelated(id: string) {
    setRelated((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id].slice(0, 12),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await create({
        text,
        relatedNodeIds: related,
        visitorId,
      });
      setStatus("done");
      setText("");
      setRelated([]);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="felt"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45"
        >
          What happens for you?
        </label>
        <textarea
          id="felt"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Describe the loop in your own words — the part that never had a name..."
          className="w-full rounded-2xl border border-white/15 bg-black/40 p-4 text-white outline-none ring-cyan-300/40 placeholder:text-white/35 focus:ring-2"
          required
          minLength={20}
        />
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">
          Related patterns (optional)
        </p>
        <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
          {store.nodes.map((n) => {
            const on = related.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => toggleRelated(n.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  on
                    ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 text-white/55 hover:border-white/30",
                )}
              >
                <span
                  className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: SOURCE_COLORS[n.source] }}
                />
                {n.title}
              </button>
            );
          })}
        </div>
      </div>

      {status === "done" && (
        <p className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          Received. It joins the Unnamed queue — we&apos;ll map it into the
          corpus when the science holds.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving" || text.trim().length < 20}
        className="rounded-full bg-[#ff9b7a] px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
      >
        {status === "saving" ? "Sending…" : "Add to the corpus"}
      </button>
    </form>
  );
}

function LocalDraftForm() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const drafts = JSON.parse(
      localStorage.getItem("loopfield-local-drafts") ?? "[]",
    ) as { text: string; at: number }[];
    drafts.push({ text: text.trim(), at: Date.now() });
    localStorage.setItem("loopfield-local-drafts", JSON.stringify(drafts));
    setDone(true);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100/90">
        Cloud backend not connected on this deploy yet — drafts save in this
        browser until Convex is linked.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        required
        minLength={20}
        placeholder="Describe the loop in your own words..."
        className="w-full rounded-2xl border border-white/15 bg-black/40 p-4 text-white outline-none"
      />
      {done && (
        <p className="text-sm text-cyan-100">Saved locally on this device.</p>
      )}
      <button
        type="submit"
        className="rounded-full bg-[#ff9b7a] px-6 py-3 text-sm font-medium text-black"
      >
        Save local draft
      </button>
    </form>
  );
}

export function SubmissionForm() {
  const convexOk = useConvexAvailable();
  return convexOk ? <ConvexSubmissionForm /> : <LocalDraftForm />;
}
