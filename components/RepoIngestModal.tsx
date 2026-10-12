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
  ArrowRight,
  ShieldCheck
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
    "Validating repository & reading GitHub signals",
    "Parsing README, tech stack & commit history",
    "Analyzing architecture & file structure",
    "Generating audience story & architecture diagram",
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
        }, 500);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingest-modal-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2A2A2F] bg-[#121214] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[#A1A1AA] hover:text-[#FAFAFA] p-1.5 rounded-lg border border-transparent hover:border-[#2A2A2F] hover:bg-[#1E1E22] transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#17171A] border border-[#2A2A2F] text-[#A1A1AA] text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FAFAFA]" />
            <span>AI Story Engine</span>
          </div>
          <h2 id="ingest-modal-title" className="text-xl sm:text-2xl font-bold text-[#FAFAFA] tracking-tight">
            Turn your GitHub repo into a project story
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 leading-relaxed">
            Enter a public repository. We will inspect the README, tech stack, and structure to generate a clear, editable case study.
          </p>

          {/* Trust callout */}
          <div className="mt-3.5 flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#17171A] border border-[#222226] text-[12px] text-[#A1A1AA]">
            <ShieldCheck className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <span>We only analyze public repository information. You can review and edit everything before publishing.</span>
          </div>
        </div>

        {error && (
          <div 
            role="alert" 
            aria-live="assertive"
            className="mb-5 p-4 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#FAFAFA] text-xs sm:text-sm flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#EF4444] mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-5 h-5 text-[#FAFAFA] animate-spin" />
              <span className="font-semibold text-[#FAFAFA] text-sm">
                Analyzing repository signals...
              </span>
            </div>

            {/* Step progress list */}
            <div className="space-y-2.5 max-w-md mx-auto" aria-live="polite">
              {steps.map((step, idx) => {
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDone
                        ? "bg-[#17171A] border-[#2A2A2F] text-[#22C55E]"
                        : isCurrent
                        ? "bg-[#1E1E22] border-[#FAFAFA] text-[#FAFAFA] ring-1 ring-[#FAFAFA]/20"
                        : "bg-[#101012] border-[#222226] text-[#71717A]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#FAFAFA] animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#2A2A2F] flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-[#71717A]">
              Grounding story in repository evidence and architecture signals...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Repo URL Input */}
            <div>
              <label 
                htmlFor="repo-url-input" 
                className="block text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-2"
              >
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <input
                  id="repo-url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repository or username/repo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#101012] border border-[#2A2A2F] focus:border-[#FAFAFA] text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#FAFAFA] transition-all font-mono"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#71717A] mt-1.5">
                <span>Examples: github.com/owner/repo or owner/repo</span>
                <span className="text-[#A1A1AA]">Public repos supported</span>
              </div>
            </div>

            {/* Audience selector */}
            <div>
              <label className="block text-xs font-semibold text-[#FAFAFA] uppercase tracking-wider mb-2">
                Target Audience Version
              </label>
              <AudienceSelector
                selected={audience}
                onChange={setAudience}
                variant="cards"
              />
            </div>

            {/* 3 Optional hints toggle */}
            <div className="border border-[#2A2A2F] rounded-xl bg-[#101012] p-4">
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Sparse README? Add 3 quick hints for higher accuracy (Optional)</span>
                </div>
                <span className="text-[11px] text-[#FAFAFA] underline underline-offset-2">
                  {showQuestions ? "Hide hints" : "Add hints"}
                </span>
              </button>

              {showQuestions && (
                <div className="mt-4 space-y-3 pt-3 border-t border-[#2A2A2F]">
                  <div>
                    <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                      1. What problem does this project solve?
                    </label>
                    <input
                      type="text"
                      value={answers.problemSolved}
                      onChange={(e) =>
                        setAnswers({ ...answers, problemSolved: e.target.value })
                      }
                      placeholder="e.g. Teams struggle to track cross-cloud infrastructure drift"
                      className="w-full px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                      2. Who is it for?
                    </label>
                    <input
                      type="text"
                      value={answers.targetAudience}
                      onChange={(e) =>
                        setAnswers({ ...answers, targetAudience: e.target.value })
                      }
                      placeholder="e.g. DevOps engineers, site reliability teams, platform leads"
                      className="w-full px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#A1A1AA] mb-1">
                      3. What are you most proud of or what was the hardest hurdle?
                    </label>
                    <input
                      type="text"
                      value={answers.proudestAchievement}
                      onChange={(e) =>
                        setAnswers({ ...answers, proudestAchievement: e.target.value })
                      }
                      placeholder="e.g. Sub-second drift detection with zero false positives"
                      className="w-full px-3 py-2 rounded-lg bg-[#17171A] border border-[#2A2A2F] text-xs text-[#FAFAFA] placeholder-[#71717A] focus:outline-none focus:border-[#FAFAFA]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1E1E22] border border-transparent hover:border-[#2A2A2F] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FAFAFA] hover:bg-[#E4E4E7] text-[#111111] text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#111111]" />
                <span>Generate Project Story</span>
                <ArrowRight className="w-4 h-4 text-[#111111]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
