import { AudienceVersion, RepoIngestionData, UserOnboardingAnswers } from "@/types";

export function buildSystemPrompt(audience: AudienceVersion = "recruiter"): string {
  return `You are "RepoFolio", an elite software engineering analyst and codebase documentation engine.
Your mission is to analyze a public GitHub repository's actual code, structure, README, and dependency manifests, and extract an accurate, comprehensive technical breakdown explaining what the project actually does, how its architecture and data flows work (with Mermaid diagrams), its key modules and features, and its engineering decisions.

IMPORTANT PRINCIPLES:
- DO NOT invent fictional stories, marketing hype, or ungrounded narratives.
- Focus strictly on extracting and explaining what the codebase actually does based on repository evidence.
- Maintain a clear, high-signal, professional engineering tone.

STRICT EVIDENCE & ACCURACY RULES:
1. Ground every claim strictly in repository evidence (README, manifests, commit logs, directory structure, language distribution).
2. DO NOT hallucinate features, third-party integrations, or benchmarks not substantiated by the repository.
3. If information is inferred rather than explicitly stated, note it transparently in the "confidence_notes" array.
4. For the "mermaid_diagram", output clean valid Mermaid flowchart syntax (using 'graph TD' or 'flowchart LR'). Do not use special characters or unescaped quotes in node labels.
5. Provide maximum 6 key features based on actual code and documentation.
6. Provide 4 to 6 sequential steps for "how_it_works" describing the actual execution/data flow.
7. Tech stack must explain *why* each technology was chosen based on the repo evidence and dependencies.
8. Output STRICT JSON only. Do not surround with markdown backticks or commentary.`;
}

export function buildUserPrompt(
  repoData: RepoIngestionData,
  audience: AudienceVersion = "recruiter",
  userAnswers?: UserOnboardingAnswers
): string {
  // Extract key dependencies from manifests
  let manifestSummary = "None detected";
  if (repoData.manifests.packageJson) {
    const pkg = repoData.manifests.packageJson;
    const deps = Object.keys((pkg.dependencies as Record<string, string>) || {});
    const devDeps = Object.keys((pkg.devDependencies as Record<string, string>) || {});
    manifestSummary = `package.json dependencies: ${deps.slice(0, 20).join(", ")}; devDependencies: ${devDeps.slice(0, 15).join(", ")}`;
  } else if (repoData.manifests.requirementsTxt) {
    manifestSummary = `Python requirements: ${repoData.manifests.requirementsTxt.replace(/\r?\n/g, ", ")}`;
  } else if (repoData.manifests.cargoToml) {
    manifestSummary = `Cargo.toml snippet: ${repoData.manifests.cargoToml.slice(0, 300)}`;
  } else if (repoData.manifests.goMod) {
    manifestSummary = `go.mod snippet: ${repoData.manifests.goMod.slice(0, 300)}`;
  }

  // Format languages
  const totalBytes = Object.values(repoData.languages).reduce((a, b) => a + b, 0) || 1;
  const langBreakdown = Object.entries(repoData.languages)
    .slice(0, 6)
    .map(([lang, bytes]) => `${lang} (${Math.round((bytes / totalBytes) * 100)}%)`)
    .join(", ");

  // Recent commits
  const commitSummary = repoData.recentCommits
    .slice(0, 5)
    .map((c) => `- "${c.message}" by ${c.author}`)
    .join("\n");

  return `Please analyze this GitHub repository and extract an accurate technical overview, system architecture flow, and engineering breakdown.

REPOSITORY CONTEXT:
- Name: ${repoData.name}
- Owner: ${repoData.owner}
- GitHub URL: ${repoData.url}
- Description: ${repoData.description || "None provided"}
- Topics/Tags: ${repoData.topics.join(", ") || "None"}
- Stars: ${repoData.stars} | Forks: ${repoData.forks} | Open Issues: ${repoData.openIssuesCount}
- Primary Language: ${repoData.primaryLanguage}
- Languages Breakdown: ${langBreakdown || "N/A"}
- Root Directory Structure: ${repoData.rootFiles.join(", ")}
- Dependency Manifests: ${manifestSummary}
- Recent Commits:
${commitSummary || "None"}

README EXCERPT:
${repoData.readme.slice(0, 4500) || "No README available."}

REQUIRED JSON OUTPUT FORMAT:
{
  "title": "Clear, accurate technical project title based on the repository",
  "one_line_pitch": "A crisp, factual one-line technical summary of what this repository does",
  "problem": "Clear explanation of the problem or gap this project addresses based on the README and code (2-3 sentences)",
  "solution": "How this application effectively solves that problem (2-3 sentences)",
  "features": [
    "Bullet point feature 1",
    "Bullet point feature 2",
    "Bullet point feature 3",
    "Bullet point feature 4"
  ],
  "tech_stack": [
    { "name": "Technology Name", "reason": "Specific reason why it was used based on repo context" }
  ],
  "how_it_works": [
    "Step 1: User or trigger action",
    "Step 2: Processing / business logic",
    "Step 3: Storage or external service coordination",
    "Step 4: Delivered output or interactive result"
  ],
  "architecture_summary": "High-level summary of the architectural design, data flow, and components",
  "mermaid_diagram": "graph TD\\n  A[Client Browser] --> B[API Router]\\n  B --> C[Processing Engine]\\n  C --> D[(Database)]",
  "future_improvements": [
    "Planned enhancement 1",
    "Planned enhancement 2"
  ],
  "pitch_script": "A concise 45-second technical spoken walkthrough summarizing the architecture and impact.",
  "interview_questions": [
    {
      "question": "Why did you choose this tech stack architecture?",
      "talking_points": "Key points on architecture decisions and trade-offs"
    },
    {
      "question": "What was the most challenging technical hurdle during development?",
      "talking_points": "Key points on problem solving and resilience"
    },
    {
      "question": "How does the system ensure reliability and error resilience?",
      "talking_points": "Key considerations regarding data integrity and error handling"
    },
    {
      "question": "What would break or need refactoring if traffic scaled 100x?",
      "talking_points": "Bottlenecks, caching, background workers, or database indexing"
    },
    {
      "question": "How do you test and validate that this project works as intended?",
      "talking_points": "Testing strategy and verification mechanisms"
    }
  ],
  "confidence_notes": [
    "Explicitly verified from codebase manifests and README",
    "Inferred UI architecture based on directory conventions"
  ]
}`;
}
