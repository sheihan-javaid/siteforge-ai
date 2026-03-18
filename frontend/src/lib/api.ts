import axios, { AxiosError } from "axios";
import type {
  Website,
  GenerateResponse,
  PromptRequest,
} from "@/types/website";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      const detail =
        error.response.data?.detail ||
        error.response.data?.error ||
        error.response.data?.message ||
        "An unexpected error occurred";

      if (status === 422)
        throw new Error(`Invalid request: ${detail}`);
      if (status === 429)
        throw new Error("Too many requests. Please wait and try again.");
      if (status === 502)
        throw new Error(`AI service error: ${detail}`);
      if (status === 504)
        throw new Error("Request timed out. Please try again.");

      throw new Error(detail);
    }

    if (error.code === "ECONNABORTED")
      throw new Error("Request timed out. Please try again.");

    throw new Error("Network error. Please check your connection.");
  }
);

const ENDPOINTS = {
    GENERATE: "/v1/generate/generate",
};

export const generateWebsite = async (
  prompt: string
): Promise<Website> => {
  const trimmed = prompt.trim();

  if (!trimmed || trimmed.length < 10)
    throw new Error("Prompt must be at least 10 characters.");

  if (trimmed.length > 2000)
    throw new Error("Prompt must not exceed 2000 characters.");

  const payload: PromptRequest = { prompt: trimmed };

  if (process.env.NODE_ENV === "development") {
    console.log("Generating website with prompt:", trimmed);
  }

  const { data } = await apiClient.post<GenerateResponse>(
    ENDPOINTS.GENERATE,
    payload
  );

  if (data.status === "error") {
    throw new Error(data.error || "Failed to generate website.");
  }

  if (!data.data) {
    throw new Error("Invalid response from server.");
  }

  return data.data;
};

export const exportWebsite = async (website: Website, siteName: string): Promise<void> => {
  const response = await apiClient.post(
    "/v1/export/export",
    { ...website, site_name: siteName },
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${siteName.toLowerCase().replace(/\s+/g, "-")}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export interface Project {
  id: string;
  prompt: string;
  website: Website;
  created_at: string;
  updated_at: string;
}

export const saveProject = async (prompt: string, website: Website): Promise<{ id: string }> => {
  const { data } = await apiClient.post("/v1/projects/", { prompt, website });
  return data;
};

export const listProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get("/v1/projects/");
  return data;
};

export const getProject = async (id: string): Promise<Project> => {
  const { data } = await apiClient.get(`/v1/projects/${id}`);
  return data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/projects/${id}`);
};

export const regenerateSection = async (
  prompt: string,
  section: string,
  currentWebsite: Website
): Promise<Website> => {
  const { data } = await apiClient.post("/v1/generate/regenerate", {
    prompt,
    section,
    current_website: currentWebsite,
  });
  return data.data;
};