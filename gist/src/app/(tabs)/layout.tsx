"use client";

import type { ReactNode } from "react";
import { AppShell, TabBar } from "@/components/AppShell";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {children}
      <TabBar />
    </AppShell>
  );
}
