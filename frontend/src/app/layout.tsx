import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";

import "@/styles/globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SiteForge AI",
    template: "%s | SiteForge AI",
  },
  description: "Generate stunning websites instantly with AI — just describe your idea.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "SiteForge AI",
    description: "Generate stunning websites instantly with AI.",
    type: "website",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#030712] text-white antialiased">
        {children}
      </body>
    </html>
  );
}