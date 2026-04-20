// src/app/app/bars/page.tsx
import { Suspense } from "react";
import Bars from "@/components/app/bars/Bars";

export default function BarsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", textAlign: "center", color: "#e2e8f0" }}>
          Loading...
        </div>
      }
    >
      <Bars />
    </Suspense>
  );
}
