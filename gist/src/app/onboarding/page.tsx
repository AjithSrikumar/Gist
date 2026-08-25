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
import { BOOK_METAS, booksForGoal } from "@/data/books/index";
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
  { title: "Get the key ideas from bestselling books", body: "15-minute summaries you'll actually finish." },
  { title: "#1 most downloaded book-summary app", body: "Join millions growing a little every day." },
  { title: "Key ideas from the world's best nonfiction", body: "Hand-picked titles across money, career, and life." },
  { title: "Read on the go", body: "Bite-sized key points, perfect for a coffee break." },
  { title: "Or listen & grow", body: "Narrated summaries that fit your commute." },
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
  const shapes = [
    <rect key="a" x="30" y="20" width="100" height="140" rx="10" fill="#2F5FF6" />,
    <circle key="b" cx="80" cy="90" r="62" fill="#FF4FA0" />,
    <polygon key="c" points="80,22 138,120 22,120" fill="#FF8A3D" />,
    <path key="d" d="M20 130 Q80 30 140 130 Z" fill="#35C48B" />,
    <rect key="e" x="24" y="46" width="112" height="88" rx="44" fill="#8B5CF6" />,
  ];
  return (
    <svg viewBox="0 0 160 180" className="h-44 w-auto opacity-90">
      {shapes[kind]}
    </svg>
  );
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


