import type { Footer as FooterType } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface FooterProps {
  data: FooterType;
  onUpdate?: (field: keyof FooterType, value: string) => void;
}

export default function Footer({ data, onUpdate }: FooterProps) {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container flex items-center justify-center h-16">
        {onUpdate ? (
          <EditableText
            value={data.text}
            onChange={(v) => onUpdate?.("text", v)}
            as="p"
            className="text-sm text-muted-foreground"
          />
        ) : (
          <p className="text-sm text-muted-foreground">{data.text}</p>
        )}
      </div>
    </footer>
  );
}