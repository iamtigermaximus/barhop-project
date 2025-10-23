// src/app/app/layout.tsx
import { SocketProvider } from "@/components/app/contexts/SocketContext";
import AppNavbar from "@/components/app/common/app-navbar/AppNavbar";
import WrappedFooter from "@/components/app/common/wrapped-footer/WrappedFooter";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-layout">
      <SocketProvider>
        <AppNavbar />
        <main
          style={{
            background: "#0f172a",
            margin: 0,
            padding: 0,
            minHeight: "100vh",
            color: "white",
          }}
        >
          {children}
        </main>
        <WrappedFooter />
      </SocketProvider>
    </div>
  );
}
