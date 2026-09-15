import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "OtterEHR Optometry",
    template: "%s · OtterEHR Optometry",
  },
  description:
    "Intake, consents, OD/OS exam templates, prescriptions, and drop-in config so an optometry practice can use Ottehr.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} font-sans`}>{children}</body>
    </html>
  );
}
