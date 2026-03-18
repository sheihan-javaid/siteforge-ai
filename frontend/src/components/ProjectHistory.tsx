"use client";

import { useState, useEffect } from "react";
import { listProjects, deleteProject } from "@/lib/api";
import type { Project } from "@/lib/api";
import type { Website } from "@/types/website";

interface ProjectHistoryProps {
  onLoad: (website: Website, prompt: string) => void;
}

export default function ProjectHistory({ onLoad }: ProjectHistoryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await listProjects();
      setProjects(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchProjects();
  }, [open]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // silently fail
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: open ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.08)"}`,
          color: open ? "#38bdf8" : "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-body)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed top-0 right-0 h-full w-80 z-[100] flex flex-col"
          style={{
            background: "#0a0f1e",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "white", fontFamily: "var(--font-display)" }}
            >
              Saved Projects
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "#38bdf8" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
                </svg>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "2rem" }}>📁</span>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                  No saved projects yet
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    onLoad(project.website, project.prompt);
                    setOpen(false);
                  }}
                  className="rounded-xl p-3 cursor-pointer transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,165,233,0.06)";
                    e.currentTarget.style.borderColor = "rgba(14,165,233,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "rgba(255,255,255,0.85)" }}
                      >
                        {project.website.hero?.title || "Untitled"}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {project.prompt}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                      style={{ color: "#f87171" }}
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-3 text-center"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.2)",
              fontSize: "10px",
            }}
          >
            {projects.length} project{projects.length !== 1 ? "s" : ""} saved
          </div>
        </div>
      )}
    </>
  );
}