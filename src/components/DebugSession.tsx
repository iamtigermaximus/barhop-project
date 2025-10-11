// src/components/DebugSession.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔍 Session Debug:", { status, session });
  }, [session, status]);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 1000,
        maxWidth: "300px",
      }}
    >
      <div>
        <strong>Session Status:</strong> {status}
      </div>
      <div>
        <strong>User:</strong> {session?.user?.name || "Not logged in"}
      </div>
      <div>
        <strong>Email:</strong> {session?.user?.email || "No email"}
      </div>
    </div>
  );
}
