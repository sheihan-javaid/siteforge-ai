import { useState, useCallback } from "react";
import { regenerateSection } from "@/lib/api";
import type { Website } from "@/types/website";

interface UseRegenerateReturn {
  regenerating: string | null;
  error: string | null;
  regenerate: (
    section: string,
    prompt: string,
    currentWebsite: Website,
    onSuccess: (updated: Website) => void
  ) => Promise<void>;
}

export function useRegenerate(): UseRegenerateReturn {
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const regenerate = useCallback(
    async (
      section: string,
      prompt: string,
      currentWebsite: Website,
      onSuccess: (updated: Website) => void
    ): Promise<void> => {
      setRegenerating(section);
      setError(null);
      try {
        const updated = await regenerateSection(prompt, section, currentWebsite);
        onSuccess(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Regeneration failed");
      } finally {
        setRegenerating(null);
      }
    },
    []
  );

  return { regenerating, error, regenerate };
}