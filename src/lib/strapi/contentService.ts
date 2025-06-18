import axios from 'axios';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export interface StrapiContentItem {
  id: number;
  attributes: {
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
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

// Fetch all content items from Strapi
export const fetchContentFromStrapi = async (): Promise<StrapiResponse<StrapiContentItem[]>> => {
  try {
    const response = await axios.get(`${strapiUrl}/api/contents?populate=*`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content from Strapi:', error);
    throw error;
  }
};

// Fetch a single content item from Strapi
export const fetchSingleContentFromStrapi = async (id: number): Promise<StrapiResponse<StrapiContentItem>> => {
  try {
    const response = await axios.get(`${strapiUrl}/api/contents/${id}?populate=*`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content with id ${id} from Strapi:`, error);
    throw error;
  }
};

// Create a new content item in Strapi
export const createContentInStrapi = async (content: { title: string; description: string }): Promise<StrapiResponse<StrapiContentItem>> => {
  try {
    const response = await axios.post(`${strapiUrl}/api/contents`, {
      data: content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating content in Strapi:', error);
    throw error;
  }
};

// Update a content item in Strapi
export const updateContentInStrapi = async (id: number, content: { title?: string; description?: string }): Promise<StrapiResponse<StrapiContentItem>> => {
  try {
    const response = await axios.put(`${strapiUrl}/api/contents/${id}`, {
      data: content
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating content with id ${id} in Strapi:`, error);
    throw error;
  }
};

// Delete a content item from Strapi
export const deleteContentFromStrapi = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${strapiUrl}/api/contents/${id}`);
  } catch (error) {
    console.error(`Error deleting content with id ${id} from Strapi:`, error);
    throw error;
  }
};