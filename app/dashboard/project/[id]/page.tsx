"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  ExternalLink, 
  Globe, 
  Lock, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Loader2, 
  Check, 
  FolderGit2, 
  Code2, 
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Video,
  Mic,
  Copy
} from "lucide-react";
import AudienceSelector from "@/components/AudienceSelector";
import MermaidChart from "@/components/MermaidChart";
import ScreenshotUploader from "@/components/ScreenshotUploader";
import PitchTeleprompter from "@/components/PitchTeleprompter";
import InterviewPrepAccordion from "@/components/InterviewPrepAccordion";
import { AudienceVersion, ProjectModel, TechStackItem } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"story" | "tech" | "proof" | "pitch" | "interview" | "settings">("story");
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [pitch, setPitch] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [howItWorks, setHowItWorks] = useState<string[]>([]);
  const [archSummary, setArchSummary] = useState("");
  const [mermaid, setMermaid] = useState("");
  const [futureImprovements, setFutureImprovements] = useState<string[]>([]);
  const [pitchScript, setPitchScript] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<{ question: string; talking_points?: string }[]>([]);
  const [audience, setAudience] = useState<AudienceVersion>("recruiter");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caseStudyUrl, setCaseStudyUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project as ProjectModel;
        setProject(p);
        setTitle(p.title || "");
        setPitch(p.one_line_pitch || "");
        setProblem(p.problem || "");
        setSolution(p.solution || "");
        setFeatures(Array.isArray(p.features) ? p.features : []);
        setTechStack(Array.isArray(p.tech_stack) ? p.tech_stack : []);
        setHowItWorks(Array.isArray(p.how_it_works) ? p.how_it_works : []);
        setArchSummary(p.architecture_summary || "");
        setMermaid(p.mermaid_diagram || "");
        setFutureImprovements(Array.isArray(p.future_improvements) ? p.future_improvements : []);
        setPitchScript(p.pitch_script || "");
        setInterviewQuestions(Array.isArray(p.interview_questions) ? p.interview_questions : []);
        setAudience(p.audience_version || "recruiter");
        setLiveDemoUrl(p.live_demo_url || "");
        setVideoUrl(p.video_url || "");
        setCaseStudyUrl(p.external_case_study_url || "");
        setIsPublic(p.is_public ?? true);
        setStatus(p.status || "draft");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleSave = async (newStatus?: "draft" | "published") => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payloadStatus = newStatus || status;
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          one_line_pitch: pitch,
          problem,
          solution,
          features,
          tech_stack: techStack,
          how_it_works: howItWorks,
          architecture_summary: archSummary,
          mermaid_diagram: mermaid,
          future_improvements: futureImprovements,
          pitch_script: pitchScript,
          interview_questions: interviewQuestions,
          audience_version: audience,
          live_demo_url: liveDemoUrl || null,
          video_url: videoUrl || null,
          external_case_study_url: caseStudyUrl || null,
          is_public: isPublic,
          status: payloadStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (newStatus) setStatus(newStatus);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert(data.error || "Failed to save project.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving project changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateSection = async (section: string) => {
    setRegeneratingSection(section);
    try {
      const res = await fetch(`/api/projects/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          audience,
        }),
      });

      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project;
        if (section === "problem") setProblem(p.problem);
        if (section === "solution") setSolution(p.solution);
        if (section === "features") setFeatures(p.features);
        if (section === "pitch_script") setPitchScript(p.pitch_script);
        if (section === "mermaid_diagram") setMermaid(p.mermaid_diagram);
        if (section === "architecture_summary") setArchSummary(p.architecture_summary);
        if (section === "how_it_works") setHowItWorks(p.how_it_works);
        if (section === "interview_questions") setInterviewQuestions(p.interview_questions);
      }
    } catch (err) {
      console.error(err);
      alert("Error regenerating section.");
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handleSwitchAudience = async (newAudience: AudienceVersion) => {
    setAudience(newAudience);
    if (!confirm(`Switch story to '${newAudience}' persona? This will regenerate the copy to match this audience.`)) return;

    setRegeneratingSection("full");
    try {
      const res = await fetch(`/api/projects/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience: newAudience }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project;
        setTitle(p.title);
        setPitch(p.one_line_pitch);
        setProblem(p.problem);
        setSolution(p.solution);
        setFeatures(p.features);
        setArchSummary(p.architecture_summary);
        setPitchScript(p.pitch_script);
        setInterviewQuestions(p.interview_questions);
      }
    } finally {
      setRegeneratingSection(null);
    }
  };

  const copyPublicLink = () => {
    if (!project) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/p/${project.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-28 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
        <span className="text-sm">Loading Project Story Editor...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-28 text-slate-400">
        <h2 className="text-lg font-bold text-white">Project not found</h2>
        <Link href="/dashboard" className="mt-3 text-xs text-indigo-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Action Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-indigo-400">
                {project.github_owner}/{project.github_repo}
              </span>
              <span className="text-slate-600">•</span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  status === "published"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 truncate max-w-xl">
              {title}
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={copyPublicLink}
            className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center space-x-1.5"
            title="Copy Public Story Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
          </button>

          <Link
            href={`/p/${project.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center space-x-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Page</span>
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Draft"}</span>
          </button>

          <button
            onClick={() => handleSave(status === "published" ? "draft" : "published")}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ${
              status === "published"
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{status === "published" ? "Unpublish to Draft" : "Publish Live"}</span>
          </button>
        </div>
      </div>

      {/* Audience switcher bar */}
      <div className="mb-6 p-4 rounded-xl border border-slate-800 bg-[#0d1322]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Audience Persona
            </span>
            <p className="text-[11px] text-slate-400">
              Switching audience personas will re-orient the story language and interview prep focus.
            </p>
          </div>
          {regeneratingSection === "full" && (
            <div className="flex items-center space-x-2 text-xs text-indigo-400 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Regenerating story for new audience...</span>
            </div>
          )}
        </div>
        <AudienceSelector
          selected={audience}
          onChange={handleSwitchAudience}
          variant="pills"
        />
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 mb-6 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab("story")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "story"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Core Story & Features</span>
        </button>

        <button
          onClick={() => setActiveTab("tech")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "tech"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Tech Stack & Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab("proof")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "proof"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Screenshots & Live Demo Proof</span>
        </button>

        <button
          onClick={() => setActiveTab("pitch")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "pitch"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>45s Spoken Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab("interview")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "interview"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interview Prep Q&A</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
            activeTab === "settings"
              ? "border-indigo-500 text-indigo-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Publish & Links</span>
        </button>
      </div>

      {/* Tab 1: Core Story & Features */}
      {activeTab === "story" && (
        <div className="space-y-6">
          {/* Title & One-line pitch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                One-Line Value Proposition
              </label>
              <input
                type="text"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Problem & Solution with individual section regeneration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Problem Statement
                </label>
                <button
                  type="button"
                  onClick={() => handleRegenerateSection("problem")}
                  disabled={regeneratingSection === "problem"}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${regeneratingSection === "problem" ? "animate-spin" : ""}`} />
                  <span>Regenerate Problem</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Solution Explanation
                </label>
                <button
                  type="button"
                  onClick={() => handleRegenerateSection("solution")}
                  disabled={regeneratingSection === "solution"}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${regeneratingSection === "solution" ? "animate-spin" : ""}`} />
                  <span>Regenerate Solution</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Key Features (max 6) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Key Features (Max 6)
                </label>
                <p className="text-[11px] text-slate-400">
                  Concise bullets summarizing what your software actually accomplishes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("features")}
                disabled={regeneratingSection === "features"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "features" ? "animate-spin" : ""}`} />
                <span>Regenerate Features</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[idx] = e.target.value;
                      setFeatures(updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {features.length < 6 && (
                <button
                  type="button"
                  onClick={() => setFeatures([...features, "New feature description"])}
                  className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature Bullet</span>
                </button>
              )}
            </div>
          </div>

          {/* How It Works (4-6 steps) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  How It Works (4–6 Steps)
                </label>
                <p className="text-[11px] text-slate-400">
                  Sequential workflow showing user trigger, processing, and delivered result.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("how_it_works")}
                disabled={regeneratingSection === "how_it_works"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "how_it_works" ? "animate-spin" : ""}`} />
                <span>Regenerate Steps</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-6 text-center text-xs font-mono font-semibold text-indigo-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => {
                      const updated = [...howItWorks];
                      updated[idx] = e.target.value;
                      setHowItWorks(updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setHowItWorks(howItWorks.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tech Stack & Architecture */}
      {activeTab === "tech" && (
        <div className="space-y-6">
          {/* Tech Stack List */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Technologies & Selection Reasons
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Recruiters love understanding WHY you picked a library rather than just seeing a list of names.
            </p>

            <div className="space-y-3">
              {techStack.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    placeholder="Technology name (e.g. Next.js)"
                    onChange={(e) => {
                      const updated = [...techStack];
                      updated[idx].name = e.target.value;
                      setTechStack(updated);
                    }}
                    className="w-full sm:w-1/3 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={item.reason}
                    placeholder="Why this was chosen (e.g. Server components for fast rendering)"
                    onChange={(e) => {
                      const updated = [...techStack];
                      updated[idx].reason = e.target.value;
                      setTechStack(updated);
                    }}
                    className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTechStack(techStack.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTechStack([...techStack, { name: "", reason: "" }])}
                className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Technology</span>
              </button>
            </div>
          </div>

          {/* Architecture Summary */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Architecture Summary
              </label>
              <button
                type="button"
                onClick={() => handleRegenerateSection("architecture_summary")}
                disabled={regeneratingSection === "architecture_summary"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "architecture_summary" ? "animate-spin" : ""}`} />
                <span>Regenerate Summary</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={archSummary}
              onChange={(e) => setArchSummary(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Mermaid Diagram Code & Preview */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Mermaid.js Flowchart
                </label>
                <p className="text-[11px] text-slate-400">
                  Edit the Mermaid syntax below to update the visual flow diagram.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("mermaid_diagram")}
                disabled={regeneratingSection === "mermaid_diagram"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "mermaid_diagram" ? "animate-spin" : ""}`} />
                <span>Regenerate Diagram</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <textarea
                rows={10}
                value={mermaid}
                onChange={(e) => setMermaid(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 leading-normal"
              />
              <MermaidChart chart={mermaid} title="Live Diagram Preview" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Screenshots & Proof */}
      {activeTab === "proof" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Proof of Work: App Screenshots (2–6 Images)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload 2 to 6 real screenshots of your application in action.
              </p>
            </div>

            <ScreenshotUploader
              projectId={project.id}
              images={project.images || []}
              onImagesChange={(updated) => {
                setProject({ ...project, images: updated });
              }}
              maxImages={6}
            />
          </div>

          {/* Proof Links (Live Demo, Video, Case Study) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322] space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Verification & Demo Links
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Live Deployed Demo URL
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://yourapp.vercel.app"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Demo Video / YouTube URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or Loom URL"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                External Devpost or Case Study URL
              </label>
              <input
                type="url"
                value={caseStudyUrl}
                onChange={(e) => setCaseStudyUrl(e.target.value)}
                placeholder="https://devpost.com/software/..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 45-Second Pitch Script */}
      {activeTab === "pitch" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  45-Second Spoken Elevator Pitch Script
                </label>
                <p className="text-[11px] text-slate-400">
                  First-person spoken script crafted for interviews, hackathon demos, and intro video voiceovers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("pitch_script")}
                disabled={regeneratingSection === "pitch_script"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "pitch_script" ? "animate-spin" : ""}`} />
                <span>Regenerate Pitch</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={pitchScript}
              onChange={(e) => setPitchScript(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>

          <PitchTeleprompter pitchScript={pitchScript} projectTitle={title} />
        </div>
      )}

      {/* Tab 5: Interview Prep Q&A */}
      {activeTab === "interview" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0d1322]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  5 Likely Interview Questions & Talking Points
                </label>
                <p className="text-[11px] text-slate-400">
                  Generated from your real code decisions to help you prepare before recruiter screens.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRegenerateSection("interview_questions")}
                disabled={regeneratingSection === "interview_questions"}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regeneratingSection === "interview_questions" ? "animate-spin" : ""}`} />
                <span>Regenerate Q&A</span>
              </button>
            </div>

            <div className="space-y-4">
              {interviewQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setInterviewQuestions(interviewQuestions.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...interviewQuestions];
                      updated[idx].question = e.target.value;
                      setInterviewQuestions(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <textarea
                    rows={2}
                    value={q.talking_points || ""}
                    placeholder="Talking points & technical answer advice..."
                    onChange={(e) => {
                      const updated = [...interviewQuestions];
                      updated[idx].talking_points = e.target.value;
                      setInterviewQuestions(updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <InterviewPrepAccordion questions={interviewQuestions} />
        </div>
      )}

      {/* Tab 6: Publish & Settings */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0d1322] space-y-6">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Publishing & Visibility
            </h3>

            {/* Public vs Private toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isPublic ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                  {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Public Visibility</h4>
                  <p className="text-[11px] text-slate-400">
                    {isPublic
                      ? "Anyone with the link can view your project story page."
                      : "Only you can view this story while logged in."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isPublic ? "bg-indigo-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    isPublic ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Slug Info */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] uppercase font-mono font-semibold text-slate-400 block mb-1">
                Public Shareable Link
              </span>
              <div className="flex items-center justify-between">
                <code className="text-xs text-indigo-400 font-mono truncate">
                  /p/{project.slug}
                </code>
                <button
                  type="button"
                  onClick={copyPublicLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Save & Publish Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                {saving ? "Saving Changes..." : "Save Draft"}
              </button>

              <button
                onClick={() => handleSave(status === "published" ? "draft" : "published")}
                disabled={saving}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                  status === "published"
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                }`}
              >
                {status === "published" ? "Unpublish Story" : "Publish Story Live"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
