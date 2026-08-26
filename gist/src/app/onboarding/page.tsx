"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  Briefcase,
  TrendingUp,
  Brain,
  Flower2,
  Megaphone,
  Users,
  Check,
  Star,
} from "lucide-react";
import { GOALS } from "@/data/catalog";
import { BOOK_METAS, booksForGoal } from "@/data/books";
import { BookCover } from "@/components/BookCard";
import { PaywallContent } from "@/components/overlays/Paywall";
import { LogoMark } from "@/components/LogoMark";
import { useStore } from "@/lib/store";

type Step =
  | "intro" | "account" | "email" | "welcome"
  | "gender" | "age" | "goals" | "celebrate"
  | "booksPerYear" | "format" | "notifications"
  | "socialProof" | "reassure" | "picks" | "crafting" | "paywall";

const STEP_ORDER: Step[] = [
  "intro", "account", "email", "welcome",
  "gender", "age", "goals", "celebrate",
  "booksPerYear", "format", "notifications",
  "socialProof", "reassure", "picks", "crafting", "paywall",
];

const SLIDES = [
  { title: "Get the key ideas from bestselling books", body: "15-minute summaries you'll actually finish.", accent: "#2F5FF6" },
  { title: "#1 most downloaded book-summary app", body: "Join millions growing a little every day.", accent: "#FF4FA0" },
  { title: "Key ideas from the world's best nonfiction", body: "Hand-picked titles across money, career, and life.", accent: "#FF8A3D" },
  { title: "Read on the go", body: "Bite-sized key points, perfect for a coffee break.", accent: "#35C48B" },
  { title: "Or listen & grow", body: "Narrated summaries that fit your commute.", accent: "#8B5CF6" },
];

export default function OnboardingPage() {
  const [idx, setIdx] = useState(0);
  const step = STEP_ORDER[idx];
  const go = (d: number) => setIdx((i) => Math.min(STEP_ORDER.length - 1, Math.max(0, i + d)));
  const router = useRouter();
  const store = useStore();

  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [goals, setGoals] = useState<string[]>([]);
  const [prefFormat, setPrefFormat] = useState<"read" | "listen">("read");
  const [pickIds, setPickIds] = useState<string[] | null>(null);

  const finishOnboarding = () => {
    store.completeOnboarding({ goals, prefFormat, email });
    router.replace("/for-you");
  };

  return (
    <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-ink-900">
      {idx > 0 && (
        <button
          aria-label="Back"
          onClick={() => go(-1)}
          className="absolute top-3 left-2 z-20 flex h-11 w-11 items-center justify-center text-white/80"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          className="min-h-0 flex-1 overflow-y-auto no-scrollbar"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.22 }}
        >
          {step === "intro" && (
            <IntroSlides onDone={() => go(1)} />
          )}

          {step === "account" && (
            <Centered dark>
              <h1 className="text-[30px] leading-tight font-bold text-white">Create your account</h1>
              <div className="mt-8 w-full space-y-3">
                {[
                  { label: "Continue with Apple", cls: "bg-white text-ink-900" },
                  { label: "Continue with Google", cls: "bg-[#4285F4] text-white" },
                ].map((b) => (
                  <motion.button whileTap={{ scale: 0.97 }} key={b.label} onClick={() => go(1)} className={`h-[52px] w-full rounded-button text-[16px] font-semibold ${b.cls}`}>
                    {b.label}
                  </motion.button>
                ))}
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => go(2)} className="h-[52px] w-full rounded-button border border-white/40 text-[16px] font-semibold text-white">
                  Continue with Email
                </motion.button>
              </div>
              <p className="mt-6 px-6 text-center text-[12px] leading-relaxed text-white/50">
                By continuing you agree to our Terms of Use and Privacy Policy.
              </p>
            </Centered>
          )}

          {step === "email" && (
            <Centered dark>
              <h1 className="text-[28px] font-bold text-white">What&apos;s your email?</h1>
              <input
                autoFocus
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-8 h-[54px] w-full rounded-button border border-white/25 bg-white/10 px-4 text-[16px] text-white outline-none placeholder:text-white/40 focus:border-brand-blue"
              />
              <button
                disabled={!emailValid}
                onClick={() => go(3)}
                className={`mt-4 h-[52px] w-full rounded-button text-[16px] font-semibold ${
                  emailValid ? "bg-brand-blue text-white active:bg-brand-blue-dk" : "bg-white/15 text-white/40"
                }`}
              >
                Continue
              </button>
            </Centered>
          )}

          {step === "welcome" && (
            <Centered dark>
              <LogoMark />
              <h1 className="mt-6 text-[26px] font-bold text-white">Glad to have you with us!</h1>
              <p className="mt-2 mb-8 text-[14px] text-white/60">Crafting your personal growth plan…</p>
              <div className="w-full max-w-[260px] space-y-3">
                {[80, 60, 90].map((w, i) => (
                  <div key={i} className="shimmer h-10 rounded-xl bg-white/10" style={{ width: `${w}%`, marginInline: i === 1 ? "auto" : undefined }} />
                ))}
              </div>
              <AutoAdvance seconds={2.2} onDone={() => go(1)} />
            </Centered>
          )}

          {(step === "gender" || step === "age") && (
            <QuizPills
              title={step === "gender" ? "Choose your gender" : "How old are you?"}
              options={
                step === "gender"
                  ? ["Female", "Male", "Non-binary", "Prefer not to say"]
                  : ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"]
              }
              onSelect={() => setTimeout(() => go(1), 250)}
            />
          )}

          {step === "goals" && (
            <GoalPicker
              goals={goals}
              toggle={(g) =>
                setGoals((cur) =>
                  cur.includes(g) ? cur.filter((x) => x !== g) : cur.length >= 3 ? cur : [...cur, g]
                )
              }
              onNext={() => go(1)}
            />
          )}

          {step === "celebrate" && (
            <Centered dark>
              <Mascot />
              <h1 className="mt-6 text-[28px] font-bold text-white">Great job!</h1>
              <p className="mt-2 text-[14px] text-white/60">Your goals will shape everything you see.</p>
              <AutoAdvance seconds={1.8} onDone={() => go(1)} />
            </Centered>
          )}

          {step === "booksPerYear" && (
            <QuizPills
              title="How many books do you read per year?"
              options={["None yet", "1–2", "3–5", "6–12", "12+"]}
              onSelect={() => setTimeout(() => go(1), 250)}
            />
          )}

          {step === "format" && (
            <QuizPills
              title="How do you prefer to learn?"
              options={["Reading", "Listening", "Both"]}
              onSelect={(o) => {
                setPrefFormat(o === "Listening" ? "listen" : "read");
                setTimeout(() => go(1), 250);
              }}
            />
          )}

          {step === "notifications" && (
            <Centered dark>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue">
                <Zap size={44} className="text-white" fill="currentColor" strokeWidth={0} />
              </div>
              <h1 className="mt-6 px-8 text-center text-[26px] leading-tight font-bold text-white">
                Don&apos;t break the habit you&apos;re building
              </h1>
              <p className="mt-3 px-8 text-center text-[14px] leading-relaxed text-white/60">
                We&apos;ll send one gentle reminder a day — just enough to keep your streak alive.
              </p>
              <button
                onClick={async () => {
                  try {
                    if ("Notification" in window) await Notification.requestPermission();
                  } catch {}
                  go(1);
                }}
                className="mt-8 h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
              >
                Allow notifications
              </button>
              <button onClick={() => go(1)} className="mx-auto mt-4 block h-11 px-6 text-[14px] font-semibold text-white/50">
                Not now
              </button>
            </Centered>
          )}

          {step === "socialProof" && <SocialProof onNext={() => go(1)} />}

          {step === "reassure" && (
            <Centered dark>
              <Mascot />
              <h1 className="mt-6 px-6 text-center text-[26px] leading-tight font-bold text-white">
                We know how hard growth can get
              </h1>
              <p className="mt-3 px-8 text-center text-[14px] leading-relaxed text-white/60">
                So we picked a few summaries matched to your goals. Small steps, every day.
              </p>
              <button
                onClick={() => {
                  if (!pickIds) setPickIds(picksFor(goals));
                  go(1);
                }}
                className="mt-8 h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
              >
                Show my picks
              </button>
            </Centered>
          )}

          {step === "picks" && (
            <PicksCarousel
              ids={pickIds ?? picksFor(goals)}
              prefFormat={prefFormat}
              onAdd={(id) => useStore.getState().saveToLibrary(id)}
              onNext={() => go(1)}
            />
          )}

          {step === "crafting" && <Crafting onDone={() => go(1)} />}

          {step === "paywall" && (
            <div className="flex min-h-full flex-col bg-white">
              <PaywallContent variant="onboarding" onStarted={finishOnboarding} />
              <button onClick={finishOnboarding} className="py-3 text-center text-[13px] font-semibold text-ink-600">
                Skip — explore free first
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function picksFor(goals: string[]): string[] {
  const ids = new Set<string>();
  goals.forEach((g) => booksForGoal(g).slice(0, 3).forEach((b) => ids.add(b.id)));
  return [...ids].slice(0, 5);
}

/* ---------- pieces ---------- */

function IntroSlides({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  return (
    <div className="flex h-full flex-col bg-ink-900">
      <div className="pt-16 pb-4 text-center">
        <LogoMark size={44} className="" />
      </div>
      <div
        className="no-scrollbar snap-x-mandatory min-h-0 flex-1 overflow-y-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setSlide(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="flex h-full w-full shrink-0 snap-start-always flex-col items-center justify-center px-8 text-center">
              <Illustration kind={i} />
              <h1 className="mt-8 text-[30px] leading-tight font-bold text-white">{s.title}</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="safe-bottom px-6 pb-8">
        <Dots count={SLIDES.length} index={slide} />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="mt-5 h-[54px] w-full rounded-button bg-brand-blue text-[17px] font-bold text-white active:bg-brand-blue-dk"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}

function Illustration({ kind }: { kind: number }) {
  const illustrations = [
    // Slide 0: Open book with light rays
    <svg key="book" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="pageGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8F0FE" />
          <stop offset="100%" stopColor="#C2D9FF" />
        </linearGradient>
        <linearGradient id="coverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F5FF6" />
          <stop offset="100%" stopColor="#1B3A6B" />
        </linearGradient>
      </defs>
      {/* glow */}
      <circle cx="100" cy="90" r="70" fill="#2F5FF6" opacity="0.08" />
      <circle cx="100" cy="90" r="50" fill="#2F5FF6" opacity="0.06" />
      {/* book spine */}
      <rect x="95" y="60" width="10" height="100" rx="2" fill="#1B3A6B" />
      {/* left page */}
      <path d="M95 60 Q50 55 30 70 L30 155 Q50 145 95 150 Z" fill="url(#pageGrad)" />
      <line x1="45" y1="85" x2="85" y2="82" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="98" x2="85" y2="95" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="111" x2="85" y2="108" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="45" y1="124" x2="75" y2="121" stroke="#B0C4DE" strokeWidth="1.5" />
      {/* right page */}
      <path d="M105 60 Q150 55 170 70 L170 155 Q150 145 105 150 Z" fill="url(#pageGrad)" />
      <line x1="115" y1="82" x2="155" y2="85" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="95" x2="155" y2="98" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="108" x2="155" y2="111" stroke="#B0C4DE" strokeWidth="1.5" />
      <line x1="115" y1="121" x2="145" y2="124" stroke="#B0C4DE" strokeWidth="1.5" />
      {/* light rays */}
      <motion.g animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }}>
        <line x1="100" y1="30" x2="100" y2="10" stroke="#FFC94D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="40" x2="55" y2="25" stroke="#FFC94D" strokeWidth="2" strokeLinecap="round" />
        <line x1="130" y1="40" x2="145" y2="25" stroke="#FFC94D" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="60" x2="38" y2="50" stroke="#FFC94D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="145" y1="60" x2="162" y2="50" stroke="#FFC94D" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
      {/* sparkles */}
      <motion.circle cx="60" cy="35" r="3" fill="#FFC94D" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
      <motion.circle cx="145" cy="30" r="2.5" fill="#FF4FA0" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.8 }} />
      <motion.circle cx="100" cy="15" r="2" fill="#35C48B" animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.3 }} />
    </svg>,

    // Slide 1: Trophy / #1 badge
    <svg key="trophy" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="95" r="65" fill="#FFC94D" opacity="0.1" />
      <circle cx="100" cy="95" r="50" fill="#FFC94D" opacity="0.08" />
      {/* trophy cup */}
      <path d="M70 50 L70 95 Q70 130 100 140 Q130 130 130 95 L130 50 Z" fill="url(#goldGrad)" />
      <rect x="70" y="45" width="60" height="10" rx="3" fill="#E6A800" />
      {/* handles */}
      <path d="M70 60 Q45 60 45 80 Q45 100 70 100" fill="none" stroke="#E6A800" strokeWidth="6" strokeLinecap="round" />
      <path d="M130 60 Q155 60 155 80 Q155 100 130 100" fill="none" stroke="#E6A800" strokeWidth="6" strokeLinecap="round" />
      {/* base */}
      <rect x="88" y="140" width="24" height="12" rx="2" fill="#E6A800" />
      <rect x="78" y="152" width="44" height="8" rx="3" fill="#D97706" />
      {/* #1 */}
      <text x="100" y="108" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#78350F">1</text>
      {/* confetti */}
      <motion.rect x="30" y="40" width="6" height="6" rx="1" fill="#FF4FA0" animate={{ y: [40, 160], rotate: [0, 360], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0 }} />
      <motion.rect x="160" y="30" width="5" height="5" rx="1" fill="#2F5FF6" animate={{ y: [30, 170], rotate: [0, -360], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.4 }} />
      <motion.circle cx="45" cy="25" r="3" fill="#35C48B" animate={{ y: [0, 140], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.8 }} />
      <motion.circle cx="155" cy="20" r="2.5" fill="#FFC94D" animate={{ y: [0, 150], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1.2 }} />
      <motion.rect x="110" y="35" width="4" height="8" rx="1" fill="#8B5CF6" animate={{ y: [35, 175], rotate: [0, 180], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2.6, delay: 0.6 }} />
    </svg>,

    // Slide 2: Bookshelf with colorful books
    <svg key="shelf" viewBox="0 0 200 200" className="h-52 w-auto">
      {/* shelf */}
      <rect x="15" y="140" width="170" height="8" rx="3" fill="#8B5A2B" />
      <rect x="15" y="145" width="170" height="4" rx="1" fill="#6B4226" />
      {/* books */}
      <rect x="25" y="55" width="22" height="85" rx="3" fill="#2F5FF6" />
      <rect x="25" y="55" width="22" height="10" rx="3" fill="#1B3A6B" />
      <rect x="52" y="45" width="18" height="95" rx="3" fill="#FF4FA0" />
      <rect x="52" y="45" width="18" height="8" rx="3" fill="#D9377E" />
      <rect x="75" y="60" width="24" height="80" rx="3" fill="#35C48B" />
      <rect x="75" y="60" width="24" height="10" rx="3" fill="#16A34A" />
      <rect x="104" y="50" width="20" height="90" rx="3" fill="#FF8A3D" />
      <rect x="104" y="50" width="20" height="8" rx="3" fill="#D97706" />
      <rect x="129" y="40" width="25" height="100" rx="3" fill="#8B5CF6" />
      <rect x="129" y="40" width="25" height="10" rx="3" fill="#6D28D9" />
      <rect x="159" y="55" width="18" height="85" rx="3" fill="#F59E0B" />
      <rect x="159" y="55" width="18" height="8" rx="3" fill="#D97706" />
      {/* sparkles on books */}
      <motion.circle cx="36" cy="80" r="2" fill="#FFC94D" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0 }} />
      <motion.circle cx="87" cy="90" r="2" fill="#FFC94D" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }} />
      <motion.circle cx="142" cy="75" r="2.5" fill="#FFC94D" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }} />
    </svg>,

    // Slide 3: Phone with book content
    <svg key="phone" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
      </defs>
      {/* phone body */}
      <rect x="55" y="25" width="90" height="150" rx="16" fill="url(#phoneGrad)" />
      <rect x="60" y="35" width="80" height="125" rx="4" fill="#F8F6F0" />
      {/* notch */}
      <rect x="85" y="25" width="30" height="6" rx="3" fill="#111827" />
      {/* screen content - book lines */}
      <rect x="70" y="48" width="60" height="6" rx="2" fill="#2F5FF6" opacity="0.8" />
      <rect x="70" y="62" width="50" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="70" width="55" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="78" width="45" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="86" width="60" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="94" width="40" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="108" width="60" height="6" rx="2" fill="#35C48B" opacity="0.8" />
      <rect x="70" y="122" width="50" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="130" width="55" height="3" rx="1" fill="#D1D5DB" />
      <rect x="70" y="138" width="42" height="3" rx="1" fill="#D1D5DB" />
      {/* bottom bar */}
      <rect x="85" y="158" width="30" height="4" rx="2" fill="#D1D5DB" />
      {/* floating elements */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <circle cx="35" cy="70" r="12" fill="#FF4FA0" opacity="0.2" />
        <text x="35" y="75" textAnchor="middle" fontSize="14">📖</text>
      </motion.g>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}>
        <circle cx="168" cy="100" r="10" fill="#2F5FF6" opacity="0.2" />
        <text x="168" y="105" textAnchor="middle" fontSize="12">☕</text>
      </motion.g>
    </svg>,

    // Slide 4: Headphones with sound waves
    <svg key="audio" viewBox="0 0 200 200" className="h-52 w-auto">
      <defs>
        <linearGradient id="hpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F5FF6" />
          <stop offset="100%" stopColor="#1B3A6B" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="60" fill="#2F5FF6" opacity="0.06" />
      <circle cx="100" cy="100" r="45" fill="#2F5FF6" opacity="0.05" />
      {/* headphones band */}
      <path d="M50 105 Q50 45 100 40 Q150 45 150 105" fill="none" stroke="url(#hpGrad)" strokeWidth="10" strokeLinecap="round" />
      {/* left ear cup */}
      <rect x="38" y="95" width="28" height="38" rx="10" fill="#1B3A6B" />
      <rect x="42" y="100" width="20" height="28" rx="7" fill="#2F5FF6" />
      {/* right ear cup */}
      <rect x="134" y="95" width="28" height="38" rx="10" fill="#1B3A6B" />
      <rect x="138" y="100" width="20" height="28" rx="7" fill="#2F5FF6" />
      {/* sound waves */}
      <motion.path d="M100 70 Q110 80 100 90" fill="none" stroke="#35C48B" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} />
      <motion.path d="M100 60 Q118 78 100 96" fill="none" stroke="#35C48B" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
      <motion.path d="M100 50 Q125 75 100 100" fill="none" stroke="#35C48B" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} />
      {/* note icons */}
      <motion.text x="30" y="60" fontSize="16" animate={{ y: [60, 50, 60], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}>♪</motion.text>
      <motion.text x="160" y="55" fontSize="14" animate={{ y: [55, 45, 55], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.7 }}>♫</motion.text>
      <motion.text x="25" y="130" fontSize="12" animate={{ y: [130, 120, 130], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, delay: 1 }}>♪</motion.text>
    </svg>,
  ];

  return illustrations[kind] || illustrations[0];
}

export function Mascot() {
  // original round character: a cheerful speech-bubble blob
  return (
    <motion.svg
      viewBox="0 0 120 110"
      className="h-32 w-auto"
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      <ellipse cx="60" cy="52" rx="42" ry="38" fill="#FF4FA0" />
      <circle cx="47" cy="48" r="5" fill="#16181D" />
      <circle cx="73" cy="48" r="5" fill="#16181D" />
      <path d="M48 63 Q60 72 72 63" stroke="#16181D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M50 86 L46 104 L68 96 L74 82 Z" fill="#FF4FA0" />
      <circle cx="92" cy="24" r="7" fill="#FFC94D" />
    </motion.svg>
  );
}

function Centered({
  children,
  dark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  void dark;
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">{children}</div>
  );
}

function Dots({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-brand-blue" : "w-1.5 bg-divider"}`} />
      ))}
    </div>
  );
}

function AutoAdvance({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, seconds * 1000);
    return () => clearTimeout(t);
  }, [seconds, onDone]);
  return null;
}

const GOAL_ICONS: Record<string, React.ReactNode> = {
  zap: <Zap size={20} />,
  briefcase: <Briefcase size={20} />,
  "trending-up": <TrendingUp size={20} />,
  brain: <Brain size={20} />,
  flower: <Flower2 size={20} />,
  megaphone: <Megaphone size={20} />,
  users: <Users size={20} />,
};

function GoalPicker({
  goals,
  toggle,
  onNext,
}: {
  goals: string[];
  toggle: (g: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">What do you want to achieve?</h1>
      <p className={`mt-2 text-[13px] ${goals.length >= 3 ? "font-semibold text-accent-pink" : "text-white/50"}`}>
        Pick up to 3 goals · {goals.length}/3 selected
      </p>
      <div className="mt-6 flex-1 space-y-3">
        {GOALS.map((g) => {
          const sel = goals.includes(g.id);
          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={g.id}
              onClick={() => toggle(g.id)}
              aria-pressed={sel}
              className={`flex w-full items-center gap-3 rounded-card border-2 p-4 text-left ${
                sel ? "border-accent-green bg-accent-green/10" : "border-transparent bg-white/5"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${sel ? "bg-accent-green text-white" : "bg-white/10 text-white/70"}`}>
                {GOAL_ICONS[g.icon]}
              </span>
              <span className="flex-1 text-[15px] font-medium text-white">{g.label}</span>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${sel ? "border-accent-green bg-accent-green" : "border-white/30"}`}>
                {sel && <Check size={14} strokeWidth={3} className="text-white" />}
              </span>
            </motion.button>
          );
        })}
      </div>
      <button
        disabled={goals.length === 0}
        onClick={onNext}
        className={`mt-6 h-[52px] w-full rounded-button text-[16px] font-semibold ${
          goals.length ? "bg-brand-blue text-white active:bg-brand-blue-dk" : "bg-white/15 text-white/40"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function QuizPills({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: string[];
  onSelect: (o: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">{title}</h1>
      <div className="mt-6 flex-1 space-y-3">
        {options.map((o) => (
          <motion.button
            whileTap={{ scale: 0.98 }}
            key={o}
            onClick={() => {
              setPicked(o);
              onSelect(o);
            }}
            aria-pressed={picked === o}
            className={`block h-[56px] w-full rounded-button border-2 text-left px-4 text-[15px] font-medium ${
              picked === o ? "border-brand-blue bg-brand-blue/20 text-white" : "border-transparent bg-white/5 text-white/85"
            }`}
          >
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Maya R.", text: "Really helped me build a reading habit. Ten minutes a day and I finished 12 books this year." },
  { name: "Dev P.", text: "The audio summaries fit perfectly into my commute. My streak is at 84 days." },
  { name: "Ana L.", text: "Key points are sharp and practical — I actually apply what I learn." },
];

function SocialProof({ onNext }: { onNext: () => void }) {
  const [ratingOpen, setRatingOpen] = useState(false);
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <div className="no-scrollbar snap-x-mandatory mt-4 flex snap-y-mandatory overflow-x-auto" style={{ scrollSnapType: "x mandatory" }}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="w-full shrink-0 snap-start-always pr-6">
            <div className="rounded-card bg-white/8 p-6" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#FFC94D] text-[#FFC94D]" />
                ))}
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-white">“{t.text}”</p>
              <p className="mt-3 text-[13px] font-semibold text-white/60">{t.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <button
          onClick={() => setRatingOpen(true)}
          className="h-[52px] w-full rounded-button border border-white/30 text-[16px] font-semibold text-white"
        >
          Rate this app
        </button>
        <button onClick={onNext} className="mx-auto mt-3 block h-11 px-6 text-[14px] font-semibold text-white/50">
          Continue
        </button>
      </div>
      {ratingOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setRatingOpen(false)}>
          <div className="safe-bottom mx-auto w-full max-w-[480px] rounded-t-[24px] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center text-[19px] font-bold text-ink-900">Rate Gist</h2>
            <p className="mt-1 text-center text-[13px] text-ink-600">Enjoying it so far?</p>
            <div className="my-6 flex justify-center gap-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={36} className="fill-[#FFC94D] text-[#FFC94D]" />
              ))}
            </div>
            <button
              onClick={() => {
                setRatingOpen(false);
                onNext();
              }}
              className="h-[50px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PicksCarousel({
  ids,
  prefFormat,
  onAdd,
  onNext,
}: {
  ids: string[];
  prefFormat: "read" | "listen";
  onAdd: (id: string) => void;
  onNext: () => void;
}) {
  const books = ids.map((id) => BOOK_METAS.find((b) => b.id === id)!).filter(Boolean);
  return (
    <div className="flex min-h-full flex-col bg-ink-900 px-6 pb-8 pt-16">
      <h1 className="text-[28px] leading-tight font-bold text-white">Picked for you</h1>
      <p className="mt-2 text-[14px] text-white/60">Based on your goals — save any you like</p>
      <div className="no-scrollbar snap-x-mandatory mt-6 flex gap-4 overflow-x-auto pb-2">
        {books.map((b) => (
          <div key={b.id} className="w-[150px] shrink-0 snap-start-always">
            <BookCover book={b} className="aspect-[2/3] w-full" />
            <p className="mt-2 line-clamp-2 text-[14px] leading-tight font-semibold text-white">{b.title}</p>
            <p className="line-clamp-1 text-[12px] text-white/50">{b.author}</p>
            <button
              onClick={() => onAdd(b.id)}
              className={`mt-2 h-9 w-full rounded-full text-[13px] font-semibold ${
                prefFormat === "listen" ? "bg-brand-blue text-white" : "border border-white/40 text-white"
              }`}
            >
              Add to Library
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-auto h-[52px] w-full rounded-button bg-brand-blue text-[16px] font-semibold text-white active:bg-brand-blue-dk"
      >
        Continue
      </button>
    </div>
  );
}

const CRAFT_STEPS = [
  "Analyzing your goals…",
  "Matching summaries to your taste…",
  "Building your daily plan…",
];

function Crafting({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 4;
      });
    }, 90);
    return () => clearInterval(iv);
  }, [onDone]);
  const label = CRAFT_STEPS[Math.min(CRAFT_STEPS.length - 1, Math.floor(progress / 34))];
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink-900 px-8">
      <Mascot />
      <h1 className="mt-6 text-[26px] font-bold text-white">Crafting your experience</h1>
      <div className="mt-8 h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-white/15">
        <motion.div className="h-full rounded-full bg-brand-blue" animate={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-[13px] text-white/60">{label}</p>
    </div>
  );
}


