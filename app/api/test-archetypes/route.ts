import { NextResponse } from "next/server";
import { fetchGitHubRepoData } from "@/server/github";
import { generateProjectStory, StorySchema } from "@/server/ai";
import { RepoIngestionData } from "@/types";

export async function GET() {
  const results: { name: string; success: boolean; details?: unknown; error?: string }[] = [];

  // Archetype 1: Strong README
  try {
    const mockExpress: RepoIngestionData = {
      owner: "expressjs",
      repo: "express",
      url: "https://github.com/expressjs/express",
      name: "express",
      description: "Fast, unopinionated, minimalist web framework for Node.js",
      topics: ["node", "express", "framework", "web"],
      stars: 65000,
      forks: 12000,
      openIssuesCount: 150,
      primaryLanguage: "JavaScript",
      createdAt: "2010-12-29T19:38:25Z",
      updatedAt: "2026-03-01T12:00:00Z",
      readme: "# Express\nFast, unopinionated, minimalist web framework for node.\n## Features\n- Robust routing\n- High performance",
      hasMissingOrShortReadme: false,
      languages: { JavaScript: 1500000 },
      rootFiles: ["package.json", "Readme.md", "lib/"],
      manifests: {
        packageJson: {
          dependencies: { express: "4.19.0", accepts: "1.3.8" }
        }
      },
      recentCommits: [],
      contributors: []
    };
    const { story, modelUsed } = await generateProjectStory(mockExpress, "recruiter");
    StorySchema.parse(story);
    results.push({ name: "Archetype 1: Strong README", success: true, details: { title: story.title, modelUsed } });
  } catch (err: unknown) {
    results.push({ name: "Archetype 1: Strong README", success: false, error: String(err) });
  }

  // Archetype 2: Missing/Sparse README with Onboarding Answers
  try {
    const mockSparse: RepoIngestionData = {
      owner: "student",
      repo: "kv-store",
      url: "https://github.com/student/kv-store",
      name: "kv-store",
      description: "",
      topics: [],
      stars: 1,
      forks: 0,
      openIssuesCount: 0,
      primaryLanguage: "Go",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
      readme: "",
      hasMissingOrShortReadme: true,
      languages: { Go: 25000 },
      rootFiles: ["main.go", "go.mod"],
      manifests: { goMod: "module kv-store\ngo 1.22" },
      recentCommits: [],
      contributors: []
    };
    const { story, modelUsed } = await generateProjectStory(mockSparse, "recruiter", {
      problemSolved: "Eliminating 500ms database roundtrips for session tokens",
      proudestAchievement: "Zero-allocation in-memory sync.Map with concurrent TTL eviction"
    });
    StorySchema.parse(story);
    const hasProblemHint = story.problem.includes("500ms database roundtrips");
    results.push({
      name: "Archetype 2: Sparse/No README + User Hints",
      success: hasProblemHint,
      details: { title: story.title, problem: story.problem, modelUsed }
    });
  } catch (err: unknown) {
    results.push({ name: "Archetype 2: Sparse/No README", success: false, error: String(err) });
  }

  // Archetype 3: Python ML
  try {
    const mockML: RepoIngestionData = {
      owner: "mlteam",
      repo: "vision-classifier",
      url: "https://github.com/mlteam/vision-classifier",
      name: "vision-classifier",
      description: "Convolutional neural network for medical scan classification",
      topics: ["pytorch", "computer-vision"],
      stars: 120,
      forks: 15,
      openIssuesCount: 2,
      primaryLanguage: "Python",
      createdAt: "2025-05-01T00:00:00Z",
      updatedAt: "2026-02-01T00:00:00Z",
      readme: "# Vision Classifier\nPyTorch pipeline for medical imaging.",
      hasMissingOrShortReadme: false,
      languages: { Python: 80000 },
      rootFiles: ["requirements.txt", "train.py"],
      manifests: { requirementsTxt: "torch>=2.2.0\ntorchvision\nscikit-learn\nfastapi" },
      recentCommits: [],
      contributors: []
    };
    const { story, modelUsed } = await generateProjectStory(mockML, "recruiter");
    StorySchema.parse(story);
    const hasPyTorch = story.tech_stack.some(t => t.name.toLowerCase().includes("torch"));
    results.push({
      name: "Archetype 3: Python ML (PyTorch/Scikit)",
      success: hasPyTorch,
      details: { detectedTech: story.tech_stack.map(t => t.name), modelUsed }
    });
  } catch (err: unknown) {
    results.push({ name: "Archetype 3: Python ML", success: false, error: String(err) });
  }

  // Archetype 4: Next.js Full-Stack
  try {
    const mockNext: RepoIngestionData = {
      owner: "webdev",
      repo: "portal-app",
      url: "https://github.com/webdev/portal-app",
      name: "portal-app",
      description: "Enterprise client portal",
      topics: ["nextjs", "react"],
      stars: 450,
      forks: 30,
      openIssuesCount: 1,
      primaryLanguage: "TypeScript",
      createdAt: "2025-09-01T00:00:00Z",
      updatedAt: "2026-03-01T00:00:00Z",
      readme: "# Portal App\nNext.js fullstack application.",
      hasMissingOrShortReadme: false,
      languages: { TypeScript: 60000 },
      rootFiles: ["package.json", "next.config.ts"],
      manifests: {
        packageJson: {
          dependencies: { next: "15.0.0", "@prisma/client": "6.0.0", tailwindcss: "4.0.0" }
        }
      },
      recentCommits: [],
      contributors: []
    };
    const { story, modelUsed } = await generateProjectStory(mockNext, "recruiter");
    StorySchema.parse(story);
    const hasNext = story.tech_stack.some(t => t.name.toLowerCase().includes("next"));
    results.push({
      name: "Archetype 4: Next.js Full-Stack",
      success: hasNext,
      details: { detectedTech: story.tech_stack.map(t => t.name), modelUsed }
    });
  } catch (err: unknown) {
    results.push({ name: "Archetype 4: Next.js Full-Stack", success: false, error: String(err) });
  }

  const allPassed = results.every(r => r.success);
  return NextResponse.json({ success: allPassed, results });
}
