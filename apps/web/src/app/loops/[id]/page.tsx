import { LoopJourney } from "@/components/LoopJourney";

export default async function LoopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="pt-16">
      <LoopJourney loopId={id} />
    </main>
  );
}
