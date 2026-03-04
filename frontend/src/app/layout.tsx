import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0A2A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "ISIN — India's Skill Intelligence Network",
    template: "%s | ISIN",
  },
  description:
    "AI-verified Skill Passports replacing traditional resumes. Prove your skills, get hired.",
  keywords: ["skill verification", "AI hiring", "coding assessment", "India", "skill passport"],
  authors: [{ name: "ISIN Team" }],
  creator: "ISIN",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "ISIN — Skill Intelligence Network",
    description: "AI-verified Skill Passports. Not resumes.",
    type: "website",
    siteName: "ISIN",
    locale: "en_IN",
    images: [{ url: "/assets/social/og-image.svg", width: 1200, height: 630, alt: "ISIN" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISIN — Skill Intelligence Network",
    description: "AI-verified Skill Passports. Not resumes.",
    images: ["/assets/social/twitter-card.svg"],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
