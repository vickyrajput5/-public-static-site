import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Content, ContentState } from "@/types";
import { strapiApi } from "@/lib/strapi/client";
import { supabase } from "@/lib/supabase/client";
import { demoContents } from "@/lib/demo-data";

const initialState: ContentState = {
  contents: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchContents = createAsyncThunk(
  "content/fetchContents",
  async () => {
    try {
      // Try to fetch from Strapi first
      const response = await strapiApi.getContents();
      return response.data.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        description: item.attributes.description,
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
      }));
    } catch (error) {
      console.log("Strapi not available, trying Supabase...");

      // If Strapi is not available, try Supabase
      if (supabase) {
        try {
          const { data: supabaseData, error: supabaseError } = await supabase
            .from("contents")
            .select("*")
            .order("created_at", { ascending: false });

          if (supabaseError) {
            throw supabaseError;
          }

          return supabaseData.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        } catch (supabaseError) {
          console.error("Failed to fetch from Supabase:", supabaseError);
          // Fall back to demo data
          return demoContents;
        }
      }

      // If neither is available, return demo data
      console.log("No backend available, using demo data");
      return demoContents;
    }
  }
);

export const createContent = createAsyncThunk(
  "content/createContent",
  async (data: { title: string; description: string }) => {
    try {
      // Try to create in Strapi first
      const strapiResponse = await strapiApi.createContent(data);

      // Sync to Supabase if available
      if (supabase) {
        try {
          const supabaseData = {
            title: data.title,
            description: data.description,
          };

          await supabase
            .from("contents")
            .insert(supabaseData)
            .select()
            .single();
        } catch (error) {
          console.warn("Failed to sync to Supabase:", error);
        }
      }

      return {
        id: strapiResponse.data.id,
        title: strapiResponse.data.attributes.title,
        description: strapiResponse.data.attributes.description,
        createdAt: strapiResponse.data.attributes.createdAt,
        updatedAt: strapiResponse.data.attributes.updatedAt,
      };
    } catch (error) {
      console.log("Strapi not available, trying Supabase...");

      // If Strapi is not available, try Supabase
      if (supabase) {
        try {
          const supabaseData = {
            title: data.title,
            description: data.description,
          };

          const { data: supabaseResponse, error: supabaseError } =
            await supabase
              .from("contents")
              .insert(supabaseData)
              .select()
              .single();

          if (supabaseError) {
            throw supabaseError;
          }

          return {
            id: supabaseResponse.id,
            title: supabaseResponse.title,
            description: supabaseResponse.description,
            createdAt: supabaseResponse.created_at,
            updatedAt: supabaseResponse.updated_at,
          };
        } catch (supabaseError) {
          console.error("Failed to create in Supabase:", supabaseError);
          throw supabaseError;
        }
      }

      // If neither Strapi nor Supabase is available, create a demo entry
      const newId = Math.max(...demoContents.map((c) => c.id)) + 1;
      const newContent = {
        id: newId,
        title: data.title,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("No backend available, created demo content:", newContent);
      return newContent;
    }
  }
);

export const updateContent = createAsyncThunk(
  "content/updateContent",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { title?: string; description?: string };
  }) => {
    try {
      // Update in Strapi
      const strapiResponse = await strapiApi.updateContent(id, data);

      // Sync to Supabase if available
      if (supabase) {
        try {
          await supabase.from("contents").update(data).eq("id", id);
        } catch (error) {
          console.warn("Failed to sync to Supabase:", error);
        }
      }

      return {
        id: strapiResponse.data.id,
        title: strapiResponse.data.attributes.title,
        description: strapiResponse.data.attributes.description,
        createdAt: strapiResponse.data.attributes.createdAt,
        updatedAt: strapiResponse.data.attributes.updatedAt,
      };
    } catch (error) {
      // If Strapi is not available, update demo data
      console.log("Strapi not available, updated demo content:", { id, data });
      return {
        id,
        title: data.title || "Updated Title",
        description: data.description || "Updated Description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }
);

export const deleteContent = createAsyncThunk(
  "content/deleteContent",
  async (id: number) => {
    try {
      // Delete from Strapi
      await strapiApi.deleteContent(id);

      // Delete from Supabase if available
      if (supabase) {
        try {
          await supabase.from("contents").delete().eq("id", id);
        } catch (error) {
          console.warn("Failed to sync to Supabase:", error);
        }
      }

      return id;
    } catch (error) {
      // If Strapi is not available, just return the ID for local deletion
      console.log("Strapi not available, deleted demo content:", id);
      return id;
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contents
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContents.fulfilled,
        (state, action: PayloadAction<Content[]>) => {
          state.loading = false;
          state.contents = action.payload;
        }
      )
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contents";
      })
      // Create content
      .addCase(createContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createContent.fulfilled,
        (state, action: PayloadAction<Content>) => {
          state.loading = false;
          state.contents.push(action.payload);
        }
      )
      .addCase(createContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create content";
      })
      // Update content
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateContent.fulfilled,
        (state, action: PayloadAction<Content>) => {
          state.loading = false;
          const index = state.contents.findIndex(
            (content) => content.id === action.payload.id
          );
          if (index !== -1) {
            state.contents[index] = action.payload;
          }
        }
      )
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update content";
      })
      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteContent.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.contents = state.contents.filter(
            (content) => content.id !== action.payload
          );
        }
      )
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete content";
      });
  },
});

export const { clearError } = contentSlice.actions;
export default contentSlice.reducer;
