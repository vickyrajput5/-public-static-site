import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Only create the client if we have valid environment variables
export const supabase =
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-key"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Database types
export type Database = {
  public: {
    Tables: {
      contents: {
        Row: {
          id: number;
          title: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
