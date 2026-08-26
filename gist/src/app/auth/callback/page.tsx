"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase-browser";
import { useStore } from "@/lib/store";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      router.replace("/profile");
    });
  }, [router, setUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-ink-600">Signing you in…</p>
    </div>
  );
}