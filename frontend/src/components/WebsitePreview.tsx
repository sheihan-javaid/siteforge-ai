"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Gallery from "@/components/sections/Gallery";
import ContactFormSection from "@/components/sections/ContactFormSection";
import SEOHead from "@/components/SEOHead";
import RegenerateButton from "@/components/ui/RegenerateButton";
import { useEditableWebsite } from "@/hooks/useEditableWebsite";
import { useRegenerate } from "@/hooks/useRegenerate";
import type { Website } from "@/types/website";

interface WebsitePreviewProps {
  website: Website;
  prompt: string;
  onExport: (website: Website) => void;
}

function SectionWrapper({
  label,
  section,
  isRegenerating,
  onRegenerate,
  children,
}: {
  label: string;
  section: string;
  isRegenerating: boolean;
  onRegenerate: (section: string) => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Regenerate bar — appears on hover */}
      {hovered && (
        <div
          className="absolute top-2 right-2 z-40 flex items-center gap-2"
          style={{ pointerEvents: "all" }}
        >
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.15)",
              color: "rgba(14,165,233,0.6)",
            }}
          >
            {label}
          </span>
          <RegenerateButton
            section={section}
            isRegenerating={isRegenerating}
            onClick={() => onRegenerate(section)}
          />
        </div>
      )}

      {/* Hover outline */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            outline: "2px dashed rgba(14,165,233,0.25)",
            outlineOffset: "-2px",
          }}
        />
      )}

      {children}
    </div>
  );
}

export default function WebsitePreview({
  website,
  prompt,
  onExport,
}: WebsitePreviewProps) {
  const [showSEO, setShowSEO] = useState(false);

  const {
    website: editable,
    updateHero,
    updateNavbar,
    updateNavLink,
    updateFeature,
    updateFooter,
    setWebsite,
  } = useEditableWebsite(website);

  const { regenerating, regenerate } = useRegenerate();

  const handleRegenerate = (section: string) => {
    regenerate(section, prompt, editable, (updated) => {
      setWebsite(updated);
    });
  };

  return (
    <>
      {editable.seo && <SEOHead seo={editable.seo} />}

      {/* SEO Panel */}
      {editable.seo && (
        <div style={{ background: "#f8fafc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="container py-2 flex items-center justify-between">
            <button
              onClick={() => setShowSEO((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: showSEO ? "#0ea5e9" : "#64748b" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {showSEO ? "Hide SEO" : "View SEO Metadata"}
            </button>
            <div className="flex items-center gap-2">
              {showSEO && (
                <span className="text-xs" style={{ color: "#94a3b8" }}>
                  Auto-generated • edits reflect in export
                </span>
              )}
              <RegenerateButton
                section="seo"
                isRegenerating={regenerating === "seo"}
                onClick={() => handleRegenerate("seo")}
              />
            </div>
          </div>

          {showSEO && (
            <div
              className="container pb-4"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
            >
              {[
                { label: "Page Title", value: editable.seo.title, note: `${editable.seo.title.length}/60 chars` },
                { label: "Meta Description", value: editable.seo.description, note: `${editable.seo.description.length}/160 chars` },
                { label: "Keywords", value: editable.seo.keywords.join(", "), note: `${editable.seo.keywords.length} keywords` },
                { label: "OG Title", value: editable.seo.og_title ?? editable.seo.title, note: "Social sharing" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg p-3"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "#374151" }}>
                      {item.label}
                    </span>
                    <span className="text-xs" style={{ color: "#9ca3af" }}>
                      {item.note}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Regenerating overlay */}
      {regenerating && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
          style={{
            background: "rgba(3,7,18,0.9)",
            border: "1px solid rgba(14,165,233,0.3)",
            color: "#38bdf8",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
          </svg>
          Regenerating {regenerating} section...
        </div>
      )}

      {editable.navbar && (
        <SectionWrapper
          label="Navbar"
          section="navbar"
          isRegenerating={regenerating === "navbar"}
          onRegenerate={handleRegenerate}
        >
          <Navbar
            data={editable.navbar}
            onUpdateLogo={(v) => updateNavbar("logo", v)}
            onUpdateLink={updateNavLink}
          />
        </SectionWrapper>
      )}

      {editable.hero && (
        <SectionWrapper
          label="Hero"
          section="hero"
          isRegenerating={regenerating === "hero"}
          onRegenerate={handleRegenerate}
        >
          <Hero data={editable.hero} onUpdate={updateHero} />
        </SectionWrapper>
      )}

      {editable.features && editable.features.length > 0 && (
        <SectionWrapper
          label="Features"
          section="features"
          isRegenerating={regenerating === "features"}
          onRegenerate={handleRegenerate}
        >
          <Features data={editable.features} onUpdate={updateFeature} />
        </SectionWrapper>
      )}

      {editable.gallery && editable.gallery.length > 0 && (
        <SectionWrapper
          label="Gallery"
          section="gallery"
          isRegenerating={regenerating === "gallery"}
          onRegenerate={handleRegenerate}
        >
          <Gallery data={editable.gallery} />
        </SectionWrapper>
      )}

      {editable.contact && (
        <SectionWrapper
          label="Contact"
          section="contact"
          isRegenerating={regenerating === "contact"}
          onRegenerate={handleRegenerate}
        >
          <ContactFormSection data={editable.contact} />
        </SectionWrapper>
      )}

      {editable.footer && (
        <SectionWrapper
          label="Footer"
          section="footer"
          isRegenerating={regenerating === "footer"}
          onRegenerate={handleRegenerate}
        >
          <Footer data={editable.footer} onUpdate={updateFooter} />
        </SectionWrapper>
      )}

      <button
        className="hidden"
        id="internal-export-trigger"
        onClick={() => onExport(editable)}
      />
    </>
  );
}