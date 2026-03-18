import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

export default function EditableText({
  value,
  onChange,
  as: Tag = "span",
  className = "",
  style,
  multiline = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim()) onChange(draft.trim());
    else setDraft(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) commit();
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    const sharedProps = {
      ref: inputRef as any,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: handleKeyDown,
      style: {
        ...style,
        background: "rgba(14,165,233,0.08)",
        border: "1.5px solid rgba(14,165,233,0.5)",
        borderRadius: "6px",
        padding: "2px 8px",
        outline: "none",
        width: "100%",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        color: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit",
        resize: "none" as const,
      },
    };

    return multiline ? (
      <textarea {...sharedProps} rows={3} />
    ) : (
      <input {...sharedProps} type="text" />
    );
  }

  return (
    <Tag
      className={className}
      style={{
        ...style,
        cursor: "text",
        borderRadius: "6px",
        transition: "background 0.15s ease, outline 0.15s ease",
      }}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Click to edit"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.outline =
          "1.5px dashed rgba(14,165,233,0.4)";
        (e.currentTarget as HTMLElement).style.background =
          "rgba(14,165,233,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.outline = "none";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {value}
    </Tag>
  );
}