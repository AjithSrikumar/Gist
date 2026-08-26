"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, Lock, Gift, Copy, Check, Trophy, Star, LogOut } from "lucide-react";
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
    { name: "Listener", unlocked: !!store.playback, icon: <Star size={26} className="text-accent-pink" /> },
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
      <section className="mx-4 mt-2 rounded-card bg-white p-5 shadow-card">
        {user ? (
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
        ) : (
          <div className="text-center">
            <p className="mb-3 text-[15px] text-ink-600">Sign in to sync your progress across devices</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => store.signInWithGoogle()}
              className="mx-auto flex h-12 items-center gap-3 rounded-button bg-white px-6 text-[15px] font-semibold text-ink-900 shadow-md ring-1 ring-divider active:bg-divider/30"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </motion.button>
          </div>
        )}
      </section>

      {/* growth streak card */}
      <section className="mx-4 mt-2 rounded-card bg-white p-5 shadow-card">
        <h2 className="mb-4 text-center text-[17px] font-semibold text-ink-900">Growth streak</h2>
        <StreakWeek week={store.streakWeek} count={store.streakCount} />
      </section>

      {/* learning progress */}
      <button
        onClick={() => (store.isSubscribed ? undefined : useStore.getState().openPaywall("profile"))}
        className="mx-4 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-card bg-white p-4 text-left shadow-card"
      >
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${store.isSubscribed ? "bg-accent-green/15 text-accent-green" : "bg-divider/60 text-ink-600"}`}>
          <Lock size={20} />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold text-ink-900">My learning progress</span>
          <span className="text-[12px] text-ink-600">{store.isSubscribed ? "You're on a roll — view stats" : "Unlock with Full Access"}</span>
        </span>
      </button>

      {!store.isSubscribed && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => useStore.getState().openPaywall("profile")}
          className="mx-4 mt-3 block h-12 w-[calc(100%-32px)] rounded-button bg-brand-blue text-[16px] font-semibold text-white shadow-lg active:bg-brand-blue-dk"
        >
          Unlock Full Access
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