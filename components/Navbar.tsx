"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderGit2, Plus } from "lucide-react";
import RepoIngestModal from "./RepoIngestModal";

export default function Navbar() {
  const [showIngestModal, setShowIngestModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2F] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] text-[#111111] flex items-center justify-center font-bold shadow-sm transition-transform duration-150 group-hover:scale-102">
                <FolderGit2 className="w-4 h-4 text-[#111111]" />
              </div>
              <span className="font-semibold text-base tracking-tight text-[#FAFAFA]">
                RepoFolio
              </span>
            </Link>
          </div>

          {/* Right: Primary Action */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowIngestModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer active:scale-98"
              id="nav-analyze-repo-btn"
            >
              <Plus className="w-3.5 h-3.5 text-[#111111]" />
              <span>Explain repository</span>
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
