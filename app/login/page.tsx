"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  FolderGit2, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("guest-login", {
        redirect: false,
        email: email.trim(),
        name: name.trim() || (mode === "signup" ? "Developer" : undefined),
        github_username: githubUsername.trim() || undefined,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || "Authentication failed. Please try again.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      const res = await signIn("guest-login", {
        redirect: false,
        email: "demo.builder@repofolio.dev",
        name: "Alex Rivers",
        github_username: "alexrivers",
        callbackUrl,
      });

      if (res?.error) {
        setError("Could not launch demo workspace.");
        setDemoLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Could not launch demo workspace.");
      setDemoLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-[#2A2A2F] bg-[#121214] shadow-2xl overflow-hidden">
      {/* Left Column: Brand & Value Prop Panel */}
      <div className="lg:col-span-5 p-8 sm:p-10 bg-[#17171A] border-b lg:border-b-0 lg:border-r border-[#2A2A2F] flex flex-col justify-between">
        <div>
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] text-[#111111] flex items-center justify-center font-bold">
              <FolderGit2 className="w-4 h-4 text-[#111111]" />
            </div>
            <span className="font-semibold text-base text-[#FAFAFA] tracking-tight">RepoFolio</span>
          </Link>

          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#1E1E22] border border-[#2A2A2F] text-[11px] font-mono text-[#A1A1AA] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FAFAFA]" />
            <span>GitHub → Portfolio Story</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] tracking-tight leading-snug">
            Turn your GitHub repo into a project story recruiters actually understand.
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-3 leading-relaxed">
            Generate an editable case study with architecture flows, tech stack choices, and a recruiter-ready link.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-[#A1A1AA]">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span>Uses public repository evidence</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#A1A1AA]">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span>You review every AI-generated detail</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#A1A1AA]">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span>Share a clean, recruiter-ready link</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#222226] text-[11px] text-[#71717A] flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
          <span>High-trust, read-only inspection. No write access required.</span>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
        {/* Mode Switcher */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#FAFAFA] tracking-tight">
              {mode === "signup" ? "Create your free account" : "Welcome back"}
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              {mode === "signup"
                ? "Start generating recruiter-ready case studies in minutes."
                : "Sign in to manage and share your project stories."}
            </p>
          </div>
          <div className="flex p-0.5 rounded-lg bg-[#101012] border border-[#2A2A2F]">
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === "signup"
                  ? "bg-[#FAFAFA] text-[#111111] font-semibold"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === "signin"
                  ? "bg-[#FAFAFA] text-[#111111] font-semibold"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              Sign in
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 p-3.5 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#FAFAFA] flex items-start space-x-2.5"
          >
            <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="user-name-input"
                className="block text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full h-11 px-3.5 rounded-xl bg-[#101012] border border-[#2A2A2F] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="user-email-input"
              className="block text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-1.5"
            >
              Work or Personal Email
            </label>
            <input
              id="user-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-[#101012] border border-[#2A2A2F] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all"
            />
          </div>

          {mode === "signup" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="user-github-input"
                  className="block text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider"
                >
                  GitHub Username <span className="text-[#71717A] font-normal">(Optional)</span>
                </label>
              </div>
              <input
                id="user-github-input"
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. alexrivers"
                className="w-full h-11 px-3.5 rounded-xl bg-[#101012] border border-[#2A2A2F] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA] transition-all font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full h-11 mt-2 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-sm font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === "signup" ? "Create free account" : "Sign in to workspace"}</span>
                <ArrowRight className="w-4 h-4 text-[#111111]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222226]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-[#121214] px-3 text-[#71717A] font-medium">Or explore instantly</span>
          </div>
        </div>

        {/* Demo workspace secondary CTA */}
        <button
          type="button"
          onClick={handleDemoAccess}
          disabled={loading || demoLoading}
          className="w-full h-11 rounded-xl border border-[#2A2A2F] bg-[#17171A] hover:bg-[#1E1E22] text-xs sm:text-sm font-medium text-[#FAFAFA] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {demoLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FAFAFA]" />
              <span>Launching demo workspace...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#FAFAFA]" />
              <span>Try demo workspace (Alex Rivers sample)</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[#71717A] mt-5">
          By continuing, you agree to inspect only public repository data.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-[#A1A1AA]">
            <Loader2 className="w-6 h-6 animate-spin text-[#FAFAFA] mr-2" />
            <span>Loading...</span>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
