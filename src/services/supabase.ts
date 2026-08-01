import { createClient } from "@supabase/supabase-js";
import type { Person } from "@/lib/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

// Local-first for now. Once a `people` table is deployed, implement upsert here.
export async function syncPeople(_people: Person[]): Promise<boolean> {
  if (!supabase) return false;
  return true;
}