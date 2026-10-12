"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Star, 
  CheckCircle2, 
  Share2, 
  Eye, 
  X, 
  Award, 
  Video,
  Workflow,
  Code2
} from "lucide-react";
import confetti from "canvas-confetti";
import MermaidChart from "@/components/MermaidChart";
import InterviewPrepAccordion from "@/components/InterviewPrepAccordion";
import { GithubIcon } from "@/components/Icons";
import { ProjectModel } from "@/types";
import { getCleanYouTubeId } from "@/lib/utils";

interface PublicProjectViewProps {
  initialProject: ProjectModel;
}

export default function PublicProjectView({ initialProject }: PublicProjectViewProps) {
  const [project] = useState<ProjectModel>(initialProject);
  const [copied, setCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const primaryImage = project.images?.[0]?.image_url;
  const youtubeId = project.video_url ? getCleanYouTubeId(project.video_url) : null;
  const author = {
    name: project.github_owner,
    github_username: project.github_owner,
    avatar_url: `https://github.com/${project.github_owner}.png`,
  };

  return (
    <div className="flex-1 pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#222226] bg-[#101012] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center space-x-2 truncate">
            <Link href="/" className="hover:text-[#FAFAFA] transition-colors flex items-center space-x-1.5 flex-shrink-0 text-[#A1A1AA]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#FAFAFA]" />
              <span>RepoFolio</span>
            </Link>
            <span className="text-[#52525B]">/</span>
            <span className="font-mono text-[#FAFAFA] truncate">
              {project.github_owner}/{project.github_repo}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-[#2A2A2F] bg-[#17171A] hover:bg-[#1E1E22] text-[#FAFAFA] text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
              id="share-overview-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Overview"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#2A2A2F] bg-[#121214] text-[#A1A1AA] text-xs font-mono font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#FAFAFA]" />
            <span>Repository Technical Breakdown</span>
          </div>

          {/* Project Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#FAFAFA] tracking-tight leading-tight">
            {project.title}
          </h1>

          {/* One line pitch / summary */}
          <p className="text-base sm:text-lg md:text-xl text-[#A1A1AA] mt-4 leading-relaxed max-w-3xl mx-auto font-normal">
            {project.one_line_pitch}
          </p>

          {/* Action buttons (Live demo, GitHub, Case study) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4 text-[#111111]" />
                <span>Launch Live Demo</span>
              </a>
            )}

            <a
              href={`https://github.com/${project.github_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#2A2A2F] bg-[#121214] hover:bg-[#17171A] text-[#FAFAFA] text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github.com/${project.github_owner}.png`}
                alt={project.github_owner}
                className="w-4 h-4 rounded-full ring-1 ring-[#2A2A2F]"
              />
              <span>@{project.github_owner}</span>
            </a>

            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#2A2A2F] bg-[#121214] hover:bg-[#17171A] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Source Code</span>
              <span className="text-[#71717A] font-mono text-xs flex items-center space-x-1">
                <Star className="w-3 h-3 text-[#F59E0B]" />
                <span>{project.raw_github_metadata?.stars || 0}</span>
              </span>
            </a>

            {project.external_case_study_url && (
              <a
                href={project.external_case_study_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#2A2A2F] bg-[#121214] hover:bg-[#17171A] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs sm:text-sm font-medium flex items-center justify-center space-x-1.5 transition-all"
              >
                <Award className="w-4 h-4 text-[#FAFAFA]" />
                <span>Case Study</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Screenshot Frame */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-[#2A2A2F] bg-[#121214] shadow-xl overflow-hidden relative">
          {primaryImage ? (
            <div
              className="relative aspect-video sm:aspect-[21/9] w-full cursor-pointer group overflow-hidden"
              onClick={() => setLightboxImage(primaryImage)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primaryImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 sm:p-6">
                <span className="text-xs text-[#FAFAFA] bg-[#121214]/90 px-3 py-1.5 rounded-lg border border-[#2A2A2F] flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to enlarge screenshot</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-[21/9] w-full bg-[#121214] flex items-center justify-center p-6 sm:p-8 text-center border-t border-[#222226]">
              <div>
                <FolderGit2 className="w-12 h-12 text-[#52525B] mx-auto mb-2" />
                <h3 className="text-lg sm:text-xl font-bold text-[#FAFAFA]">{project.title}</h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-md mx-auto">
                  {project.raw_github_metadata?.description || "Public GitHub Repository Technical Breakdown"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section: Architecture Diagram & Summary */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214] space-y-5">
          <div className="flex items-center space-x-2.5">
            <Workflow className="w-5 h-5 text-[#FAFAFA]" />
            <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA]">System Architecture Flow</h2>
          </div>
          {project.architecture_summary && (
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">{project.architecture_summary}</p>
          )}

          <MermaidChart
            chart={project.mermaid_diagram}
            title={`${project.github_repo} Architecture Flow`}
          />
        </div>

        {/* Section: Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <div className="text-xs uppercase font-mono font-bold text-[#EF4444] tracking-wider mb-2">
              Problem Solved
            </div>
            <p className="text-xs sm:text-sm text-[#FAFAFA] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <div className="text-xs uppercase font-mono font-bold text-[#22C55E] tracking-wider mb-2">
              Engineered Solution
            </div>
            <p className="text-xs sm:text-sm text-[#FAFAFA] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Section: Key Features */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
          <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] mb-5 flex items-center space-x-2">
            <span>Key Features &amp; Capabilities</span>
            <span className="text-xs font-normal text-[#71717A]">
              ({project.features?.length || 0} features)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {project.features?.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-[#17171A] border border-[#2A2A2F] flex items-start space-x-3"
              >
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#FAFAFA] leading-relaxed">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: How It Works */}
        {project.how_it_works && project.how_it_works.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] mb-5">
              Execution &amp; Data Flow: Step-by-Step
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {project.how_it_works.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-[#17171A] border border-[#2A2A2F] flex flex-col justify-between"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1E1E22] border border-[#2A2A2F] text-[#FAFAFA] font-mono font-bold text-xs flex items-center justify-center mb-2.5">
                    0{idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Tech Stack With Grounded Reasons */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
          <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] mb-1.5 flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[#FAFAFA]" />
            <span>Technology Stack &amp; Technical Rationale</span>
          </h2>
          <p className="text-xs text-[#71717A] mb-5">
            Directly grounded in repository code, package manifests, and language dependencies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {project.tech_stack?.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-[#17171A] border border-[#2A2A2F] hover:border-[#3E3E46] transition-colors"
              >
                <div className="font-semibold text-[#FAFAFA] text-xs sm:text-sm mb-1">{t.name}</div>
                <div className="text-xs text-[#A1A1AA] leading-relaxed">{t.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Video Embed (if provided) */}
        {youtubeId && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-[#FAFAFA]" />
              <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA]">Project Walkthrough Video</h2>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#2A2A2F]">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Project Video Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Section: Screenshots Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] mb-5">
              Extracted &amp; Uploaded Screenshots ({project.images.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img.image_url)}
                  className="rounded-xl overflow-hidden border border-[#2A2A2F] bg-[#101012] group cursor-pointer hover:border-[#3E3E46] transition-all flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#101012]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.caption || `Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-[#FAFAFA] text-xs flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-2.5 sm:p-3 text-xs text-[#FAFAFA] truncate font-medium">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Technical Interview & Defense Q&A */}
        {project.interview_questions && project.interview_questions.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214]">
            <div className="mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                Technical Architecture Defense &amp; Engineering Q&amp;A
              </h2>
              <p className="text-xs text-[#71717A] mt-1">
                Architecture questions and trade-off considerations derived from this repository&apos;s implementation.
              </p>
            </div>

            <InterviewPrepAccordion questions={project.interview_questions} />
          </div>
        )}

        {/* Section: Contributors & Built By */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2A2F] bg-[#121214] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                author.avatar_url ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${project.github_owner}`
              }
              alt={author.name || project.github_owner}
              className="w-12 sm:w-14 h-12 sm:h-14 rounded-full ring-2 ring-[#2A2A2F] object-cover"
            />
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase font-mono text-[#71717A] font-semibold tracking-wider">
                Repository Owner &amp; Author
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                {author.name || project.github_owner}
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                GitHub: @{author.github_username || project.github_owner}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <a
              href={`https://github.com/${author.github_username || project.github_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#17171A] hover:bg-[#1E1E22] border border-[#2A2A2F] text-xs font-semibold text-[#FAFAFA] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-xs font-semibold text-[#111111] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-[#111111]" />
              <span>Share Technical Overview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-[#FAFAFA] hover:text-[#A1A1AA]"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="Screenshot Preview"
              className="rounded-xl max-h-[85vh] w-auto object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
