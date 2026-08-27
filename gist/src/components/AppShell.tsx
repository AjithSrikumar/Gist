"use client";

import { Home, Compass, Bookmark, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const TABS = [
  { href: "/for-you", label: "For You", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/library", label: "Library", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg-cream flex justify-center">
      <main className="relative w-full max-w-[480px] min-h-dvh bg-bg-cream shadow-[0_0_60px_rgba(0,0,0,0.15)]">
        {children}
      </main>
    </div>
  );
}

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="safe-bottom w-full max-w-[480px] border-t border-divider bg-white/95 backdrop-blur">
        <div className="flex h-[62px] items-stretch">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-1"
                aria-current={active ? "page" : undefined}
              >
                <motion.span whileTap={{ scale: 0.85 }}>
                  <Icon size={22} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-brand-blue" : "text-ink-600"} />
                </motion.span>
                <span
                  className={`text-[10px] font-semibold ${active ? "text-brand-blue" : "text-ink-600"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function ScreenPadding({ children }: { children: ReactNode }) {
  return <div className="pb-[100px]">{children}</div>;
}
