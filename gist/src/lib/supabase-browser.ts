"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

// User data sync functions
export async function loadUserData(userId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function saveUserData(userId: string, payload: {
  library?: any;
  highlights?: any;
  ratings?: any;
  streak_count?: number;
  streak_week?: boolean[];
  last_finish_date?: string | null;
  is_subscribed?: boolean;
}) {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("user_data")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase
      .from("user_data")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } else {
    await supabase
      .from("user_data")
      .insert({ user_id: userId, ...payload });
  }
}