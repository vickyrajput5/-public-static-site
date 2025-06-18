import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchContentFromSupabase, 
  createContentInSupabase, 
  updateContentInSupabase, 
  deleteContentFromSupabase,
  ContentItem
} from '../supabase/contentService';

// Define the state interface
interface SupabaseContentState {
  items: ContentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: SupabaseContentState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async thunks for Supabase operations
export const fetchSupabaseContent = createAsyncThunk(
  'supabaseContent/fetchContent',
  async () => {
    return await fetchContentFromSupabase();
  }
);

export const createSupabaseContent = createAsyncThunk(
  'supabaseContent/createContent',
  async (content: { title: string; description: string }) => {
    return await createContentInSupabase(content);
  }
);

export const updateSupabaseContent = createAsyncThunk(
  'supabaseContent/updateContent',
  async ({ id, content }: { id: number; content: Partial<{ title: string; description: string }> }) => {
    return await updateContentInSupabase(id, content);
  }
);

export const deleteSupabaseContent = createAsyncThunk(
  'supabaseContent/deleteContent',
  async (id: number) => {
    await deleteContentFromSupabase(id);
    return id;
  }
);

// Create the Supabase content slice
const supabaseContentSlice = createSlice({
  name: 'supabaseContent',
  initialState,
  reducers: {
    // Add a reducer to handle real-time updates
    contentUpdated: (state, action: PayloadAction<ContentItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        // Update existing item
        state.items[index] = action.payload;
      } else {
        // Add new item
        state.items.push(action.payload);
      }
    },
    contentDeleted: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch content cases
      .addCase(fetchSupabaseContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupabaseContent.fulfilled, (state, action: PayloadAction<ContentItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSupabaseContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch content';
      })
      
      // Create content cases
      .addCase(createSupabaseContent.fulfilled, (state, action: PayloadAction<ContentItem>) => {
        state.items.push(action.payload);
      })
      
      // Update content cases
      .addCase(updateSupabaseContent.fulfilled, (state, action: PayloadAction<ContentItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Delete content cases
      .addCase(deleteSupabaseContent.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { contentUpdated, contentDeleted } = supabaseContentSlice.actions;
export default supabaseContentSlice.reducer;