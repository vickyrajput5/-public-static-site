import { store } from "../redux/store";
import { fetchContents } from "../redux/contentSlice";
import {
  fetchSupabaseContent,
  createSupabaseContent,
  updateSupabaseContent,
  deleteSupabaseContent,
} from "../redux/supabaseContentSlice";
import { subscribeToContentChanges } from "../supabase/contentService";
import { StrapiContentItem } from "../strapi/contentService";
import { ContentItem } from "../supabase/contentService";

// Convert Strapi content format to Supabase format
export const convertStrapiToSupabase = (
  strapiItem: StrapiContentItem
): Omit<ContentItem, "id" | "created_at" | "updated_at"> => {
  return {
    title: strapiItem.attributes.title,
    description: strapiItem.attributes.description,
  };
};

// Convert Supabase content format to Strapi format
export const convertSupabaseToStrapi = (
  supabaseItem: ContentItem
): { title: string; description: string } => {
  return {
    title: supabaseItem.title,
    description: supabaseItem.description,
  };
};

// Initialize synchronization between Strapi and Supabase
export const initializeSync = async () => {
  try {
    // Fetch initial data from both sources
    await store.dispatch(fetchContents());
    await store.dispatch(fetchSupabaseContent());

    // Subscribe to real-time changes from Supabase
    const subscription = subscribeToContentChanges((payload) => {
      console.log("Real-time update from Supabase:", payload);

      // Handle different types of changes
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case "INSERT":
          // New record added in Supabase - sync to Strapi
          // This would typically be handled by a server-side webhook or function
          console.log("New record in Supabase:", newRecord);
          break;

        case "UPDATE":
          // Record updated in Supabase - sync to Strapi
          console.log("Updated record in Supabase:", newRecord);
          break;

        case "DELETE":
          // Record deleted in Supabase - sync to Strapi
          console.log("Deleted record in Supabase:", oldRecord);
          break;

        default:
          console.log("Unknown event type:", eventType);
      }
    });

    return subscription;
  } catch (error) {
    console.error("Error initializing sync:", error);
    throw error;
  }
};

// Sync a content item from Strapi to Supabase
export const syncStrapiToSupabase = async (
  strapiItem: StrapiContentItem
): Promise<void> => {
  try {
    // Directly create new item in Supabase (no Redux state check)
    // You may want to implement a real check using Supabase queries if needed
    await store.dispatch(
      createSupabaseContent(convertStrapiToSupabase(strapiItem))
    );
  } catch (error) {
    console.error("Error syncing from Strapi to Supabase:", error);
    throw error;
  }
};

// Handle conflict resolution between Strapi and Supabase
export const resolveConflict = (
  strapiItem: StrapiContentItem,
  supabaseItem: ContentItem
): { title: string; description: string } => {
  // Simple conflict resolution strategy: most recent update wins
  const strapiUpdatedAt = new Date(strapiItem.attributes.updatedAt);
  const supabaseUpdatedAt = new Date(supabaseItem.updated_at);

  if (strapiUpdatedAt > supabaseUpdatedAt) {
    return convertStrapiToSupabase(strapiItem);
  } else {
    return {
      title: supabaseItem.title,
      description: supabaseItem.description,
    };
  }
};
