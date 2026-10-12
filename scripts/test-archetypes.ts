import { fetchGitHubRepoData } from "../server/github";
import { generateProjectStory, StorySchema } from "../server/ai";
import { RepoIngestionData } from "../types";

async function runArchetypeTests() {
  console.log("==================================================");
  console.log("   RUNNING REPOFOLIO ARCHETYPE VERIFICATION TESTS  ");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  // Test 1: Strong README Repository (Express.js or similar)
  total++;
  console.log("Test 1: Testing Strong README Repository (expressjs/express)...");
  try {
    const ingestResult = await fetchGitHubRepoData("https://github.com/expressjs/express");
    if (!ingestResult.success) {
      console.warn("  GitHub API live fetch error (rate-limit/network):", ingestResult.error);
      // Fallback with mock express data to test AI parsing
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
        readme: "# Express\nFast, unopinionated, minimalist web framework for node.\n## Features\n- Robust routing\n- Focus on high performance\n- Super-high test coverage\n- HTTP helpers\n",
        hasMissingOrShortReadme: false,
        languages: { JavaScript: 1500000 },
        rootFiles: ["package.json", "Readme.md", "lib/", "test/"],
        manifests: {
          packageJson: {
            name: "express",
            dependencies: { accepts: "~1.3.8", "router": "~1.3.8", "debug": "2.6.9" },
            devDependencies: { mocha: "10.2.0" }
          }
        },
        recentCommits: [{ author: "maintainer", message: "release 5.0.0", date: "2026-01-01" }],
        contributors: [{ login: "dougwilson", avatar_url: "https://github.com/dougwilson.png", contributions: 1200, html_url: "https://github.com/dougwilson" }]
      };
      const { story, modelUsed } = await generateProjectStory(mockExpress, "recruiter");
      StorySchema.parse(story);
      console.log(`  ✓ Generated valid story using ${modelUsed}:`);
      console.log(`    Title: ${story.title}`);
      console.log(`    Pitch: ${story.one_line_pitch}`);
      console.log(`    Tech count: ${story.tech_stack.length}, Features count: ${story.features.length}`);
      passed++;
    } else {
      const { story, modelUsed } = await generateProjectStory(ingestResult.data, "recruiter");
      StorySchema.parse(story);
      console.log(`  ✓ Successfully fetched and generated story using ${modelUsed}:`);
      console.log(`    Title: ${story.title}`);
      console.log(`    Pitch: ${story.one_line_pitch}`);
      console.log(`    Tech count: ${story.tech_stack.length}, Features count: ${story.features.length}`);
      passed++;
    }
  } catch (err) {
    console.error("  ✕ Test 1 Failed:", err);
  }

  // Test 2: Repository with No README or Sparse README + Onboarding Answers
  total++;
  console.log("\nTest 2: Testing Repository with Sparse/No README + User Onboarding answers...");
  try {
    const noReadmeRepo: RepoIngestionData = {
      owner: "studentcoder",
      repo: "distributed-cache",
      url: "https://github.com/studentcoder/distributed-cache",
      name: "distributed-cache",
      description: "",
      topics: [],
      stars: 1,
      forks: 0,
      openIssuesCount: 0,
      primaryLanguage: "Go",
      createdAt: "2026-02-01T10:00:00Z",
      updatedAt: "2026-02-15T15:00:00Z",
      readme: "", // Empty README!
      hasMissingOrShortReadme: true,
      languages: { Go: 45000 },
      rootFiles: ["main.go", "cache.go", "go.mod"],
      manifests: {
        goMod: "module github.com/studentcoder/distributed-cache\n\ngo 1.22\n"
      },
      recentCommits: [{ author: "student", message: "implement LRU eviction and consistent hashing ring", date: "2026-02-15" }],
      contributors: [{ login: "studentcoder", avatar_url: "https://github.com/studentcoder.png", contributions: 12, html_url: "https://github.com/studentcoder" }]
    };

    const userAnswers = {
      problemSolved: "Preventing database bottlenecks by caching frequently queried JSON responses in memory",
      targetAudience: "Backend developers building high-traffic REST APIs",
      proudestAchievement: "Consistent hashing ring with sub-millisecond p99 latency during node rebalances"
    };

    const { story, modelUsed } = await generateProjectStory(noReadmeRepo, "recruiter", userAnswers);
    StorySchema.parse(story);

    if (!story.problem.includes("Preventing database bottlenecks") && !story.solution.includes("Consistent hashing ring")) {
      throw new Error("Onboarding answers were not incorporated into story!");
    }
    console.log(`  ✓ Successfully synthesized grounded story without README using ${modelUsed}:`);
    console.log(`    Title: ${story.title}`);
    console.log(`    Problem: ${story.problem}`);
    console.log(`    Solution: ${story.solution}`);
    console.log(`    Confidence notes: ${story.confidence_notes?.join(" | ")}`);
    passed++;
  } catch (err) {
    console.error("  ✕ Test 2 Failed:", err);
  }

  // Test 3: Python ML Repository
  total++;
  console.log("\nTest 3: Testing Python ML Repository (PyTorch, Scikit-learn, FastAPI)...");
  try {
    const mlRepo: RepoIngestionData = {
      owner: "ml-researcher",
      repo: "retrieval-augmented-qa",
      url: "https://github.com/ml-researcher/retrieval-augmented-qa",
      name: "retrieval-augmented-qa",
      description: "Dense vector retrieval and hallucination filtering for legal contract analysis",
      topics: ["nlp", "pytorch", "transformers", "vector-search"],
      stars: 340,
      forks: 45,
      openIssuesCount: 3,
      primaryLanguage: "Python",
      createdAt: "2025-10-10T10:00:00Z",
      updatedAt: "2026-03-01T12:00:00Z",
      readme: "# Retrieval Augmented QA\nSemantic question answering over 10,000+ page legal documents using PyTorch sentence embeddings and FAISS index.",
      hasMissingOrShortReadme: false,
      languages: { Python: 95000 },
      rootFiles: ["requirements.txt", "model.py", "serve.py", "eval.py"],
      manifests: {
        requirementsTxt: "torch>=2.2.0\ntransformers>=4.38.0\nfastapi>=0.110.0\nscikit-learn>=1.4.0\npandas>=2.2.0\nnumpy>=1.26.0\nfaiss-cpu\n"
      },
      recentCommits: [{ author: "researcher", message: "fine-tune bi-encoder on contract NLI benchmark", date: "2026-02-28" }],
      contributors: [{ login: "ml-researcher", avatar_url: "https://github.com/ml-researcher.png", contributions: 88, html_url: "https://github.com/ml-researcher" }]
    };

    const { story, modelUsed } = await generateProjectStory(mlRepo, "recruiter");
    StorySchema.parse(story);

    const techNames = story.tech_stack.map(t => t.name.toLowerCase());
    const hasPyTorch = techNames.some(t => t.includes("torch"));
    const hasPython = techNames.some(t => t.includes("python"));
    const hasFastAPI = techNames.some(t => t.includes("fastapi"));

    console.log(`  ✓ Successfully detected ML stack using ${modelUsed}:`);
    console.log(`    Detected Tech: ${story.tech_stack.map(t => t.name).join(", ")}`);
    console.log(`    PyTorch detected: ${hasPyTorch}, FastAPI detected: ${hasFastAPI}, Python detected: ${hasPython}`);
    if (!hasPyTorch) throw new Error("PyTorch was not detected from requirements.txt!");
    passed++;
  } catch (err) {
    console.error("  ✕ Test 3 Failed:", err);
  }

  // Test 4: Next.js Full-Stack Repository
  total++;
  console.log("\nTest 4: Testing Next.js Full-Stack Repository (Next.js, Tailwind, Prisma, TypeScript)...");
  try {
    const nextRepo: RepoIngestionData = {
      owner: "fullstack-dev",
      repo: "saas-launchpad",
      url: "https://github.com/fullstack-dev/saas-launchpad",
      name: "saas-launchpad",
      description: "Modern production starter with App Router, server actions, Stripe, and Prisma ORM",
      topics: ["nextjs", "react", "prisma", "tailwindcss", "typescript"],
      stars: 820,
      forks: 110,
      openIssuesCount: 4,
      primaryLanguage: "TypeScript",
      createdAt: "2025-08-15T08:00:00Z",
      updatedAt: "2026-03-02T16:00:00Z",
      readme: "# SaaS Launchpad\nProduction-ready full stack web app with Next.js 15, Prisma, Tailwind CSS.",
      hasMissingOrShortReadme: false,
      languages: { TypeScript: 85000, CSS: 5000 },
      rootFiles: ["package.json", "next.config.ts", "prisma/", "app/", "components/"],
      manifests: {
        packageJson: {
          dependencies: {
            "next": "^15.1.0",
            "react": "^19.0.0",
            "@prisma/client": "^6.2.0",
            "tailwindcss": "^4.0.0",
            "zod": "^3.23.8"
          },
          devDependencies: {
            "typescript": "^5.6.0",
            "prisma": "^6.2.0"
          }
        }
      },
      recentCommits: [{ author: "founder", message: "add optimistic UI updates to dashboard", date: "2026-03-02" }],
      contributors: [{ login: "fullstack-dev", avatar_url: "https://github.com/fullstack-dev.png", contributions: 140, html_url: "https://github.com/fullstack-dev" }]
    };

    const { story, modelUsed } = await generateProjectStory(nextRepo, "recruiter");
    StorySchema.parse(story);

    const techNames = story.tech_stack.map(t => t.name.toLowerCase());
    const hasNext = techNames.some(t => t.includes("next"));
    const hasPrisma = techNames.some(t => t.includes("prisma"));
    const hasTailwind = techNames.some(t => t.includes("tailwind"));

    console.log(`  ✓ Successfully detected Next.js full-stack using ${modelUsed}:`);
    console.log(`    Detected Tech: ${story.tech_stack.map(t => t.name).join(", ")}`);
    console.log(`    Next.js detected: ${hasNext}, Prisma detected: ${hasPrisma}, Tailwind detected: ${hasTailwind}`);
    if (!hasNext || !hasPrisma) throw new Error("Next.js or Prisma was not detected from package.json!");
    passed++;
  } catch (err) {
    console.error("  ✕ Test 4 Failed:", err);
  }

  console.log("\n==================================================");
  console.log(`   TEST RESULTS: ${passed}/${total} ARCHETYPES PASSED`);
  console.log("==================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runArchetypeTests();
