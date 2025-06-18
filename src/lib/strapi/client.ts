import axios from "axios";
import { StrapiResponse, StrapiContent } from "@/types";

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

export const strapiClient = axios.create({
  baseURL: `${strapiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
    ...(strapiToken && { Authorization: `Bearer ${strapiToken}` }),
  },
  timeout: 5000, // 5 second timeout
});

// Add response interceptor to handle errors
strapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Strapi server is not running. Please start your Strapi server at http://localhost:1337"
      );
    }
    if (error.response?.status === 401) {
      throw new Error(
        "Invalid Strapi API token. Please check your STRAPI_API_TOKEN environment variable."
      );
    }
    throw error;
  }
);

// Strapi API methods
export const strapiApi = {
  // Get all contents
  getContents: async (): Promise<StrapiResponse<StrapiContent[]>> => {
    try {
      const response = await strapiClient.get("/contents");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch contents from Strapi:", error);
      // Return empty data structure when Strapi is not available
      return {
        data: [],
        meta: {},
      };
    }
  },

  // Get single content by ID
  getContent: async (id: number): Promise<StrapiResponse<StrapiContent>> => {
    const response = await strapiClient.get(`/contents/${id}`);
    return response.data;
  },

  // Create new content
  createContent: async (data: {
    title: string;
    description: string;
  }): Promise<StrapiResponse<StrapiContent>> => {
    const response = await strapiClient.post("/contents", { data });
    return response.data;
  },

  // Update content
  updateContent: async (
    id: number,
    data: { title?: string; description?: string }
  ): Promise<StrapiResponse<StrapiContent>> => {
    const response = await strapiClient.put(`/contents/${id}`, { data });
    return response.data;
  },

  // Delete content
  deleteContent: async (id: number): Promise<void> => {
    await strapiClient.delete(`/contents/${id}`);
  },
};
