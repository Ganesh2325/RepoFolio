"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  ArrowRight, 
  Briefcase, 
  Building, 
  HeartHandshake, 
  Check, 
  ExternalLink,
  Code2, 
  FileSearch, 
  PenLine, 
  Share2, 
  ShieldCheck,
  ChevronRight,
  Layers
} from "lucide-react";
import RepoIngestModal from "@/components/RepoIngestModal";
import MermaidChart from "@/components/MermaidChart";

export default function LandingPage() {
  const [heroUrl, setHeroUrl] = useState("");
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState<"recruiter" | "client" | "non-technical">("recruiter");

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIngestModal(true);
  };

  const showcaseProject = {
    owner: "Ganesh2325",
    repo: "AegisTrace",
    title: "AegisTrace: Secure, Evidence-Based AI for Support Operations",
    one_line_pitch: "A private, auditable, and evidence-based AI assistant for support teams, ensuring accurate, document-grounded answers and human-approved actions.",
    problem: "Traditional chatbots often hallucinate unverified details or trigger actions without an audit trail, creating liability for enterprise support desks.",
    solution: "AegisTrace requires answers to originate strictly from verified docs and routes all ticket creation actions through human approval workflows.",
    tech_stack: [
      { name: "TypeScript", reason: "Type safety across control plane & services" },
      { name: "Next.js & React", reason: "Responsive role-based operator interface" },
      { name: "Docker", reason: "Containerized isolation for agent runtime" },
      { name: "Tailwind CSS", reason: "Clean design tokens and theme consistency" },
    ],
    mermaid_diagram: `graph TD
  A[Operator Request] --> B[Frontend Interface]
  B --> C[Control Plane API]
  C --> D[Agent Runtime Service]
  D --> E[(Knowledge Base Docs)]
  E -- Verified Citations --> D
  D -- Draft Proposal --> C
  C --> F{Requires Human Review?}
  F -- Yes --> G[Reviewer Interface]
  G --> H[Human Approved Ticket]
  F -- No --> B`,
  };

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-ambient-top pointer-events-none -z-10" />
      <div className="absolute top-16 left-0 right-0 h-[600px] bg-grid-subtle opacity-60 pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#2A2A2F] bg-[#121214] text-[#A1A1AA] text-xs font-mono mb-8">
          <span>GitHub → Portfolio Story</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAFAFA] leading-[1.08] max-w-4xl mx-auto">
          Make your GitHub projects easy to understand.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto mt-6 leading-relaxed">
          RepoFolio reads your public repository and turns it into an editable case study with the problem, solution, features, tech stack, proof of work, and a shareable link.
        </p>

        {/* Working Hero Input & Action */}
        <div className="mt-10 max-w-xl mx-auto">
          <form
            onSubmit={handleHeroSubmit}
            className="p-1.5 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col sm:flex-row items-center gap-2 shadow-sm"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <FolderGit2 className="w-4 h-4 text-[#71717A] flex-shrink-0 mr-2" />
              <input
                type="text"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full py-2 bg-transparent text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none font-mono"
                aria-label="GitHub Repository URL"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer active:scale-98"
              id="hero-generate-btn"
            >
              <span>Create story</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
            </button>
          </form>

          {/* Trust Statements */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-[#71717A]">
            <span className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>Uses public repository evidence</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>You review every AI-generated detail</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>Share a recruiter-ready link</span>
            </span>
          </div>
        </div>
      </section>

      {/* How RepoFolio Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#222226]">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] tracking-tight mt-2">
            How RepoFolio works
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base max-w-xl mx-auto mt-2">
            Four sequential steps from raw codebase to recruiter-ready portfolio page.
          </p>
        </div>

        {/* 4 Sequential Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-[#FAFAFA] text-xs font-mono font-semibold flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-semibold text-base text-[#FAFAFA]">Connect your project</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Paste any public GitHub repository link. No write permissions or complex setup required.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#222226] text-[11px] text-[#71717A] flex items-center space-x-1">
              <FolderGit2 className="w-3 h-3" />
              <span>Public repo URL</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-[#FAFAFA] text-xs font-mono font-semibold flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-semibold text-base text-[#FAFAFA]">RepoFolio reads evidence</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                We analyze your README, tech stack, folders, dependencies, and commit activity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#222226] text-[11px] text-[#71717A] flex items-center space-x-1">
              <FileSearch className="w-3 h-3" />
              <span>Manifests & signals</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-[#FAFAFA] text-xs font-mono font-semibold flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-semibold text-base text-[#FAFAFA]">Review your story</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Get an AI-generated draft, then edit every detail, add screenshots, and include your demo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#222226] text-[11px] text-[#71717A] flex items-center space-x-1">
              <PenLine className="w-3 h-3" />
              <span>100% editable draft</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-[#FAFAFA] text-xs font-mono font-semibold flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="font-semibold text-base text-[#FAFAFA]">Share with confidence</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Publish a clean project page for recruiters, clients, judges, or your portfolio.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#222226] text-[11px] text-[#71717A] flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>Shareable public slug</span>
            </div>
          </div>
        </div>

        {/* Restrained Visual Workflow Diagram */}
        <div className="mt-12 p-6 rounded-xl border border-[#2A2A2F] bg-[#121214]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A1A1AA]">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>GitHub Repository</span>
            </div>
            <span className="text-[#52525B]">→</span>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F]">
              <FileSearch className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>Repo Analysis</span>
            </div>
            <span className="text-[#52525B]">→</span>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F]">
              <PenLine className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>Editable Story</span>
            </div>
            <span className="text-[#52525B]">→</span>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#FAFAFA] text-[#111111] font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Public Project Page</span>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#222226]">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
            Perspectives
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] tracking-tight mt-2">
            Tell the right story to the right person
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base max-w-xl mx-auto mt-2">
            Tailor the explanation automatically based on who is reading your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Recruiters */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-4">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#FAFAFA]">Recruiters</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Show skills, technical decisions, ownership, and project impact.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#222226] text-[11px] text-[#71717A]">
              Architecture trade-offs & interview defense Q&As.
            </div>
          </div>

          {/* Card 2: Clients & founders */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-4">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#FAFAFA]">Clients & founders</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Explain the problem, solution, outcomes, and proof your product works.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#222226] text-[11px] text-[#71717A]">
              Return on investment, screenshots, and business value.
            </div>
          </div>

          {/* Card 3: Non-technical viewers */}
          <div className="p-6 rounded-xl border border-[#2A2A2F] bg-[#121214] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-4">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#FAFAFA]">Non-technical viewers</h3>
              <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                Make your project understandable without code or developer jargon.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#222226] text-[11px] text-[#71717A]">
              Intuitive ELI5 metaphors and clear 4-step flows.
            </div>
          </div>
        </div>
      </section>

      {/* Example Project Section */}
      <section id="example" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#222226]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
              Live Output
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight mt-1">
              Sample project case study
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Real public case study generated by RepoFolio:
            </p>
          </div>

          <button
            onClick={() => setShowIngestModal(true)}
            className="px-4 py-2 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs font-semibold flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>Generate for your repo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Focused Showcase Card */}
        <div className="rounded-xl border border-[#2A2A2F] bg-[#121214] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 sm:p-8 border-b border-[#222226] bg-[#17171A]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <a
                href={`https://github.com/${showcaseProject.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors inline-flex items-center space-x-1.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://github.com/${showcaseProject.owner}.png`}
                  alt={showcaseProject.owner}
                  className="w-4 h-4 rounded-full"
                />
                <span>{showcaseProject.owner}</span>
                <span>/</span>
                <span>{showcaseProject.repo}</span>
              </a>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] mt-1.5">
                {showcaseProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-2xl">
                {showcaseProject.one_line_pitch}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`https://github.com/${showcaseProject.owner}/${showcaseProject.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-[#2A2A2F] hover:bg-[#1E1E22] text-[#FAFAFA] text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>GitHub Source</span>
              </a>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              {/* Problem */}
              <div className="p-4 rounded-lg bg-[#17171A] border border-[#2A2A2F]">
                <span className="text-[11px] uppercase font-mono font-semibold text-[#FAFAFA] block mb-1">
                  The Problem
                </span>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {showcaseProject.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-lg bg-[#17171A] border border-[#2A2A2F]">
                <span className="text-[11px] uppercase font-mono font-semibold text-[#FAFAFA] block mb-1">
                  The Solution
                </span>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {showcaseProject.solution}
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A] block mb-2">
                  Key Technologies & Rationale
                </span>
                <div className="flex flex-wrap gap-2">
                  {showcaseProject.tech_stack.map((t, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#17171A] border border-[#2A2A2F] text-xs text-[#FAFAFA]"
                    >
                      <span className="font-medium">{t.name}:</span>{" "}
                      <span className="text-[#A1A1AA] text-[11px]">{t.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Flow Preview */}
            <div>
              <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A] block mb-2">
                System Flowchart Preview
              </span>
              <div className="rounded-lg border border-[#2A2A2F] bg-[#17171A] p-2">
                <MermaidChart
                  chart={showcaseProject.mermaid_diagram}
                  title="Architecture Flow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Is Trustworthy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#222226] text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
          Trust & Accuracy
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] tracking-tight mt-2">
          AI-generated, developer-approved.
        </h2>
        <p className="text-[#A1A1AA] text-sm sm:text-base max-w-lg mx-auto mt-2">
          You retain 100% control over the story before recruiters or clients see it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-5 rounded-xl border border-[#2A2A2F] bg-[#121214]">
            <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#FAFAFA]">Grounded in repository evidence</h3>
            <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
              Every detail is pulled from your actual code, README, package manifests, and commit records.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#2A2A2F] bg-[#121214]">
            <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-3">
              <PenLine className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#FAFAFA]">Every section is editable</h3>
            <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
              Easily refine the problem, tweak the tech stack reasons, or re-order features in the editor.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#2A2A2F] bg-[#121214]">
            <div className="w-8 h-8 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mb-3">
              <Check className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#FAFAFA]">Nothing published until you approve</h3>
            <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
              Stories remain drafts until you decide to hit publish and share your link with recruiters.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#222226] text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#FAFAFA] tracking-tight max-w-2xl mx-auto">
          Your code deserves a story people can understand.
        </h2>
        <p className="text-[#A1A1AA] text-sm sm:text-base max-w-md mx-auto mt-4">
          Turn your repository into a recruiter-ready case study in under 60 seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setShowIngestModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-sm font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer active:scale-98"
          >
            <span>Create project story</span>
            <ArrowRight className="w-4 h-4 text-[#111111]" />
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#2A2A2F] bg-[#121214] hover:bg-[#17171A] text-xs sm:text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors flex items-center justify-center"
          >
            Go to dashboard
          </Link>
        </div>
      </section>

      {/* Ingestion Modal */}
      {showIngestModal && (
        <RepoIngestModal
          initialUrl={heroUrl}
          onClose={() => setShowIngestModal(false)}
        />
      )}
    </div>
  );
}
