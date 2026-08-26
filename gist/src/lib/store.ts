"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Playback, Speed } from "./types";
import type { User } from "@supabase/supabase-js";

export interface OverlayState {
  bookDetailId: string | null;
  readerBookId: string | null;
  playerOpen: boolean;
  searchOpen: boolean;
  paywall: PaywallVariant | null;
  celebrationStreak: number | null;
  contentsSheetOpen: boolean;
  themeSheetOpen: boolean;
  user: User | null;
}

export type PaywallVariant = "onboarding" | "streak" | "profile" | "discount";

export interface PersistedState {
  hydrated: boolean;
  onboarded: boolean;
  email: string | null;
  selectedGoals: string[];
  prefFormat: "read" | "listen";
  isSubscribed: boolean;
  trialStarted: boolean;
  streakCount: number;
  streakWeek: boolean[];
  lastFinishDate: string | null;
  library: {
    continuing: { bookId: string; progressPct: number; lastIndex: number }[];
    savedForLater: string[];
    finished: string[];
  };
  highlights: { bookId: string; pointIndex: number; snippet: string }[];
  ratings: Record<string, number>;
  notifPrefs: { morning: boolean; keepUp: boolean; diveDeeper: boolean };
  readerTheme: "cream" | "white" | "dark";
  readerTextScale: number;
  playback: Playback | null;
}

interface Actions {
  setHydrated: () => void;
  completeOnboarding: (d: { goals: string[]; prefFormat: "read" | "listen"; email: string | null }) => void;
  startTrial: () => void;
  subscribe: () => void;

  saveToLibrary: (bookId: string) => void;
  removeFromLibrary: (bookId: string) => void;
  markFinished: (bookId: string) => void;
  upsertProgress: (bookId: string, progressPct: number, lastIndex: number) => void;
  addHighlight: (bookId: string, pointIndex: number, snippet: string) => void;
  rateBook: (bookId: string, rating: number) => void;
  setNotifPref: (k: keyof PersistedState["notifPrefs"], v: boolean) => void;
  setReaderTheme: (t: PersistedState["readerTheme"]) => void;
  setReaderTextScale: (n: number) => void;

  finishSummary: (bookId: string) => boolean;

  playBook: (bookId: string, pointIndex?: number) => void;
  togglePlay: () => void;
  tickPlayback: (sec: number) => void;
  seekTo: (sec: number) => void;
  cycleSpeed: () => void;
  gotoPoint: (idx: number) => void;
  stopPlayback: () => void;

  openBookDetail: (id: string | null) => void;
  openReader: (id: string | null) => void;
  setPlayerOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  openPaywall: (v: PaywallVariant | null) => void;
  showCelebration: (days: number | null) => void;
  setContentsSheet: (v: boolean) => void;
  setThemeSheet: (v: boolean) => void;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export type AppStore = PersistedState & Actions & OverlayState;

const initialPersisted: PersistedState = {
  hydrated: false,
  onboarded: false,
  email: null,
  selectedGoals: [],
  prefFormat: "read",
  isSubscribed: false,
  trialStarted: false,
  streakCount: 0,
  streakWeek: [false, false, false, false, false, false, false],
  lastFinishDate: null,
  library: { continuing: [], savedForLater: [], finished: [] },
  highlights: [],
  ratings: {},
  notifPrefs: { morning: true, keepUp: true, diveDeeper: false },
  readerTheme: "cream",
  readerTextScale: 100,
  playback: null,
};

const todayIndex = () => new Date().getDay(); // 0 = Sunday
const todayKey = () => new Date().toDateString();

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
function debouncedSync(userId: string, state: PersistedState) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    const { saveUserData } = await import("./supabase-browser");
    await saveUserData(userId, {
      library: state.library,
      highlights: state.highlights,
      ratings: state.ratings,
      streak_count: state.streakCount,
      streak_week: state.streakWeek,
      last_finish_date: state.lastFinishDate,
      is_subscribed: state.isSubscribed,
    });
  }, 1000);
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      // overlays (ephemeral)
      bookDetailId: null,
      readerBookId: null,
      playerOpen: false,
      searchOpen: false,
      paywall: null,
      celebrationStreak: null,
      contentsSheetOpen: false,
      themeSheetOpen: false,
      user: null,

      setHydrated: () => set({ hydrated: true }),

      completeOnboarding: ({ goals, prefFormat, email }) =>
        set({ onboarded: true, selectedGoals: goals, prefFormat, email }),

      startTrial: () => set({ trialStarted: true, isSubscribed: true }),
      subscribe: () => set({ isSubscribed: true }),

      saveToLibrary: (bookId) =>
        set((s) =>
          s.library.savedForLater.includes(bookId) ||
          s.library.continuing.some((c) => c.bookId === bookId) ||
          s.library.finished.includes(bookId)
            ? s
            : { library: { ...s.library, savedForLater: [bookId, ...s.library.savedForLater] } }
        ),

      removeFromLibrary: (bookId) =>
        set((s) => ({
          library: {
            continuing: s.library.continuing.filter((c) => c.bookId !== bookId),
            savedForLater: s.library.savedForLater.filter((b) => b !== bookId),
            finished: s.library.finished.filter((b) => b !== bookId),
          },
        })),

      markFinished: (bookId) =>
        set((s) => ({
          library: {
            continuing: s.library.continuing.filter((c) => c.bookId !== bookId),
            savedForLater: s.library.savedForLater.filter((b) => b !== bookId),
            finished: s.library.finished.includes(bookId)
              ? s.library.finished
              : [bookId, ...s.library.finished],
          },
        })),

      upsertProgress: (bookId, progressPct, lastIndex) =>
        set((s) => {
          if (s.library.finished.includes(bookId)) return s;
          const rest = s.library.continuing.filter((c) => c.bookId !== bookId);
          return {
            library: {
              ...s.library,
              continuing: [{ bookId, progressPct, lastIndex }, ...rest],
            },
          };
        }),

      addHighlight: (bookId, pointIndex, snippet) =>
        set((s) =>
          s.highlights.some((h) => h.bookId === bookId && h.pointIndex === pointIndex)
            ? s
            : { highlights: [...s.highlights, { bookId, pointIndex, snippet }] }
        ),

      rateBook: (bookId, rating) =>
        set((s) => ({ ratings: { ...s.ratings, [bookId]: rating } })),

      setNotifPref: (k, v) =>
        set((s) => ({ notifPrefs: { ...s.notifPrefs, [k]: v } })),

      setReaderTheme: (readerTheme) => set({ readerTheme }),
      setReaderTextScale: (readerTextScale) => set({ readerTextScale }),

      finishSummary: (bookId) => {
        const s = get();
        const alreadyToday = s.lastFinishDate === todayKey();
        const dayIdx = todayIndex();
        let newStreak = s.streakCount;
        if (!alreadyToday) newStreak += 1;
        const week = [...s.streakWeek];
        week[dayIdx] = true;
        set({
          streakCount: newStreak,
          streakWeek: week,
          lastFinishDate: todayKey(),
          library: {
            continuing: s.library.continuing.filter((c) => c.bookId !== bookId),
            savedForLater: s.library.savedForLater.filter((b) => b !== bookId),
            finished: s.library.finished.includes(bookId)
              ? s.library.finished
              : [bookId, ...s.library.finished],
          },
        });
        return !alreadyToday;
      },

      playBook: (bookId, pointIndex = 0) =>
        set({
          playback: { bookId, pointIndex, positionSec: 0, playing: true, speed: 1 },
        }),

      togglePlay: () =>
        set((s) =>
          s.playback ? { playback: { ...s.playback, playing: !s.playback.playing } } : s
        ),

      tickPlayback: (sec) =>
        set((s) => {
          if (!s.playback || !s.playback.playing) return s;
          return {
            playback: { ...s.playback, positionSec: Math.max(0, s.playback.positionSec + sec * s.playback.speed) },
          };
        }),

      seekTo: (sec) =>
        set((s) => (s.playback ? { playback: { ...s.playback, positionSec: Math.max(0, sec) } } : s)),

      cycleSpeed: () =>
        set((s) => {
          if (!s.playback) return s;
          const order: Speed[] = [1, 1.5, 2];
          const next = order[(order.indexOf(s.playback.speed) + 1) % order.length];
          return { playback: { ...s.playback, speed: next } };
        }),

      gotoPoint: (idx) =>
        set((s) => (s.playback ? { playback: { ...s.playback, pointIndex: idx, positionSec: 0 } } : s)),

      stopPlayback: () => set({ playback: null }),

      openBookDetail: (bookDetailId) => set({ bookDetailId }),
      openReader: (readerBookId) => set({ readerBookId }),
      setPlayerOpen: (playerOpen) => set({ playerOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      openPaywall: (paywall) => set({ paywall }),
      showCelebration: (celebrationStreak) => set({ celebrationStreak }),
      setContentsSheet: (contentsSheetOpen) => set({ contentsSheetOpen }),
      setThemeSheet: (themeSheetOpen) => set({ themeSheetOpen }),

      setUser: async (user) => {
        set({ user });
        if (user) {
          const { loadUserData, saveUserData } = await import("./supabase-browser");
          const data = await loadUserData(user.id);
          if (data) {
            // Existing user — load from Supabase
            set({
              library: data.library ?? get().library,
              highlights: data.highlights ?? get().highlights,
              ratings: data.ratings ?? get().ratings,
              streakCount: data.streak_count ?? get().streakCount,
              streakWeek: data.streak_week ?? get().streakWeek,
              lastFinishDate: data.last_finish_date ?? get().lastFinishDate,
              isSubscribed: data.is_subscribed ?? get().isSubscribed,
            });
          } else {
            // First sign-in — push local onboarding data to Supabase
            const s = get();
            await saveUserData(user.id, {
              library: s.library,
              highlights: s.highlights,
              ratings: s.ratings,
              streak_count: s.streakCount,
              streak_week: s.streakWeek,
              last_finish_date: s.lastFinishDate,
              is_subscribed: s.isSubscribed,
            });
          }
        }
      },

      signInWithGoogle: async () => {
        const { getSupabase } = await import("./supabase-browser");
        const { error } = await getSupabase().auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) console.error("Google sign-in error:", error);
      },

      signOut: async () => {
        const { getSupabase } = await import("./supabase-browser");
        const { error } = await getSupabase().auth.signOut();
        if (error) console.error("Sign out error:", error);
        set({ user: null });
      },
    }),
    {
      name: "gist-app-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const persisted = {
          onboarded: s.onboarded,
          email: s.email,
          selectedGoals: s.selectedGoals,
          prefFormat: s.prefFormat,
          isSubscribed: s.isSubscribed,
          trialStarted: s.trialStarted,
          streakCount: s.streakCount,
          streakWeek: s.streakWeek,
          lastFinishDate: s.lastFinishDate,
          library: s.library,
          highlights: s.highlights,
          ratings: s.ratings,
          notifPrefs: s.notifPrefs,
          readerTheme: s.readerTheme,
          readerTextScale: s.readerTextScale,
          playback: s.playback,
        };
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// Sync to Supabase when logged-in user data changes
useStore.subscribe((state, prevState) => {
  const user = state.user;
  if (!user) return;
  const changed =
    state.library !== prevState.library ||
    state.highlights !== prevState.highlights ||
    state.ratings !== prevState.ratings ||
    state.streakCount !== prevState.streakCount ||
    state.streakWeek !== prevState.streakWeek ||
    state.lastFinishDate !== prevState.lastFinishDate ||
    state.isSubscribed !== prevState.isSubscribed;
  if (changed) {
    debouncedSync(user.id, state);
  }
});
