import { useState, useCallback } from "react";
import { generateWebsite } from "@/lib/api";
import type { Website } from "@/types/website";

interface UseGenerateReturn {
  website: Website | null;
  loading: boolean;
  error: string | null;
  generate: (prompt: string) => Promise<void>;
  reset: () => void;
  loadWebsite: (website: Website) => void;  // ← add this
}

export function useGenerate(): UseGenerateReturn {
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string) => {
    setLoading(true);
    setError(null);
    setWebsite(null);
    try {
      const data = await generateWebsite(prompt);
      setWebsite(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setWebsite(null);
    setError(null);
    setLoading(false);
  }, []);

  const loadWebsite = useCallback((website: Website) => {
    setWebsite(website);
    setError(null);
  }, []);

  return { website, loading, error, generate, reset, loadWebsite };
}