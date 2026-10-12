"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GitFork, 
  Star, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Check, 
  Trash2, 
  Globe, 
  Lock,
  Layers,
  Calendar
} from "lucide-react";
import { ProjectModel } from "@/types";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectModel;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/p/${project.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete?.(project.id);
      } else {
        alert("Failed to delete project");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const isPublished = project.status === "published" && project.is_public;

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1322] hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-lg flex flex-col group">
      {/* Top Card Header */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status & Audience Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {isPublished ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    <span>Draft</span>
                  </>
                )}
              </span>

              <span className="px-2 py-0.5 rounded text-[11px] font-medium capitalize bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {project.audience_version} mode
              </span>
            </div>

            {/* GitHub stats */}
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1" title="Stars">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.raw_github_metadata?.stars || 0}</span>
              </span>
              <span className="flex items-center space-x-1" title="Forks">
                <GitFork className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.raw_github_metadata?.forks || 0}</span>
              </span>
            </div>
          </div>

          {/* Title & Pitch */}
          <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {project.one_line_pitch}
          </p>
        </div>

        {/* Repository Meta Details */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 truncate">
            <a
              href={`https://github.com/${project.github_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center truncate"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github.com/${project.github_owner}.png`}
                alt={project.github_owner}
                className="w-3.5 h-3.5 rounded-full mr-1 inline"
              />
              <span>{project.github_owner}</span>
            </a>
            <span className="text-slate-600">/</span>
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-slate-300 hover:text-white transition-colors truncate"
            >
              {project.github_repo}
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">
              {project.raw_github_metadata?.primaryLanguage || "Code"}
            </span>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0 text-[11px]">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{formatDate(project.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Link
            href={`/dashboard/project/${project.id}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Story</span>
          </Link>

          <Link
            href={`/p/${project.slug}`}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy Public Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors disabled:opacity-50"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
