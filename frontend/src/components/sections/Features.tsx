import type { Feature } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface FeaturesProps {
  data: Feature[];
  onUpdate?: (index: number, field: keyof Feature, value: string) => void;
}

const ICONS = ["🚀", "⚡", "🎯", "🔥", "💡", "🛡"];

export default function Features({ data, onUpdate }: FeaturesProps) {
  return (
    <section
      className="w-full py-24"
      style={{ background: "#0a0f1e" }}
    >
      <div className="container">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Features
          </h2>
          <div
            className="mx-auto h-1 w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((feature, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid rgba(14,165,233,0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: "rgba(14,165,233,0.1)",
                  border: "1px solid rgba(14,165,233,0.2)",
                }}
              >
                {feature.icon || ICONS[i % ICONS.length]}
              </div>

              {onUpdate ? (
                <>
                  <EditableText
                    value={feature.title}
                    onChange={(v) => onUpdate(i, "title", v)}
                    as="h3"
                    style={{ color: "white", fontWeight: 700, fontSize: "1.05rem" }}
                  />
                  <EditableText
                    value={feature.description}
                    onChange={(v) => onUpdate(i, "description", v)}
                    as="p"
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.6 }}
                    multiline
                  />
                </>
              ) : (
                <>
                  <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.05rem" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}