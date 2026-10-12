import React from "react";
import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A2F] bg-[#0A0A0A] text-[#71717A] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-[#17171A] border border-[#2A2A2F] flex items-center justify-center text-[#FAFAFA]">
            <FolderGit2 className="w-3.5 h-3.5 text-[#FAFAFA]" />
          </div>
          <div>
            <span className="font-medium text-[#FAFAFA] text-sm">RepoFolio</span>
            <p className="text-xs text-[#71717A] mt-0.5">
              Turn your GitHub repository into an editable project story recruiters understand.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-[#A1A1AA]">
          <Link href="/dashboard" className="hover:text-[#FAFAFA] transition-colors">
            Dashboard
          </Link>
          <a href="#how-it-works" className="hover:text-[#FAFAFA] transition-colors">
            How it works
          </a>
          <a href="#example" className="hover:text-[#FAFAFA] transition-colors">
            Example
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FAFAFA] transition-colors flex items-center space-x-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="text-xs text-[#71717A]">
          © {new Date().getFullYear()} RepoFolio. Portfolio stories grounded in code evidence.
        </div>
      </div>
    </footer>
  );
}
