"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AppShell, TabBar } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export default function TabsLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    useStore.getState().recordVisit();
  }, []);

  return (
    <AppShell>
      {children}
      <TabBar />
    </AppShell>
  );
}
