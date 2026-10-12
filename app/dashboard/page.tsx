"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Plus, 
  Layers, 
  FileEdit,
  Share2,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import RepoIngestModal from "@/components/RepoIngestModal";
import { ProjectModel } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIngestModal, setShowIngestModal] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = (deletedId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const publishedCount = projects.filter((p) => p.status === "published" && p.is_public).length;
  const totalStars = projects.reduce((acc, p) => acc + (p.raw_github_metadata?.stars || 0), 0);

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-[#FAFAFA]" />
            <span>Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] tracking-tight">
            Repositories &amp; Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Extracted repository breakdowns, architecture flows, and technical documentation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowIngestModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            id="dashboard-new-project-btn"
          >
            <Plus className="w-4 h-4 text-[#111111]" />
            <span>Add GitHub repository</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards (Shown for all users) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-[#2A2A2F] bg-[#121214]">
          <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A]">
            Total Repositories
          </span>
          <div className="text-2xl font-bold text-[#FAFAFA] mt-1">{loading ? "—" : projects.length}</div>
        </div>

        <div className="p-4 rounded-xl border border-[#2A2A2F] bg-[#121214]">
          <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A]">
            Published
          </span>
          <div className="text-2xl font-bold text-[#22C55E] mt-1">{loading ? "—" : publishedCount}</div>
        </div>

        <div className="p-4 rounded-xl border border-[#2A2A2F] bg-[#121214]">
          <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A]">
            GitHub Stars
          </span>
          <div className="text-2xl font-bold text-[#FAFAFA] mt-1">{loading ? "—" : totalStars}</div>
        </div>

        <div className="p-4 rounded-xl border border-[#2A2A2F] bg-[#121214]">
          <span className="text-[11px] uppercase font-mono font-semibold text-[#71717A]">
            Overview Link
          </span>
          <div className="text-2xl font-bold text-[#FAFAFA] mt-1">Ready</div>
        </div>
      </div>

      {/* Projects Content / Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading projects">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl border border-[#2A2A2F] bg-[#121214] p-5 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-[#1E1E22] rounded-full" />
                <div className="h-4 w-12 bg-[#1E1E22] rounded" />
              </div>
              <div className="h-6 w-3/4 bg-[#1E1E22] rounded" />
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-[#17171A] rounded" />
                <div className="h-3.5 w-4/5 bg-[#17171A] rounded" />
              </div>
              <div className="pt-4 border-t border-[#222226] flex justify-between">
                <div className="h-4 w-28 bg-[#17171A] rounded" />
                <div className="h-4 w-16 bg-[#17171A] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        /* Section 11: Onboarding UX for New User */
        <div className="py-14 px-6 sm:px-10 rounded-2xl border border-[#2A2A2F] bg-[#121214] max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-xl bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA] mx-auto mb-4">
            <FolderGit2 className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] tracking-tight">
            Analyze your first repository
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2 max-w-lg mx-auto leading-relaxed">
            Paste a public GitHub repository. RepoFolio will extract the codebase signals, architecture flows, and technical breakdown.
          </p>

          {/* Small 3-step sequence */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-xl border border-[#222226] bg-[#17171A]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#FAFAFA] mb-1">
                <span className="w-5 h-5 rounded-full bg-[#2A2A2F] flex items-center justify-center text-[11px] text-[#FAFAFA]">1</span>
                <span>Paste repo URL</span>
              </div>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Connect any public repository without authorization.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#222226] bg-[#17171A]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#FAFAFA] mb-1">
                <span className="w-5 h-5 rounded-full bg-[#2A2A2F] flex items-center justify-center text-[11px] text-[#FAFAFA]">2</span>
                <span>Review AI draft</span>
              </div>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Inspect and edit every section, screenshot, and flow.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#222226] bg-[#17171A]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#FAFAFA] mb-1">
                <span className="w-5 h-5 rounded-full bg-[#2A2A2F] flex items-center justify-center text-[11px] text-[#FAFAFA]">3</span>
                <span>Publish and share</span>
              </div>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                Send a recruiter-ready link to founders and judges.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowIngestModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-sm font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#111111]" />
              <span>Add GitHub repository</span>
            </button>

            <Link
              href="/#example"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 rounded-xl border border-[#2A2A2F] bg-[#17171A] hover:bg-[#1E1E22] text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <span>View an example first</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center space-x-2 text-[12px] text-[#71717A]">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>We only analyze public repository data. You review every detail before publishing.</span>
          </div>
        </div>
      )}

      {showIngestModal && (
        <RepoIngestModal onClose={() => { setShowIngestModal(false); fetchProjects(); }} />
      )}
    </div>
  );
}
