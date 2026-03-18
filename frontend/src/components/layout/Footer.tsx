"use client";

import type { Footer as FooterType } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface FooterProps {
  data: FooterType;
  onUpdate?: (field: keyof FooterType, value: string) => void;
}

export default function Footer({ data, onUpdate }: FooterProps) {
  return (
    <footer
      className="w-full py-10"
      style={{
        background: "#070c18",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container flex flex-col items-center gap-4">
        {/* Social links */}
        {data.social && data.social.length > 0 && (
          <div className="flex items-center gap-4">
            {data.social.map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#38bdf8";
                  e.currentTarget.style.borderColor =
                    "rgba(14,165,233,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.08)";
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
        )}

        {/* Footer text */}
        {onUpdate ? (
          <EditableText
            value={data.text ?? ""}
            onChange={(v) => onUpdate?.("text", v)}
            as="p"
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.8rem",
            }}
          />
        ) : (
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.8rem",
            }}
          >
            {data.text}
          </p>
        )}
      </div>
    </footer>
  );
}