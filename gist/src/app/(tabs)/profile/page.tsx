"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, Lock, Gift, Copy, Check, Trophy, Star, LogOut, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { ScreenPadding } from "@/components/AppShell";
import { StreakWeek } from "@/components/StreakFlame";
import { AchievementBadge } from "@/components/ui/Controls";
import { useStore } from "@/lib/store";
import { getSupabase } from "@/lib/supabase-browser";

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
        onClick={() => (store.isSubscribed ? undefined : useStore.getState().openPaywall("profile"))}
        className="mx-4 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-card bg-bg-white p-4 text-left shadow-card"
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${store.isSubscribed ? "bg-accent-green/15 text-accent-green" : "bg-divider/60 text-ink-600"}`}>
          <Lock size={20} />
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
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-button bg-ink-900 px-6 text-[15px] font-semibold text-white active:bg-black"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Link copied!" : "Invite friends"}
        </motion.button>
      </section>

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