import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { CommandPalette } from "@/components/ui/command-palette/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnippetX — Buy & Sell Production-Ready Code Snippets",
  description:
    "SnippetX is a marketplace for developers to buy and sell high-quality, production-ready code snippets. Save hours of development time.",
  openGraph: {
    title: "SnippetX — Code Snippet Marketplace",
    description:
      "Buy & sell production-ready code snippets. Save hours of development time.",
    url: "https://sn-x.com",
    siteName: "SnippetX",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnippetX — Code Snippet Marketplace",
    description:
      "Buy & sell production-ready code snippets. Save hours of development time.",
  },
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
