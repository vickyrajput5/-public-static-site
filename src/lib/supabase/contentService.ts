import { supabase } from "./client";

export interface ContentItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Fetch all content items from Supabase
export const fetchContentFromSupabase = async (): Promise<ContentItem[]> => {
  if (!supabase) {
    console.warn("Supabase client not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching content from Supabase:", error);
    throw error;
  }

  return data || [];
};

// Create a new content item in Supabase
export const createContentInSupabase = async (
  content: Omit<ContentItem, "id" | "created_at" | "updated_at">
): Promise<ContentItem> => {
  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  const { data, error } = await supabase
    .from("contents")
    .insert([content])
    .select()
    .single();

  if (error) {
    console.error("Error creating content in Supabase:", error);
    throw error;
  }

  return data;
};

// Update a content item in Supabase
export const updateContentInSupabase = async (
  id: number,
  content: Partial<Omit<ContentItem, "id" | "created_at" | "updated_at">>
): Promise<ContentItem> => {
  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  const { data, error } = await supabase
    .from("contents")
    .update(content)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating content in Supabase:", error);
    throw error;
  }

  return data;
};

// Delete a content item from Supabase
export const deleteContentFromSupabase = async (id: number): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  const { error } = await supabase.from("contents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting content from Supabase:", error);
    throw error;
  }
};

// Subscribe to real-time changes in the contents table
export const subscribeToContentChanges = (callback: (payload: any) => void) => {
  if (!supabase) {
    console.warn("Supabase client not configured, cannot subscribe to changes");
    return null;
  }

  return supabase
    .channel("contents-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "contents" },
      callback
    )
    .subscribe();
};
