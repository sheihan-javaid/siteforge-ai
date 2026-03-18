"use client";

import { useEffect } from "react";
import type { SEO } from "@/types/website";

interface SEOHeadProps {
  seo: SEO;
}

export default function SEOHead({ seo }: SEOHeadProps) {
  useEffect(() => {
    // Update page title
    document.title = seo.title;

    // Update or create meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", seo.description);
    setMeta("keywords", seo.keywords.join(", "));
    setMeta("og:title", seo.og_title ?? seo.title, true);
    setMeta("og:description", seo.og_description ?? seo.description, true);
    setMeta("og:type", "website", true);
  }, [seo]);

  return null;
}