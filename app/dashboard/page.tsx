"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Plus, 
  Layers, 
  Loader2, 
  Star,
  Globe
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
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Developer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Project Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, edit, and share your non-technical portfolio case studies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowIngestModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
            id="dashboard-new-project-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Story</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0d1322]">
          <span className="text-[11px] uppercase font-mono font-semibold text-slate-400">
            Total Stories
          </span>
          <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0d1322]">
          <span className="text-[11px] uppercase font-mono font-semibold text-emerald-400">
            Published Pages
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{publishedCount}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0d1322]">
          <span className="text-[11px] uppercase font-mono font-semibold text-amber-400">
            Total GitHub Stars
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{totalStars}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0d1322]">
          <span className="text-[11px] uppercase font-mono font-semibold text-indigo-400">
            Shareable Status
          </span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">Ready</div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
          <span className="text-sm font-medium text-slate-400">Loading project stories...</span>
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
        /* Empty State */
        <div className="py-20 px-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">No project stories created yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Paste any public GitHub repository URL to create a recruiter-ready case study complete with architecture flows, tech stack rationale, and interview prep.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => setShowIngestModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Project Story</span>
            </button>
          </div>
        </div>
      )}

      {showIngestModal && (
        <RepoIngestModal onClose={() => { setShowIngestModal(false); fetchProjects(); }} />
      )}
    </div>
  );
}
