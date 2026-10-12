import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoFolio — Turn GitHub Repos Into Impactful Project Stories",
  description:
    "Turn your GitHub repository into a polished, shareable project story that recruiters, clients, and hackathon judges can actually understand in under 60 seconds.",
  keywords: [
    "developer portfolio",
    "github portfolio",
    "github project story",
    "recruiter project explainer",
    "developer resume",
    "hackathon project showcase",
    "code case study",
  ],
  authors: [{ name: "RepoFolio Team" }],
  openGraph: {
    title: "RepoFolio — Turn GitHub Repos Into Impactful Project Stories",
    description:
      "Transform raw GitHub repositories into shareable case studies with audience-specific explanations, architecture diagrams, and proof assets.",
    type: "website",
    url: "https://repofolio.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoFolio — GitHub to Non-Technical Project Story Generator",
    description:
      "Turn your GitHub repository into a project story that recruiters, clients, and judges can actually understand.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#080c14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
