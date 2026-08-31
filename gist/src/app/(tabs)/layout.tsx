"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AppShell, TabBar } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export default function TabsLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const run = () => useStore.getState().recordVisit();
    run();
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", run);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", run);
    };
  }, []);

  return (
    <AppShell>
      {children}
      <TabBar />
    </AppShell>
  );
}
