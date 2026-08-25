"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ToggleSwitchRow } from "@/components/ui/Controls";
import { useStore } from "@/lib/store";

export default function NotificationsPage() {
  const router = useRouter();
  const prefs = useStore((s) => s.notifPrefs);
  const setNotifPref = useStore((s) => s.setNotifPref);

  return (
    <div className="min-h-dvh bg-bg-cream">
      <div className="mx-auto max-w-[480px]">
        <header className="flex items-center gap-1 px-2 pt-3 pb-1">
          <button aria-label="Back to settings" onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronLeft size={24} className="text-ink-900" />
          </button>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Notifications</h1>
        </header>

        <div className="mt-2 mx-4 overflow-hidden rounded-card bg-white shadow-card">
          <ToggleSwitchRow
            label="Morning learning"
            description="A gentle nudge to keep your daily habit alive"
            checked={prefs.morning}
            onCheckedChange={(v) => setNotifPref("morning", v)}
          />
          <ToggleSwitchRow
            label="Keep it up"
            description="Stay aware of your streak before the day ends"
            checked={prefs.keepUp}
            onCheckedChange={(v) => setNotifPref("keepUp", v)}
          />
          <ToggleSwitchRow
            label="Dive deeper"
            description="We'll suggest finishing a book from your Library or Today feed"
            checked={prefs.diveDeeper}
            onCheckedChange={(v) => setNotifPref("diveDeeper", v)}
          />
        </div>
      </div>
    </div>
  );
}
