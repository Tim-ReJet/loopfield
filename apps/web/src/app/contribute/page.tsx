import { SubmissionForm } from "@/components/SubmissionForm";
import Link from "next/link";

export default function ContributePage() {
  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-6 pb-20 pt-28">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#ff9b7a]">
        The unnamed
      </p>
      <h1 className="font-display mt-3 text-5xl text-white">
        Add a pattern to the corpus
      </h1>
      <p className="mt-4 text-lg text-white/65">
        This is a hobby map grown from lived experience. If something here is
        almost you — or nowhere near named yet — write it in felt language.
        Submissions stay private until curated into scientific structure.
      </p>
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <SubmissionForm />
      </div>
      <p className="mt-8 text-sm text-white/45">
        Browse what has already graduated to mapped status in{" "}
        <Link href="/unnamed" className="text-cyan-200 underline">
          The Unnamed gallery
        </Link>
        .
      </p>
    </main>
  );
}
