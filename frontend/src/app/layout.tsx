import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISIN — India's Skill Intelligence Network",
  description:
    "AI-verified Skill Passports replacing traditional resumes. Prove your skills, get hired.",
  keywords: ["skill verification", "AI hiring", "coding assessment", "India", "skill passport"],
  openGraph: {
    title: "ISIN — Skill Intelligence Network",
    description: "AI-verified Skill Passports. Not resumes.",
    type: "website",
    images: ["/assets/social/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISIN — Skill Intelligence Network",
    description: "AI-verified Skill Passports. Not resumes.",
    images: ["/assets/social/twitter-card.svg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
