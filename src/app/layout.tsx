import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/ui/command-palette/command-palette";
import { JsonLd } from "@/components/json-ld";
import { APP_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "NUMINA — Frontier Agentic AI Research Lab",
    template: "%s — NUMINA",
  },
  description:
    "NUMINA builds frontier agentic language models and conducts foundational AI research. We design systems that perceive, reason, and act.",
  keywords: [
    "agentic AI",
    "large language models",
    "AI research",
    "AI agents",
    "frontier models",
    "artificial intelligence lab",
    "machine learning research",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "NUMINA",
  authors: [{ name: "NUMINA" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    title: "NUMINA — Frontier Agentic AI Research Lab",
    description:
      "Building frontier agentic language models and advancing foundational AI research.",
    url: APP_URL,
    siteName: "NUMINA",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUMINA — Frontier Agentic AI Research Lab",
    description:
      "Building frontier agentic language models and advancing foundational AI research.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NUMINA",
  url: APP_URL,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NUMINA",
  url: APP_URL,
  logo: `${APP_URL}/icon.svg`,
  sameAs: [] as string[],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Providers>
          <Header />
          <CommandPalette />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
