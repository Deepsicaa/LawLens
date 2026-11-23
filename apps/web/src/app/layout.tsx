import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
import "./studio.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { template: "%s | LawLens", default: "LawLens — See Law Clearly" },
  description:
    "AI-powered multi-jurisdiction legal intelligence. Get accurate, citation-backed answers from official government legislation.",
  keywords: ["legal AI", "law", "legislation", "legal research", "AI legal assistant"],
  authors: [{ name: "LawLens" }],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg?v=clarity", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "LawLens",
    title: "LawLens — See Law Clearly",
    description: "AI-powered multi-jurisdiction legal intelligence platform.",
  },
  twitter: { card: "summary_large_image", title: "LawLens — See Law Clearly" },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}
      >
        <body className="min-h-screen antialiased">
          <QueryProvider>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
