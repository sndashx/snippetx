import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "NUMINA — Frontier Agentic AI Research Lab",
    template: "%s — NUMINA",
  },
  description:
    "NUMINA is a frontier research lab building agentic language models that reason, plan, and act. Explore our models, agents, and safety research.",
  keywords: [
    "agentic AI",
    "large language models",
    "AI research",
    "AI agents",
    "frontier models",
    "reasoning models",
    "AI safety",
    "multimodal AI",
    "NUMINA",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "NUMINA",
  authors: [{ name: "Numina Research, Inc." }],
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
      "Building frontier agentic language models that reason, plan, and act — safely, in service of human progress.",
    url: APP_URL,
    siteName: "NUMINA",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUMINA — Frontier Agentic AI Research Lab",
    description:
      "Building frontier agentic language models that reason, plan, and act — safely, in service of human progress.",
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
  name: "Numina Research, Inc.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Providers>
          <Header />
          <CommandPalette />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
