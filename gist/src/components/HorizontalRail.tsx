"use client";

import type { ReactNode } from "react";

export function HorizontalRail({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="px-4">
        <h2 className="text-[17px] font-semibold text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-ink-600">{subtitle}</p>}
      </div>
      <div className="no-scrollbar snap-x-mandatory mt-3 flex gap-3 overflow-x-auto px-4 pb-1">{children}</div>
    </section>
  );
}
