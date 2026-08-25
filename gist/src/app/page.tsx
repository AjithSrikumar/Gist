"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/LogoMark";
import { useStore } from "@/lib/store";

export default function SplashRedirect() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const onboarded = useStore((s) => s.onboarded);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      router.replace(onboarded ? "/for-you" : "/onboarding");
    }, 700);
    return () => clearTimeout(t);
  }, [hydrated, onboarded, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-blue">
      <div className="mb-10 w-full max-w-[480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 flex max-w-[300px] items-center gap-3 rounded-card bg-white/10 p-4"
        >
          <div className="h-12 w-12 rounded-lg bg-accent-orange/80" />
          <div>
            <p className="text-[13px] font-bold text-white">3 key points to a streak</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "66%" }}
                transition={{ duration: 1.2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }}>
        <LogoMark />
      </motion.div>
      <p className="mt-3 text-xl font-extrabold tracking-tight text-white">Gist</p>
    </div>
  );
}

