// src/app/app/bars/[id]/page.tsx
import { Suspense } from "react";
import BarDetails from "@/components/app/bars/bar-details/BarDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BarDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center", color: "#e2e8f0" }}>
          Loading...
        </div>
      }
    >
      <BarDetails barId={id} />
    </Suspense>
  );
}
