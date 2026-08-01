import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] w-full">
      <main
        className="mx-auto w-full safe-top"
        style={{
          maxWidth: "var(--page-width)",
          paddingLeft: "var(--side-padding)",
          paddingRight: "var(--side-padding)",
          paddingBottom: "calc(var(--nav-height) + 32px)",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}