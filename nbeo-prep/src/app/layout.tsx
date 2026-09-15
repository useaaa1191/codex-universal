import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OptiPrep — NBEO Board Prep for Parts 1, 2 & 3",
    template: "%s · OptiPrep",
  },
  description:
    "A modern, high-performance NBEO board-prep platform. 3,000+ questions, timed simulators, adaptive spaced repetition, an AI tutor, and a full Part 3 clinical-skills module.",
  keywords: [
    "NBEO",
    "optometry board exam",
    "NBEO Part 1",
    "NBEO Part 2",
    "NBEO Part 3",
    "optometry question bank",
    "board prep",
    "clinical skills exam",
  ],
  authors: [{ name: "OptiPrep" }],
  openGraph: {
    title: "OptiPrep — NBEO Board Prep",
    description:
      "3,000+ questions, timed simulators, adaptive learning, AI tutor, and a Part 3 clinical-skills module.",
    url: siteUrl,
    siteName: "OptiPrep",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptiPrep — NBEO Board Prep",
    description: "The next-gen NBEO board-prep platform for Parts 1, 2 & 3.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
