"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FolderGit2, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Building, 
  HeartHandshake, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Code2,
  ChevronDown,
  Layers,
  HelpCircle,
  Play
} from "lucide-react";
import RepoIngestModal from "@/components/RepoIngestModal";
import MermaidChart from "@/components/MermaidChart";

export default function LandingPage() {
  const router = useRouter();
  const [heroUrl, setHeroUrl] = useState("");
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState<"recruiter" | "client" | "non-technical">("recruiter");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroUrl.trim()) {
      setShowIngestModal(true);
    }
  };

  const showcaseProject = {
    owner: "Ganesh2325",
    repo: "AegisTrace",
    url: "https://github.com/Ganesh2325/AegisTrace",
    title: "AegisTrace – AI-Powered, Human-Verified Support Automation",
    one_line_pitch: "A secure, internal AI assistant for support teams, ensuring document-grounded answers and human-approved, auditable ticket creation.",
    problem: "Traditional chatbots often provide inaccurate information or take unrecorded actions, leading to customer dissatisfaction and operational inefficiencies.",
    solution: "AegisTrace provides a private, role-based AI desk that strictly answers from uploaded team documents, refuses to guess, and requires human approval for all ticket creations.",
    features: [
      "Document-Grounded AI Responses strictly derived from knowledge base",
      "Two-Step Ticket Approval Workflow with mandatory human review",
      "Role-Based Access Control for Operators, Reviewers, and Admins",
      "Comprehensive Audit Trail for compliance and transparency",
      "Duplicate Ticket Prevention to eliminate operational waste",
    ],
    tech_stack: [
      { name: "TypeScript", reason: "Strong typing across distributed microservices" },
      { name: "Next.js & React", reason: "Server-side rendering and responsive operator dashboards" },
      { name: "Docker", reason: "Containerized deployment for agent runtime and control plane" },
      { name: "Tailwind CSS", reason: "Consistent, rapid UI styling and theme support" },
    ],
    mermaid_diagram: `graph TD
  A[Operator Input] --> B[Frontend Application]
  B --> C[Control Plane Service]
  C --> D[Agent Runtime Service]
  D --> E[(Knowledge Base Docs)]
  E -- Evidence --> D
  D -- Generated Proposal --> C
  C --> F{Requires Human Review?}
  F -- Yes --> G[Reviewer Interface]
  G --> H[Human Approved Ticket]
  H --> I[Audit Log Record]
  F -- No --> B`,
  };

  const faqs = [
    {
      q: "How is RepoFolio different from a generic GitHub repo explainer?",
      a: "Existing tools explain someone else's code to developers. RepoFolio is a portfolio builder designed for YOU to present your own project as a non-technical case study to recruiters, clients, and judges who don't read raw code.",
    },
    {
      q: "Does RepoFolio require a GitHub token to use?",
      a: "No! RepoFolio works out-of-the-box for any public GitHub repository. You can paste any repo from any user, and our automated multi-CDN engine parses it instantly.",
    },
    {
      q: "What if my GitHub repository has a bare or empty README?",
      a: "No problem. RepoFolio inspects your file structure, package dependencies, manifests, and commit messages to deduce architecture, tech stacks, and features automatically.",
    },
    {
      q: "Can I edit the generated story before sharing it?",
      a: "Yes, 100%! Every single section—from title and problem to features, architecture diagram, pitch script, and interview questions—is completely editable in our rich Project Story Editor.",
    },
    {
      q: "How does the public link work?",
      a: "Every project gets a clean, responsive public URL at /p/[projectSlug]. You can link it on your resume, LinkedIn profile, Devpost submission, or freelance proposals with automated OpenGraph preview cards.",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-glow pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 right-0 h-[600px] bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8 hover:bg-indigo-500/20 transition-all cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>RepoFolio — GitHub to Portfolio Story Builder</span>
          <ArrowRight className="w-3 h-3 text-indigo-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Turn your GitHub repo into a{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            project story
          </span>{" "}
          recruiters actually understand.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto mt-6 leading-relaxed">
          Recruiters and clients don’t read commit histories or package.json files. RepoFolio transforms any public repository into a polished, non-technical case study with proof of work, architecture diagrams, and shareable public links.
        </p>

        {/* GitHub URL Input Call To Action */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form
            onSubmit={handleHeroSubmit}
            className="p-2 rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 glow-primary"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <FolderGit2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mr-2" />
              <input
                type="text"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="Paste public GitHub URL (e.g. github.com/username/repo)"
                className="w-full py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
              id="hero-generate-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build Project Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded in actual code</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mermaid architecture flow</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>45-second spoken elevator pitch</span>
            </span>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Open Stories Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Audience Differentiation Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-semibold mb-2">
            One Repository • Tailored Perspectives
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Tell the right story to the right person
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            A hiring manager wants architecture trade-offs. A client wants business outcomes. A judge wants rapid innovation. RepoFolio adapts automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Recruiter */}
          <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">For Recruiters & Hiring Managers</h4>
              <p className="text-xs text-blue-400 font-medium mt-0.5">Impact • Skills • Technical Ownership</p>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Highlights why you picked each technology, how you tackled scalability bottlenecks, your testing approach, and five interview questions hiring managers will ask you.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Ideal for resumes, LinkedIn portfolio links, and technical phone screens.
            </div>
          </div>

          {/* Card 2: Client */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">For Potential Clients & Founders</h4>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">Problem • Solution • Return on Investment</p>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Translates code into business outcomes. Shows client-friendly problem statements, cost-saving benefits, screenshots, and live demo proof without alienating jargon.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Ideal for freelance pitches, Upwork proposals, and client case studies.
            </div>
          </div>

          {/* Card 3: Non-Technical */}
          <div className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">For Non-Technical People & Judges</h4>
              <p className="text-xs text-amber-400 font-medium mt-0.5">ELI5 • Intuitive Real-World Metaphors</p>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Explains your software as if the viewer has never written a line of code. Uses intuitive analogies and clear 4-step flows so anyone can appreciate what you built.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Ideal for hackathon judges, non-tech co-founders, and family/friends.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Story Showcase Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Story Preview</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              See what a RepoFolio public page looks like
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sample generated architecture case study:
            </p>
          </div>

          <button
            onClick={() => setShowIngestModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate For Your Repo</span>
          </button>
        </div>

        {/* Story Card Container */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl overflow-hidden">
          {/* Top banner */}
          <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <a
                  href={`https://github.com/${showcaseProject.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-indigo-400 hover:underline inline-flex items-center space-x-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://github.com/${showcaseProject.owner}.png`}
                    alt={showcaseProject.owner}
                    className="w-4 h-4 rounded-full mr-1 inline"
                  />
                  <span>{showcaseProject.owner}</span>
                  <span>/</span>
                  <span>{showcaseProject.repo}</span>
                </a>
                <h4 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {showcaseProject.title}
                </h4>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                  {showcaseProject.one_line_pitch}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={showcaseProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-md flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>

            {/* Audience Perspective Switcher on preview */}
            <div className="mt-6 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Viewing as:</span>
              <button
                onClick={() => setActiveAudienceTab("recruiter")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  activeAudienceTab === "recruiter"
                    ? "bg-blue-600/20 border-blue-500 text-blue-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                Recruiter
              </button>
              <button
                onClick={() => setActiveAudienceTab("client")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  activeAudienceTab === "client"
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                Client
              </button>
              <button
                onClick={() => setActiveAudienceTab("non-technical")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  activeAudienceTab === "non-technical"
                    ? "bg-amber-600/20 border-amber-500 text-amber-300"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                Non-Technical
              </button>
            </div>
          </div>

          {/* Story Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Problem & Solution */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h5 className="text-xs uppercase font-mono font-bold text-rose-400 mb-1">
                  The Problem
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {showcaseProject.problem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h5 className="text-xs uppercase font-mono font-bold text-emerald-400 mb-1">
                  The Engineered Solution
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {showcaseProject.solution}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h5 className="text-xs uppercase font-mono font-bold text-slate-400 mb-3">
                  Key Features ({showcaseProject.features.length})
                </h5>
                <div className="space-y-2">
                  {showcaseProject.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack with reasons */}
              <div>
                <h5 className="text-xs uppercase font-mono font-bold text-slate-400 mb-3">
                  Tech Stack with Grounded Rationale
                </h5>
                <div className="flex flex-wrap gap-2">
                  {showcaseProject.tech_stack.map((t, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      title={t.reason}
                    >
                      <span className="font-semibold text-indigo-300">{t.name}:</span>{" "}
                      <span className="text-slate-400 text-[11px]">{t.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Mermaid Diagram */}
            <div className="space-y-6">
              <MermaidChart
                chart={showcaseProject.mermaid_diagram}
                title={`${showcaseProject.repo} Architecture Flow`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-semibold mb-2">
            Engineered For Real Job Seekers & Freelancers
          </h2>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Everything you need to prove your software works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1220] hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Proof Mode</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Attach screenshots, architecture flows, live demo links, and video walkthroughs directly on the page.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1220] hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Architecture Diagrams</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Auto-generates clean, interactive Mermaid flowcharts illustrating data flows, services, and APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1220] hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Elevator Pitch Script</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Includes a 45-second teleprompter script tailored for recruiter screening calls and demo days.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c1220] hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Interview Defense</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generates 5 technical interview questions with model answers grounded in your codebase trade-offs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Common questions about RepoFolio
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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
