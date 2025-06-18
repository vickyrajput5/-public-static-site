// Content types
export interface Content {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiContent {
  id: number;
  attributes: {
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Supabase types
export interface SupabaseContent {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Form types
export interface ContentFormData {
  title: string;
  description: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Redux state types
export interface ContentState {
  contents: Content[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  content: ContentState;
}
