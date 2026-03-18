"use client";

import { useState, useEffect, useRef } from "react";
import { useGenerate } from "@/hooks/useGenerate";
import WebsitePreview from "@/components/WebsitePreview";
import ProjectHistory from "@/components/ProjectHistory";
import { exportWebsite } from "@/lib/api";
import type { Website } from "@/types/website";

function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, #030712 100%)",
        }}
      />
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(14,165,233,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

function Particles() {
  const [mounted, setMounted] = useState(false);
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.width}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: `rgba(14,165,233,${p.opacity})`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const PLACEHOLDERS = [
  "A SaaS landing page for a project management tool...",
  "A portfolio site for a freelance photographer...",
  "An e-commerce store for handmade jewelry...",
  "A startup landing page with pricing and testimonials...",
  "A personal blog with a dark, editorial aesthetic...",
];

function useTypingPlaceholder() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = PLACEHOLDERS[index];
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        38
      );
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        18
      );
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, deleting, index]);

  return displayed;
}

function Steps({ active }: { active: number }) {
  const steps = ["Describe", "Generate", "Preview"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500"
              style={{
                background:
                  i <= active
                    ? "linear-gradient(135deg, #0ea5e9, #06b6d4)"
                    : "rgba(255,255,255,0.06)",
                color: i <= active ? "white" : "rgba(255,255,255,0.3)",
                boxShadow: i === active ? "0 0 12px rgba(14,165,233,0.5)" : "none",
              }}
            >
              {i < active ? "✓" : i + 1}
            </div>
            <span
              className="text-xs font-medium transition-colors duration-300"
              style={{
                color:
                  i === active
                    ? "rgba(255,255,255,0.9)"
                    : i < active
                    ? "rgba(14,165,233,0.8)"
                    : "rgba(255,255,255,0.25)",
              }}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-8 h-px transition-all duration-500"
              style={{
                background:
                  i < active
                    ? "linear-gradient(90deg, #0ea5e9, #06b6d4)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function LoadingOverlay() {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = [
    "Analyzing your prompt",
    "Crafting layout structure",
    "Generating content",
    "Polishing the details",
  ];

  useEffect(() => {
    const d = setInterval(() => setDots((x) => (x + 1) % 4), 400);
    const p = setInterval(() => setPhase((x) => (x + 1) % phases.length), 2000);
    return () => {
      clearInterval(d);
      clearInterval(p);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#030712]/80 backdrop-blur-sm rounded-2xl">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#0ea5e9", animation: "spin 1s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "#06b6d4", animation: "spin 1.5s linear infinite reverse" }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent)",
              animation: "pulse-anim 2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-white/90">
            {phases[phase]}
            {".".repeat(dots)}
          </p>
          <p className="text-xs text-white/30">This may take a few seconds</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { website, loading, error, generate, reset, loadWebsite } = useGenerate();
  const placeholder = useTypingPlaceholder();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (trimmed.length < 10) return;
    await generate(trimmed);
  };

  const handleExport = async (exportableWebsite: Website) => {
    setExporting(true);
    try {
      await exportWebsite(exportableWebsite, exportableWebsite.hero?.title || "my-website");
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  };

  const charPercent = Math.min((prompt.length / 2000) * 100, 100);
  const isReady = prompt.trim().length >= 10;

  return (
    <>
      <style>{`
        :root {
          --font-display: var(--font-syne), sans-serif;
          --font-body: var(--font-dm), sans-serif;
        }

        body {
          font-family: var(--font-body);
          background: #030712;
          color: #f1f5f9;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-anim {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease both;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }

        .glow-text {
          font-family: var(--font-display);
          background: linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .textarea-custom {
          font-family: var(--font-body);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          resize: none;
          transition: all 0.3s ease;
          caret-color: #0ea5e9;
        }

        .textarea-custom::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .textarea-custom:focus {
          outline: none;
          border-color: rgba(14,165,233,0.5);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
          background: rgba(14,165,233,0.04);
        }

        .btn-generate {
          font-family: var(--font-display);
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          border: none;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-generate::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-generate:hover::before { opacity: 1; }
        .btn-generate:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,165,233,0.35); }
        .btn-generate:active { transform: translateY(0); }
        .btn-generate:disabled { opacity: 0.4; transform: none; box-shadow: none; cursor: not-allowed; }

        .example-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-body);
          white-space: nowrap;
        }

        .example-chip:hover {
          background: rgba(14,165,233,0.1);
          border-color: rgba(14,165,233,0.3);
          color: rgba(14,165,233,0.9);
        }

        .preview-bar {
          background: rgba(3,7,18,0.8);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
        }
      `}</style>

      <main
        className="min-h-screen relative overflow-hidden"
        style={{ background: "#030712", color: "#f1f5f9" }}
      >
        {!website && (
          <>
            <GridBackground />
            <Particles />

            {/* History button — top right */}
            <div className="absolute top-6 right-6 z-10">
              <ProjectHistory onLoad={(w) => loadWebsite(w)} />
            </div>

            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
              <div className="w-full max-w-2xl flex flex-col items-center gap-10">

                <div
                  className="animate-slide-up flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(14,165,233,0.08)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    color: "#38bdf8",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                    style={{ animation: "pulse-anim 2s ease-in-out infinite" }}
                  />
                  AI-Powered Website Generator
                </div>

                <div className="animate-slide-up delay-100 text-center space-y-4">
                  <h1
                    className="glow-text"
                    style={{
                      fontSize: "clamp(2.8rem, 7vw, 5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.03em",
                      fontWeight: 800,
                    }}
                  >
                    SiteForge AI
                  </h1>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "1.05rem",
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Describe any website. Watch it come alive in seconds.
                  </p>
                </div>

                <div className="animate-slide-up delay-200">
                  <Steps active={0} />
                </div>

                <div
                  className="animate-slide-up delay-300 w-full card-glass rounded-2xl p-1 relative"
                  style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
                >
                  {loading && <LoadingOverlay />}

                  <div className="p-5 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          placeholder={focused ? "" : placeholder + "|"}
                          rows={5}
                          minLength={10}
                          maxLength={2000}
                          required
                          disabled={loading}
                          className="textarea-custom w-full rounded-xl p-4 text-sm"
                        />
                        <div
                          className="absolute bottom-3 right-3 flex items-center gap-2"
                          style={{
                            opacity: prompt.length > 0 ? 1 : 0,
                            transition: "opacity 0.3s",
                          }}
                        >
                          <svg width="28" height="28" viewBox="0 0 28 28">
                            <circle
                              cx="14" cy="14" r="11"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="2"
                            />
                            <circle
                              cx="14" cy="14" r="11"
                              fill="none"
                              stroke={charPercent > 90 ? "#f87171" : "#0ea5e9"}
                              strokeWidth="2"
                              strokeDasharray={`${2 * Math.PI * 11}`}
                              strokeDashoffset={`${2 * Math.PI * 11 * (1 - charPercent / 100)}`}
                              strokeLinecap="round"
                              style={{
                                transform: "rotate(-90deg)",
                                transformOrigin: "center",
                                transition: "stroke-dashoffset 0.3s ease",
                              }}
                            />
                          </svg>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                            {2000 - prompt.length}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {["SaaS landing", "Portfolio", "Blog", "E-commerce"].map((ex) => (
                            <button
                              key={ex}
                              type="button"
                              className="example-chip"
                              onClick={() =>
                                setPrompt(`A ${ex.toLowerCase()} website with modern design`)
                              }
                            >
                              {ex}
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          disabled={!isReady || loading}
                          className="btn-generate flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                        >
                          <span
                            style={{
                              position: "relative",
                              zIndex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {loading ? (
                              <>
                                <svg
                                  className="animate-spin w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="opacity-25"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                    className="opacity-75"
                                  />
                                </svg>
                                Building...
                              </>
                            ) : (
                              <>
                                <svg
                                  width="14" height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                Generate
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </form>

                    {error && (
                      <div
                        className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm animate-fade-in"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          color: "#fca5a5",
                        }}
                      >
                        <svg
                          width="16" height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="flex-shrink-0 mt-0.5"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="animate-slide-up delay-400 flex items-center gap-6"
                  style={{
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "11px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {["⚡ ~5s generation", "🔒 No account needed", "✦ Free to use"].map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {website && (
          <div
            className="flex flex-col min-h-screen animate-fade-in"
            style={{ background: "#fff", color: "#111" }}
          >
            {/* Preview bar */}
            <div className="preview-bar sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-md text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  siteforge.ai/preview
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(14,165,233,0.25)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  LIVE PREVIEW
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Download */}
                <button
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                    color: "white",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    opacity: exporting ? 0.6 : 1,
                    cursor: exporting ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    document.getElementById("internal-export-trigger")?.click();
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {exporting ? "Exporting..." : "Download"}
                </button>

                {/* History */}
                <ProjectHistory onLoad={(w) => loadWebsite(w)} />

                {/* New website */}
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,165,233,0.1)";
                    e.currentTarget.style.color = "#38bdf8";
                    e.currentTarget.style.borderColor = "rgba(14,165,233,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  New website
                </button>
              </div>
            </div>

            {/* Website sections with inline editing */}
            <WebsitePreview website={website} prompt={prompt} onExport={handleExport} />
          </div>
        )}
      </main>
    </>
  );
}