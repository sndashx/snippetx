import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
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
    default: "SnippetX — Buy & Sell Production-Ready Code Snippets",
    template: "%s — SnippetX",
  },
  description:
    "SnippetX is a marketplace for developers to buy and sell high-quality, production-ready code snippets. Save hours of development time.",
  keywords: [
    "code snippets",
    "buy code",
    "sell code",
    "developer marketplace",
    "production-ready code",
    "TypeScript snippets",
    "React components",
    "Python scripts",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "SnippetX",
  authors: [{ name: "SnippetX" }],
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
    title: "SnippetX — Code Snippet Marketplace",
    description:
      "Buy & sell production-ready code snippets. Save hours of development time.",
    url: APP_URL,
    siteName: "SnippetX",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnippetX — Code Snippet Marketplace",
    description:
      "Buy & sell production-ready code snippets. Save hours of development time.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SnippetX",
  url: APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/browse?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SnippetX",
  url: APP_URL,
  logo: `${APP_URL}/icon.png`,
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        </Providers>
      </body>
    </html>
  );
}
