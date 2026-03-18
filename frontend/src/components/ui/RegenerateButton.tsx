"use client";

interface RegenerateButtonProps {
  section: string;
  isRegenerating: boolean;
  onClick: () => void;
}

export default function RegenerateButton({
  section,
  isRegenerating,
  onClick,
}: RegenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isRegenerating}
      title={`Regenerate ${section}`}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all"
      style={{
        background: isRegenerating
          ? "rgba(14,165,233,0.15)"
          : "rgba(14,165,233,0.08)",
        border: "1px solid rgba(14,165,233,0.25)",
        color: "#38bdf8",
        cursor: isRegenerating ? "not-allowed" : "pointer",
        opacity: isRegenerating ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isRegenerating) {
          e.currentTarget.style.background = "rgba(14,165,233,0.2)";
          e.currentTarget.style.boxShadow = "0 0 8px rgba(14,165,233,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(14,165,233,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {isRegenerating ? (
        <>
          <svg
            className="animate-spin w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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
          Regenerating...
        </>
      ) : (
        <>
          <svg
            width="10" height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Regenerate
        </>
      )}
    </button>
  );
}