"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Sparkles, 
  Plus, 
  Layers
} from "lucide-react";
import RepoIngestModal from "./RepoIngestModal";

export default function Navbar() {
  const [showIngestModal, setShowIngestModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <FolderGit2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  RepoFolio
                </span>
                <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase -mt-1">
                  Project Story Builder
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>My Stories</span>
            </Link>

            <button
              onClick={() => setShowIngestModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
              id="new-project-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Story</span>
            </button>
          </div>
        </div>
      </header>

      {/* Repo Ingestion Modal */}
      {showIngestModal && (
        <RepoIngestModal onClose={() => setShowIngestModal(false)} />
      )}
    </>
  );
}
