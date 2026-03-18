"use client";

import { useState } from "react";
import type { ContactForm } from "@/types/website";

interface ContactFormSectionProps {
  data: ContactForm;
}

export default function ContactFormSection({ data }: ContactFormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Optional: send data to backend here
  };

  if (!data) return null;

  return (
    <section className="w-full py-20 bg-[#f8fafc]">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{data.title}</h2>
            {data.subtitle && (
              <p className="text-muted-foreground">{data.subtitle}</p>
            )}
          </div>

          {/* Submitted Message */}
          {submitted ? (
            <div className="rounded-2xl p-8 text-center bg-blue-50 border border-blue-200">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
              <p className="text-sm text-muted-foreground">
                Thanks for reaching out. We'll get back to you soon.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({});
                }}
                className="mt-4 text-sm text-brand-500 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 flex flex-col gap-5 bg-white border border-gray-200 shadow-md"
            >
              {data.fields.map((field, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      rows={4}
                      required
                      value={formData[field.label] ?? ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={formData[field.label] ?? ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-transform duration-150 ease-in-out"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                  boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,165,233,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,165,233,0.25)";
                }}
              >
                {data.submit_label || "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}