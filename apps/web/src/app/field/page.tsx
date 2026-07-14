import { Suspense } from "react";
import { FieldExperience } from "@/components/FieldExperience";

export default function FieldPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center bg-[#07090f] text-white/60">
          Opening the field…
        </div>
      }
    >
      <FieldExperience />
    </Suspense>
  );
}
