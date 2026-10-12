"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  GitFork, 
  CheckCircle2, 
  Calendar, 
  User as UserIcon, 
  Share2, 
  ArrowLeft, 
  Eye, 
  X, 
  Award, 
  Video 
} from "lucide-react";
import confetti from "canvas-confetti";
import MermaidChart from "@/components/MermaidChart";
import PitchTeleprompter from "@/components/PitchTeleprompter";
import InterviewPrepAccordion from "@/components/InterviewPrepAccordion";
import { GithubIcon } from "@/components/Icons";
import { AudienceVersion, ProjectModel } from "@/types";
import { formatDate, getCleanYouTubeId } from "@/lib/utils";

interface PublicProjectViewProps {
  initialProject: ProjectModel;
}

export default function PublicProjectView({ initialProject }: PublicProjectViewProps) {
  const [project] = useState<ProjectModel>(initialProject);
  const [copied, setCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [audienceView, setAudienceView] = useState<AudienceVersion>(
    initialProject.audience_version || "recruiter"
  );

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
      <div className="border-b border-slate-800/80 bg-slate-950/40 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 truncate">
            <Link href="/" className="hover:text-white transition-colors flex items-center space-x-1 flex-shrink-0">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>RepoFolio</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-slate-300 truncate">
              {project.github_owner}/{project.github_repo}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-sm"
              id="share-story-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Story"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Project Case Study</span>
          </div>

          {/* Project Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          {/* One line pitch */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 mt-3 sm:mt-4 leading-relaxed max-w-3xl mx-auto">
            {project.one_line_pitch}
          </p>

          {/* Action buttons (Live demo, GitHub, Case study) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live Demo</span>
              </a>
            )}

            <a
              href={`https://github.com/${project.github_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github.com/${project.github_owner}.png`}
                alt={project.github_owner}
                className="w-4 h-4 rounded-full ring-1 ring-indigo-400"
              />
              <span>@{project.github_owner}</span>
            </a>

            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Source Code</span>
              <span className="text-slate-400 font-mono text-xs">
                ★ {project.raw_github_metadata?.stars || 0}
              </span>
            </a>

            {project.external_case_study_url && (
              <a
                href={project.external_case_study_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium flex items-center justify-center space-x-1.5 transition-all"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Devpost / Case Study</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Screenshot / Gradient Frame */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl overflow-hidden relative">
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
                <span className="text-xs text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to view full screenshot</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-[21/9] w-full bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 flex items-center justify-center p-6 sm:p-8 text-center">
              <div>
                <FolderGit2 className="w-12 h-12 text-indigo-400 mx-auto mb-2 opacity-60" />
                <h3 className="text-lg sm:text-xl font-bold text-white">{project.title}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {project.raw_github_metadata?.description || "Public GitHub Repository Case Study"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Audience Perspective Switcher on Public Page */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">Audience Lens:</span>
            <span className="text-[11px] text-slate-400">
              Tuned for {audienceView} perspective
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(["recruiter", "client", "non-technical", "judge"] as AudienceVersion[]).map((v) => (
              <button
                key={v}
                onClick={() => setAudienceView(v)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  audienceView === v
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/20 bg-slate-900/60 shadow-lg">
            <div className="text-xs uppercase font-mono font-bold text-rose-400 tracking-wider mb-2">
              The Problem
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 shadow-lg">
            <div className="text-xs uppercase font-mono font-bold text-emerald-400 tracking-wider mb-2">
              The Engineered Solution
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Section: Key Features */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-5 flex items-center space-x-2">
            <span>Key Features & Capabilities</span>
            <span className="text-xs font-normal text-slate-400">
              ({project.features?.length || 0} features)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {project.features?.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3"
              >
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: How It Works */}
        {project.how_it_works && project.how_it_works.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-5">
              How It Works: Step-by-Step Workflow
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {project.how_it_works.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center mb-2.5">
                    0{idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Tech Stack With Grounded Reasons */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-1.5">
            Technology Stack & Technical Rationale
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Directly grounded in repository code, package manifests, and language dependencies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {project.tech_stack?.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="font-semibold text-indigo-300 text-xs sm:text-sm mb-1">{t.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{t.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Architecture Diagram & Summary */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl space-y-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">System Architecture Flow</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{project.architecture_summary}</p>
          </div>

          <MermaidChart
            chart={project.mermaid_diagram}
            title={`${project.github_repo} Data Flow`}
          />
        </div>

        {/* Section: Video Embed (if provided) */}
        {youtubeId && (
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">Project Walkthrough Video</h2>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800">
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
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-white mb-5">
              Application Gallery ({project.images.length} Screenshots)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImage(img.image_url)}
                  className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer hover:border-slate-700 transition-all shadow-md flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.caption || `Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-lg bg-slate-900/80 text-white text-xs flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                  </div>
                  {img.caption && (
                    <div className="p-2.5 sm:p-3 text-xs text-slate-300 truncate font-medium">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: 45-Second Pitch Teleprompter */}
        {project.pitch_script && (
          <PitchTeleprompter
            pitchScript={project.pitch_script}
            projectTitle={project.title}
          />
        )}

        {/* Section: Interview Prep Accordion */}
        {project.interview_questions && project.interview_questions.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl">
            <div className="mb-5">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Technical Interview Preparation & Defense
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Five questions hiring managers are most likely to ask based on this project&apos;s technical architecture.
              </p>
            </div>

            <InterviewPrepAccordion questions={project.interview_questions} />
          </div>
        )}

        {/* Section: Contributors & Built By */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                author.avatar_url ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${project.github_owner}`
              }
              alt={author.name || project.github_owner}
              className="w-12 sm:w-14 h-12 sm:h-14 rounded-full ring-2 ring-indigo-500/40 object-cover shadow-lg"
            />
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase font-mono text-indigo-400 font-semibold tracking-wider">
                Crafted & Engineered By
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {author.name || project.github_owner}
              </h3>
              <p className="text-xs text-slate-400">
                GitHub: @{author.github_username || project.github_owner}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <a
              href={`https://github.com/${author.github_username || project.github_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Project Story</span>
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
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
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
