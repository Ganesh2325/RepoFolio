import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "RepoFolio — Make Your GitHub Projects Easy to Understand",
  description:
    "RepoFolio reads your public repository and turns it into an editable case study with problem, solution, features, tech stack, proof of work, and a shareable link.",
  keywords: [
    "developer portfolio",
    "github portfolio",
    "github project story",
    "recruiter project explainer",
    "developer resume",
    "hackathon project showcase",
    "code case study",
  ],
  authors: [{ name: "RepoFolio" }],
  openGraph: {
    title: "RepoFolio — Make Your GitHub Projects Easy to Understand",
    description:
      "Transform raw GitHub repositories into shareable case studies with audience-specific explanations, architecture diagrams, and proof assets.",
    type: "website",
    url: "https://repofolio.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoFolio — Make Your GitHub Projects Easy to Understand",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#0A0A0A] text-[#FAFAFA] font-sans antialiased selection:bg-[#2A2A2F] selection:text-[#FAFAFA]`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
