import type { Hero as HeroType } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface HeroProps {
  data: HeroType;
  onUpdate?: (field: keyof HeroType, value: string) => void;
}

export default function Hero({ data, onUpdate }: HeroProps) {
  return (
    <section className="w-full py-24 md:py-32 bg-gradient-to-b from-brand-50 to-background">
      <div className="container flex flex-col items-center text-center gap-6">
        {onUpdate ? (
          <>
            <EditableText
              value={data.title}
              onChange={(value) => onUpdate?.("title", value)}
              as="h1"
              className="text-4xl md:text-6xl font-bold tracking-tight"
            />
            <EditableText
              value={data.subtitle}
              onChange={(value) => onUpdate?.("subtitle", value)}
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              multiline
            />
            <EditableText
              value={data.cta}
              onChange={(value) => onUpdate?.("cta", value)}
              as="span"
              className="px-6 py-3 rounded-lg text-white font-medium cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              {data.subtitle}
            </p>
            <span
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            >
              {data.cta}
            </span>
          </>
        )}
      </div>
    </section>
  );
}