import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keysa Anadea",
  description: "Portfolio of Keysa Anadea · LLM · RAG · FastAPI · Next.js · Interactive macOS-inspired portfolio.",
  keywords: ["Keysa Anadea", "Portfolio", "LLM", "RAG", "LangChain", "Python", "Next.js"],
  authors: [{ name: "Keysa Anadea" }],
  openGraph: {
    title: "Keysa Anadea",
    description: "Building intelligent systems that make complex data feel effortless. LLM · RAG · FastAPI · Next.js.",
    type: "website",
    locale: "en_US",
    siteName: "Keysa Anadea Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keysa Anadea",
    description: "Building intelligent systems that make complex data feel effortless.",
    creator: "@keysaanadea",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
