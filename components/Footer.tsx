import React from "react";
import Link from "next/link";
import { FolderGit2, Heart } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="font-semibold text-slate-200 text-sm">RepoFolio</span>
            <p className="text-xs text-slate-500">
              Turn your GitHub repository into a project story that recruiters, clients, and judges can actually understand.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center space-x-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="text-xs text-slate-500 flex items-center space-x-1">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for developers & innovators</span>
        </div>
      </div>
    </footer>
  );
}
