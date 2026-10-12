"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FolderGit2, 
  Sparkles, 
  X, 
  HelpCircle, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import AudienceSelector from "./AudienceSelector";
import { AudienceVersion, UserOnboardingAnswers } from "@/types";

interface RepoIngestModalProps {
  onClose: () => void;
  initialUrl?: string;
}

export default function RepoIngestModal({ onClose, initialUrl = "" }: RepoIngestModalProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [audience, setAudience] = useState<AudienceVersion>("recruiter");
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<UserOnboardingAnswers>({
    problemSolved: "",
    targetAudience: "",
    proudestAchievement: "",
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Validating repository & calling GitHub REST API",
    "Parsing README, manifests & commit activity",
    "Analyzing architecture & dependency graph",
    "AI generating audience story & Mermaid diagram",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setLoading(true);
    setCurrentStep(0);

    // Simulate animated step progression for perceived speed and transparency
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1400);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          audience,
          onboardingAnswers: showQuestions ? answers : undefined,
        }),
      });

      clearInterval(stepInterval);
      const data = await res.json();

      if (data.success && data.project?.id) {
        setCurrentStep(steps.length);
        setTimeout(() => {
          onClose();
          router.push(`/dashboard/project/${data.project.id}`);
        }, 600);
      } else {
        setError(data.error || "Failed to process repository.");
        setLoading(false);
      }
    } catch (err: unknown) {
      clearInterval(stepInterval);
      console.error(err);
      setError("Network error while connecting to RepoFolio API.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0c1220] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Story Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Turn your GitHub repo into a project story
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Paste any public repository URL. We&apos;ll parse the code, dependencies, and README to craft a recruiter-ready case study.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs sm:text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <span className="font-semibold text-slate-200 text-sm">
                Analyzing repository signals...
              </span>
            </div>

            {/* Step progress list */}
            <div className="space-y-3 max-w-md mx-auto">
              {steps.map((step, idx) => {
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDone
                        ? "bg-slate-900/40 border-emerald-500/30 text-emerald-400"
                        : isCurrent
                        ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/30"
                        : "bg-slate-950/20 border-slate-800/40 text-slate-500"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-slate-500 font-mono">
              Grounding story in code AST, languages, and commit history...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Repo URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repository or username/repo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>Examples: github.com/owner/repo or owner/repo</span>
                <span className="text-indigo-400">Public repos only in v1</span>
              </div>
            </div>

            {/* Audience selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Audience Version
              </label>
              <AudienceSelector
                selected={audience}
                onChange={setAudience}
                variant="cards"
              />
            </div>

            {/* 3 Onboarding Questions toggle */}
            <div className="border border-slate-800/80 rounded-xl bg-slate-950/40 p-4">
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Does your repo have a sparse README? Add 3 quick hints (Optional)</span>
                </div>
                <span className="text-[11px] text-indigo-400 underline">
                  {showQuestions ? "Hide hints" : "Add hints"}
                </span>
              </button>

              {showQuestions && (
                <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      1. What problem does this project solve?
                    </label>
                    <input
                      type="text"
                      value={answers.problemSolved}
                      onChange={(e) =>
                        setAnswers({ ...answers, problemSolved: e.target.value })
                      }
                      placeholder="e.g. People struggle to track macros for homemade meals"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      2. Who is it for?
                    </label>
                    <input
                      type="text"
                      value={answers.targetAudience}
                      onChange={(e) =>
                        setAnswers({ ...answers, targetAudience: e.target.value })
                      }
                      placeholder="e.g. Fitness enthusiasts, athletes, busy parents"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      3. What are you most proud of or what was the hardest hurdle?
                    </label>
                    <input
                      type="text"
                      value={answers.proudestAchievement}
                      onChange={(e) =>
                        setAnswers({ ...answers, proudestAchievement: e.target.value })
                      }
                      placeholder="e.g. Sub-second multi-dish vision classification and custom portion estimation"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
