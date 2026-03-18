"use client";

import type { Hero as HeroType } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface HeroProps {
  data: HeroType;
  onUpdate?: (field: keyof HeroType, value: string) => void;
}

export default function Hero({ data, onUpdate }: HeroProps) {
  return (
    <section
      className="w-full py-28 md:py-36 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #0c1a35 50%, #0f172a 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.25), transparent)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative flex flex-col items-center text-center gap-8">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(14,165,233,0.1)",
            border: "1px solid rgba(14,165,233,0.25)",
            color: "#38bdf8",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#38bdf8",
              boxShadow: "0 0 6px #38bdf8",
            }}
          />
          AI Generated Website
        </div>

        {onUpdate ? (
          <>
            {/* Editable Title */}
            <EditableText
              value={data.title}
              onChange={(v) => onUpdate?.("title", v)}
              as="h1"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />

            {/* Editable Subtitle */}
            <EditableText
              value={data.subtitle}
              onChange={(v) => onUpdate?.("subtitle", v)}
              as="p"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "1.15rem",
                maxWidth: "560px",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
              multiline
            />

            {/* Editable CTA */}
            <EditableText
              value={data.cta}
              onChange={(v) => onUpdate?.("cta", v)}
              as="span"
              className="px-8 py-3.5 rounded-xl font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                boxShadow:
                  "0 4px 24px rgba(14,165,233,0.4), 0 0 0 1px rgba(14,165,233,0.2)",
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
              }}
            />
          </>
        ) : (
          <>
            {/* Static Title */}
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {data.title}
            </h1>

            {/* Static Subtitle */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "1.15rem",
                maxWidth: "560px",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              {data.subtitle}
            </p>

            {/* CTA Button */}
            <a
              href={(data as any).ctaLink || "#"}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                boxShadow:
                  "0 4px 24px rgba(14,165,233,0.4), 0 0 0 1px rgba(14,165,233,0.2)",
                fontSize: "0.95rem",
              }}
            >
              {data.cta}
            </a>
          </>
        )}
      </div>
    </section>
  );
}