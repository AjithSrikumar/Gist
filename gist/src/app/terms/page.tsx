"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ScreenPadding } from "@/components/AppShell";

export default function TermsPage() {
  const router = useRouter();
  return (
    <ScreenPadding>
      <div className="mx-auto max-w-[480px]">
        <header className="flex items-center gap-1 px-2 pt-3 pb-1">
          <button aria-label="Back" onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full">
            <ChevronLeft size={24} className="text-ink-900" />
          </button>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink-900">Terms of Use</h1>
        </header>
        <div className="px-4 mt-4 space-y-4 text-[14px] leading-relaxed text-ink-600">
          <p>Last updated: August 28, 2026</p>
          <h2 className="text-[16px] font-semibold text-ink-900">1. Acceptance of Terms</h2>
          <p>By using Gist, you agree to these Terms of Use. If you do not agree, please do not use the service.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">2. Description of Service</h2>
          <p>Gist provides book summaries and key insights to help you learn faster. Content is for informational purposes only.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">4. Intellectual Property</h2>
          <p>All content, design, and code are the property of Gist and protected by intellectual property laws.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">5. Limitation of Liability</h2>
          <p>Gist is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from use of the service.</p>
          <h2 className="text-[16px] font-semibold text-ink-900">6. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us at support@gist.app.</p>
        </div>
      </div>
    </ScreenPadding>
  );
}
