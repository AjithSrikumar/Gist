"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ScreenPadding } from "@/components/AppShell";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <ScreenPadding>
      <div className="mx-auto max-w-[480px]">
        <header className="flex items-center gap-1 px-2 pt-3 pb-1">
          <button aria-label="Back" onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronLeft size={24} className="text-ink-900" />
          </button>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Privacy Policy</h1>
        </header>
        <div className="px-4 mt-4 space-y-4 text-[14px] leading-relaxed text-ink-600">
          <p>Last updated: August 28, 2026</p>
          <h2 className="text-[16px] font-semibold text-ink-900">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your account details (name, email), reading progress, highlights, and preferences.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve the Gist service, personalize your experience, and sync your data across devices.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">3. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with service providers who help us operate the app.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">5. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at support@gist.app.</p>
        </div>
      </div>
    </ScreenPadding>
  );
}
