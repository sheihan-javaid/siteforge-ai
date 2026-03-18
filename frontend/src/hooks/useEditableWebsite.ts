import { useState, useCallback } from "react";
import type { Website, Feature, Navbar } from "@/types/website";

const EMPTY_WEBSITE: Website = {
  navbar: { logo: "", links: [] },
  hero: { title: "", subtitle: "", cta: "" },
  features: [],
  footer: { text: "" },
};

interface UseEditableWebsiteReturn {
  website: Website;
  setWebsite: (website: Website) => void;
  updateHero: (field: keyof Website["hero"], value: string) => void;
  updateNavbar: (field: keyof Navbar, value: string) => void;
  updateNavLink: (index: number, value: string) => void;
  updateFeature: (index: number, field: keyof Feature, value: string) => void;
  updateFooter: (field: keyof Website["footer"], value: string) => void;
}

export function useEditableWebsite(initial: Website | null): UseEditableWebsiteReturn {
  const [website, setWebsiteState] = useState<Website>(initial ?? EMPTY_WEBSITE);

  const setWebsite = useCallback((newWebsite: Website) => {
    setWebsiteState(newWebsite);
  }, []);

  const updateHero = useCallback(
    (field: keyof Website["hero"], value: string) => {
      setWebsiteState((prev) => ({
        ...prev,
        hero: { ...prev.hero, [field]: value },
      }));
    },
    []
  );

  const updateNavbar = useCallback(
    (field: keyof Navbar, value: string) => {
      setWebsiteState((prev) => ({
        ...prev,
        navbar: { ...prev.navbar, [field]: value },
      }));
    },
    []
  );

  const updateNavLink = useCallback((index: number, value: string) => {
    setWebsiteState((prev) => {
      const updatedLinks = prev.navbar.links.map((link, i) =>
        i === index ? value : link
      );
      return { ...prev, navbar: { ...prev.navbar, links: updatedLinks } };
    });
  }, []);

  const updateFeature = useCallback(
    (index: number, field: keyof Feature, value: string) => {
      setWebsiteState((prev) => {
        const updatedFeatures = prev.features.map((f, i) =>
          i === index ? { ...f, [field]: value } : f
        );
        return { ...prev, features: updatedFeatures };
      });
    },
    []
  );

  const updateFooter = useCallback(
    (field: keyof Website["footer"], value: string) => {
      setWebsiteState((prev) => ({
        ...prev,
        footer: { ...prev.footer, [field]: value },
      }));
    },
    []
  );

  return {
    website,
    setWebsite,
    updateHero,
    updateNavbar,
    updateNavLink,
    updateFeature,
    updateFooter,
  };
}