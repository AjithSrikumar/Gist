"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, Gift, Copy, Check, Trophy, Star, LogOut, BarChart3, Smartphone, Download, Share2, Plus, X, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenPadding } from "@/components/AppShell";
import { StreakWeek } from "@/components/StreakFlame";
import { AchievementBadge } from "@/components/ui/Controls";
import { useStore } from "@/lib/store";
import { getSupabase } from "@/lib/supabase-browser";

function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<"android" | "iphone">("android");
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);
    if (localStorage.getItem("gist-pwa-dismissed") === "1") setDismissed(true);

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    setActiveTab(isIOS ? "iphone" : "android");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowSteps((v) => !v);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("gist-pwa-dismissed", "1");
  };

  if (isInstalled) {
    return (
      <section className="mx-4 mt-3 flex items-center gap-3 rounded-card border border-accent-green/20 bg-accent-green/10 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-green text-white">
          <Check size={18} />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-ink-900">App installed ✓</p>
          <p className="text-[12px] text-ink-600">You&apos;re using the app version — faster & fullscreen.</p>
        </div>
      </section>
    );
  }

  if (dismissed) return null;

  return (
    <section className="mx-4 mt-3 overflow-hidden rounded-card bg-bg-white shadow-card">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
              <Smartphone size={20} />
            </span>
            <div>
              <h2 className="text-[15px] font-bold leading-tight text-ink-900">Get the Gist app</h2>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-600">
                Add to home screen for fullscreen, offline summaries &amp; 1-tap open — no browser bar.
              </p>
            </div>
          </div>
          <button
            aria-label="Dismiss"
            onClick={handleDismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-600/60 active:bg-divider"
          >
            <X size={16} />
          </button>
        </div>

        {deferredPrompt ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleInstall}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-button bg-brand-blue text-[15px] font-semibold text-white shadow-card"
          >
            <Download size={18} /> Install app
          </motion.button>
        ) : (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-button bg-brand-blue text-[14px] font-semibold text-white"
            >
              <Download size={16} /> {activeTab === "iphone" ? "How to install" : "Install"}
            </button>
            <button
              onClick={() => setShowSteps((v) => !v)}
              className="flex h-11 items-center justify-center rounded-button border border-divider bg-bg-white px-4 text-[13px] font-semibold text-ink-900"
            >
              {showSteps ? "Hide" : "Steps"}
            </button>
          </div>
        )}
        <p className="mt-2 text-center text-[11px] text-ink-600">
          {deferredPrompt ? "Free — installs in 2 seconds" : "Takes 10 seconds • no App Store needed"}
        </p>
      </div>

      <AnimatePresence>
        {showSteps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-divider bg-bg-cream"
          >
            <div className="flex gap-1 p-2">
              {(["android", "iphone"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-full py-2 text-[13px] font-semibold ${
                    activeTab === tab ? "bg-ink-900 text-white" : "text-ink-600"
                  }`}
                >
                  {tab === "android" ? "Android" : "iPhone"}
                </button>
              ))}
            </div>

            <div className="px-4 pb-4">
              {activeTab === "android" ? (
                <div className="space-y-3">
                  <Step
                    n={1}
                    title="Tap the ⋮ menu"
                    desc="Open Gist in Chrome, tap the three dots top-right."
                    visual={
                      <div className="flex h-16 items-center justify-center rounded-xl border border-divider bg-white">
                        <span className="flex h-8 w-14 items-center justify-between rounded-full border border-divider bg-bg-white px-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
                          <MoreVertical size={14} className="text-ink-900" />
                        </span>
                      </div>
                    }
                  />
                  <Step
                    n={2}
                    title='Tap “Add to Home screen”'
                    desc='Choose “Install app” or “Add to Home screen” in the menu.'
                    visual={
                      <div className="rounded-xl border border-divider bg-white p-2 text-[11px] leading-tight text-ink-900">
                        <div className="flex items-center gap-2 rounded-lg bg-bg-cream px-2 py-1.5">
                          <Smartphone size={14} className="text-brand-blue" /> Add to Home screen
                        </div>
                        <div className="mt-1 flex items-center gap-2 rounded-lg bg-brand-blue px-2 py-1.5 text-white">
                          <Download size={14} /> Install app
                        </div>
                      </div>
                    }
                  />
                  <Step
                    n={3}
                    title="Tap Install → Open"
                    desc="Tap Install, then open Gist from your home screen — now fullscreen without browser bar."
                    visual={
                      <div className="flex h-16 items-center justify-center gap-2 rounded-xl border border-divider bg-white">
                        <span className="rounded-full bg-accent-green px-2.5 py-1 text-[11px] font-bold text-white">Install</span>
                        <span className="text-[11px] text-ink-600">→</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white">
                          <Smartphone size={16} />
                        </span>
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Step
                    n={1}
                    title="Tap the Share button"
                    desc="Open Gist in Safari, tap the Share icon (square with arrow) at the bottom."
                    visual={
                      <div className="flex h-16 items-center justify-center rounded-xl border border-divider bg-white">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-divider bg-bg-white">
                          <Share2 size={18} className="text-brand-blue" />
                        </span>
                      </div>
                    }
                  />
                  <Step
                    n={2}
                    title='Tap “Add to Home Screen”'
                    desc="Scroll down in the share sheet and tap Add to Home Screen."
                    visual={
                      <div className="rounded-xl border border-divider bg-white p-2 text-[11px] text-ink-900">
                        <div className="flex items-center gap-2 px-1 py-1 text-ink-600">
                          <span className="flex h-5 w-5 items-center justify-center rounded border border-divider text-[10px]">Aa</span> Add Bookmark
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-bg-cream px-2 py-1.5 font-medium">
                          <Plus size={14} className="text-ink-900" /> Add to Home Screen
                        </div>
                      </div>
                    }
                  />
                  <Step
                    n={3}
                    title="Tap Add → Open"
                    desc='Tap Add top-right, then open Gist from your home screen — now a real app.'
                    visual={
                      <div className="flex h-16 items-center justify-center gap-2 rounded-xl border border-divider bg-white">
                        <span className="rounded-full border border-divider bg-bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-900">Add</span>
                        <span className="text-[11px] text-ink-600">→</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
                          <Smartphone size={16} />
                        </span>
                      </div>
                    }
                  />
                </div>
              )}
              <p className="mt-3 text-center text-[11px] leading-snug text-ink-600">
                Tip: After installing, open from the home screen for the true app experience — no address bar, faster, and offline-ready summaries.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Step({
  n,
  title,
  desc,
  visual,
}: {
  n: number;
  title: string;
  desc: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[13px] font-bold text-white">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink-900">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-600">{desc}</p>
        <div className="mt-2">{visual}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const store = useStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const user = store.user;

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      useStore.getState().setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useStore.getState().setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const achievements = [
    { name: "Account manager", unlocked: true, icon: <Trophy size={26} className="text-accent-orange" /> },
    { name: "Star shooter", unlocked: store.streakCount >= 1, icon: <Star size={26} className="text-brand-blue" fill="currentColor" /> },
    { name: "Bookworm", unlocked: store.library.finished.length >= 1, icon: <Trophy size={26} className="text-accent-green" /> },
    { name: "Collector", unlocked: store.highlights.length >= 1, icon: <Trophy size={26} className="text-accent-purple" /> },
    { name: "Streak x7", unlocked: store.streakCount >= 7, icon: <Star size={26} className="text-accent-teal" /> },
  ];

  return (
    <ScreenPadding>
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Profile</h1>
        <button
          aria-label="Settings"
          onClick={() => router.push("/settings")}
          className="flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Settings size={22} className="text-ink-900" />
        </button>
      </header>

      {/* user card */}
      {user && (
        <section className="mx-4 mt-2 rounded-card bg-bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-[20px] font-bold text-white">
                {(user.user_metadata?.full_name ?? user.email ?? "?")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-[16px] font-semibold text-ink-900">
                {user.user_metadata?.full_name ?? "User"}
              </p>
              <p className="text-[13px] text-ink-600">{user.email}</p>
            </div>
            <button
              onClick={() => store.signOut()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-divider/60 text-ink-600 active:bg-divider"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </section>
      )}

      {/* growth streak card */}
      <section className="mx-4 mt-2 rounded-card bg-bg-white p-5 shadow-card">
        <h2 className="mb-4 text-center text-[17px] font-semibold text-ink-900">Growth streak</h2>
        <StreakWeek week={store.streakWeek} count={store.streakCount} />
      </section>

      {/* learning progress */}
      <button
        onClick={() => store.isSubscribed ? router.push("/library") : useStore.getState().openPaywall("profile")}
        className="mx-4 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-card bg-bg-white p-4 text-left shadow-card"
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${store.isSubscribed ? "bg-accent-green/15 text-accent-green" : "bg-divider/60 text-ink-600"}`}>
          <BarChart3 size={20} />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold text-ink-900">My learning progress</span>
          <span className="text-[12px] text-ink-600">{store.isSubscribed ? "You're on a roll — view stats" : user ? "Sign in to sync your progress" : "Unlock with Full Access"}</span>
        </span>
      </button>

      {!store.isSubscribed && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => useStore.getState().openPaywall("profile")}
          className="mx-4 mt-3 block h-12 w-[calc(100%-32px)] rounded-button bg-brand-blue text-[16px] font-semibold text-white shadow-lg active:bg-brand-blue-dk"
        >
          {user ? "Start for Free" : "Unlock Full Access"}
        </motion.button>
      )}

      {/* invite friends */}
      <section className="mx-4 mt-3 rounded-card bg-surface-peach p-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-orange text-white">
          <Gift size={22} />
        </div>
        <h2 className="mt-3 text-[16px] leading-snug font-bold text-ink-900">
          Grow together — invite friends to enjoy the world&apos;s best ideas side by side
        </h2>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText("https://gist.app/invite/YOU");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {}
          }}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-button border border-divider bg-bg-white px-6 text-[15px] font-semibold text-ink-900 shadow-card"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Link copied!" : "Invite friends"}
        </motion.button>
      </section>

      <InstallAppCard />

      {/* achievements */}
      <section className="mt-7 px-4 pb-6">
        <h2 className="text-[17px] font-semibold text-ink-900">My achievements</h2>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {achievements.map((a) => (
            <AchievementBadge key={a.name} name={a.name} unlocked={a.unlocked} icon={a.icon} />
          ))}
        </div>
      </section>
    </ScreenPadding>
  );
}