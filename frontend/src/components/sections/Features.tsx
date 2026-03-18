import type { Feature } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface FeaturesProps {
  data: Feature[];
  onUpdate?: (index: number, field: keyof Feature, value: string) => void;
}

export default function Features({ data, onUpdate }: FeaturesProps) {
  return (
    <section className="w-full py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((feature, i) => (
            <div key={i} className="card flex flex-col gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center">
                <span className="text-brand-600 font-bold text-lg">{i + 1}</span>
              </div>
              {onUpdate ? (
                <>
                  <EditableText
                    value={feature.title}
                    onChange={(v) => onUpdate(i, "title", v)}
                    as="h3"
                    className="text-lg font-semibold"
                  />
                  <EditableText
                    value={feature.description}
                    onChange={(v) => onUpdate(i, "description", v)}
                    as="p"
                    className="text-sm text-muted-foreground"
                    multiline
                  />
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}