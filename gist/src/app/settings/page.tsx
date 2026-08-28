"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Mail, LifeBuoy } from "lucide-react";
import { ScreenPadding } from "@/components/AppShell";
import { useStore } from "@/lib/store";

const BASE = "https://gist.app";
const ROWS = [
  { label: "App language", value: "English" },
  { label: "Notifications", chevron: true, route: "/settings/notifications" },
  { label: "Gift Gist to a friend", action: "share" as const },
  { label: "Explore Gist for Business", href: `${BASE}/business` },
  { label: "Privacy Policy", href: `${BASE}/privacy` },
  { label: "Terms of Use", href: `${BASE}/terms` },
  { label: "Subscription Terms", href: `${BASE}/subscription-terms` },
  { label: "Delete account", danger: true, action: "delete" as const },
  { label: "Log out", danger: true, action: "logout" as const },
];

export default function SettingsPage() {
  const router = useRouter();
  const email = useStore((s) => s.email);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAction = (row: (typeof ROWS)[number]) => {
    if (row.action === "logout") {
      useStore.getState().signOut();
      router.replace("/");
    } else if (row.action === "share") {
      navigator.share?.({ title: "Gist", text: "Check out Gist — key ideas from bestsellers in minutes", url: BASE }).catch(() => {
        navigator.clipboard.writeText(BASE);
      });
    } else if (row.action === "delete") {
      setConfirmDelete(true);
    } else if (row.route) {
      router.push(row.route);
    } else if (row.href) {
      window.open(row.href, "_blank");
    }
  };

  if (confirmDelete) {
    return (
      <ScreenPadding>
        <div className="mx-auto max-w-[480px] flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <h2 className="text-[20px] font-bold text-ink-900">Delete your account?</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
            This will permanently delete your account, reading history, streaks, and highlights. This action cannot be undone.
          </p>
          <button
            onClick={() => setConfirmDelete(false)}
            className="mt-8 h-12 w-full rounded-button bg-divider text-[15px] font-semibold text-ink-900"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              useStore.getState().signOut();
              router.replace("/");
            }}
            className="mt-3 h-12 w-full rounded-button bg-red-500 text-[15px] font-semibold text-white"
          >
            Yes, delete my account
          </button>
        </div>
      </ScreenPadding>
    );
  }

  return (
    <ScreenPadding>
      <div className="mx-auto max-w-[480px]">
        <header className="flex items-center gap-1 px-2 pt-3 pb-1">
          <button aria-label="Back to profile" onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronLeft size={24} className="text-ink-900" />
          </button>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Settings</h1>
        </header>

        <div className="mt-2 px-4">
          {ROWS.map((row) => (
            <button
              key={row.label}
              onClick={() => handleAction(row)}
              className="flex h-[58px] w-full items-center justify-between border-b border-divider text-left last:border-b-0"
            >
              <span className={`text-[15px] ${row.danger ? "font-medium text-red-500" : "text-ink-900"}`}>{row.label}</span>
              <span className="flex items-center gap-2">
                {row.value && <span className="text-[14px] text-ink-600">{row.value}</span>}
                {row.route && <ChevronRight size={18} className="text-ink-600/60" />}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 px-4 pb-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-ink-600">
            <Mail size={13} /> {email ?? "you@example.com"}
          </div>
          <p className="mt-1 text-[11px] text-ink-600/70">Gist · Version 1.0.0 (web)</p>
          <button
            onClick={() => window.open("mailto:support@gist.app", "_blank")}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-button border border-divider bg-bg-white px-6 text-[15px] font-semibold text-brand-blue shadow-card"
          >
            <LifeBuoy size={18} /> Contact support
          </button>
        </div>
      </div>
    </ScreenPadding>
  );
}
