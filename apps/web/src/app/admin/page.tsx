"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useConvexAvailable } from "@/components/Providers";

function AdminPanel({ secret }: { secret: string }) {
  const [error, setError] = useState("");
  const pending = useQuery(api.submissions.listPending, { adminSecret: secret });
  const setStatus = useMutation(api.submissions.setStatus);

  async function update(
    id: Id<"submissions">,
    status: "mapped" | "rejected" | "pending",
  ) {
    try {
      await setStatus({ adminSecret: secret, id, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {pending === undefined && <p className="text-white/45">Loading…</p>}
      {pending?.length === 0 && (
        <p className="text-white/45">No pending submissions.</p>
      )}
      {pending?.map((item) => (
        <article key={item._id} className="rounded-2xl border border-white/10 p-4">
          <p className="whitespace-pre-wrap text-white/80">{item.text}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => update(item._id, "mapped")}
              className="rounded-full bg-cyan-300 px-3 py-1 text-sm text-black"
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => update(item._id, "rejected")}
              className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/70"
            >
              Reject
            </button>
          </div>
        </article>
      ))}
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </div>
  );
}

export default function AdminPage() {
  const convexOk = useConvexAvailable();
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setUnlocked(true);
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-6 pb-20 pt-28">
      <h1 className="font-display text-4xl text-white">Moderation</h1>
      <p className="mt-2 text-sm text-white/50">
        Hobby-ops only. Requires <code>ADMIN_SECRET</code> in Convex env.
      </p>

      {!convexOk ? (
        <p className="mt-8 text-white/55">
          Convex is not connected on this deployment.
        </p>
      ) : !unlocked ? (
        <form onSubmit={handleUnlock} className="mt-8 space-y-3">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-sm text-black"
          >
            Unlock
          </button>
        </form>
      ) : (
        <AdminPanel secret={secret} />
      )}
    </main>
  );
}
