"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { FolderGit2, Plus, LogOut, Sparkles, User as UserIcon } from "lucide-react";
import RepoIngestModal from "./RepoIngestModal";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2F] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] text-[#111111] flex items-center justify-center font-bold shadow-sm transition-transform duration-150 group-hover:scale-102">
                <FolderGit2 className="w-4 h-4 text-[#111111]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base tracking-tight text-[#FAFAFA]">
                  RepoFolio
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-[#2A2A2F] text-[#A1A1AA] bg-[#121214]">
                  v1.0
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-[#A1A1AA]">
              <a
                href="/#how-it-works"
                className="hover:text-[#FAFAFA] transition-colors"
              >
                How it works
              </a>
              <a
                href="/#example"
                className="hover:text-[#FAFAFA] transition-colors"
              >
                Example
              </a>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="hover:text-[#FAFAFA] transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs sm:text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg border border-transparent hover:border-[#2A2A2F] hover:bg-[#121214] transition-all hidden sm:inline-block"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => setShowIngestModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer active:scale-98"
                  id="nav-create-story-btn"
                >
                  <Plus className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Create story</span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-label="User menu"
                    className="w-8 h-8 rounded-full border border-[#2A2A2F] overflow-hidden flex items-center justify-center bg-[#17171A] text-xs text-[#FAFAFA] font-medium hover:border-[#FAFAFA] transition-colors"
                  >
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(session.user?.name || "U").charAt(0).toUpperCase()}</span>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#2A2A2F] bg-[#121214] shadow-2xl p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-[#222226]">
                        <p className="text-xs font-semibold text-[#FAFAFA] truncate">
                          {session.user?.name || "Developer"}
                        </p>
                        <p className="text-[11px] text-[#71717A] truncate">
                          {session.user?.email || ""}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#17171A] rounded-lg transition-colors"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>My Project Stories</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => signIn("guest-login", { callbackUrl: "/dashboard" })}
                  className="hidden lg:inline-flex items-center space-x-1 text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors mr-1"
                >
                  <Sparkles className="w-3 h-3 text-[#A1A1AA]" />
                  <span>Try demo workspace</span>
                </button>

                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign in
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold transition-colors shadow-sm active:scale-98"
                >
                  <span>Create free account</span>
                </Link>
              </>
            )}
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
