import { AudienceVersion, RepoIngestionData, UserOnboardingAnswers } from "@/types";

export function buildSystemPrompt(audience: AudienceVersion): string {
  const audienceInstructions: Record<AudienceVersion, string> = {
    recruiter: `You are generating a project story for TECH RECRUITERS and ENGINEERING HIRING MANAGERS.
Tone: Professional, high-signal, impact-driven, articulating clear engineering decisions, ownership, architecture trade-offs, and tangible value.
Highlight: Technical stack reasons, scalability considerations, problem-solving depth, and real-world relevance.`,

    client: `You are generating a project story for POTENTIAL CLIENTS and BUSINESS STAKEHOLDERS.
Tone: Value-focused, commercial, outcome-oriented, clean business language.
Highlight: Business problem solved, return on investment, user satisfaction, reliability, and how this software delivers measurable results. Avoid deep code minutiae; focus on capabilities and outcomes.`,

    "non-technical": `You are generating a project story for NON-TECHNICAL VIEWERS (such as family, friends, non-tech founders, or general public).
Tone: Warm, conversational, intuitive, using real-world analogies.
Explain the project as if the viewer has never written a line of code in their life. Never use unexplained jargon (like 'REST API', 'ORM', or 'state machine') without an immediate plain-English explanation.`,

    judge: `You are generating a project story for HACKATHON JUDGES and INNOVATION REVIEWERS.
Tone: Energetic, visionary, crisp, highlighting innovation, technical execution under constraints, demo flow, and high-impact future scope.`,
  };

  return `You are "RepoFolio", an elite AI application architect and portfolio storyteller.
Your mission is to transform a public GitHub repository's raw data into an exceptionally polished, structured project story.

${audienceInstructions[audience] || audienceInstructions.recruiter}

STRICT EVIDENCE & ACCURACY RULES:
1. Ground every claim strictly in repository evidence (README, manifests, commit logs, directory structure, language distribution).
2. DO NOT hallucinate features, third-party integrations, or benchmarks not substantiated by the repository.
3. If information is inferred rather than explicitly stated, note it transparently in the "confidence_notes" array.
4. For the "mermaid_diagram", output clean valid Mermaid flowchart syntax (using 'graph TD' or 'flowchart LR'). Do not use special characters or unescaped quotes in node labels.
5. Provide maximum 6 key features.
6. Provide 4 to 6 sequential steps for "how_it_works".
7. Tech stack must explain *why* each technology was chosen based on the repo evidence.
8. Pitch script must be a concise 45-second spoken pitch (approx 100-130 words).
9. Output STRICT JSON only. Do not surround with markdown backticks or commentary.`;
}

export function buildUserPrompt(
  repoData: RepoIngestionData,
  audience: AudienceVersion,
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

  // Onboarding answers if provided
  let onboardingContext = "";
  if (userAnswers?.problemSolved || userAnswers?.targetAudience || userAnswers?.proudestAchievement) {
    onboardingContext = `
DEVELOPER'S DIRECT INPUT:
- Problem it solves: "${userAnswers.problemSolved || "Not specified"}"
- Target audience / users: "${userAnswers.targetAudience || "Not specified"}"
- Proudest achievement / hardest challenge: "${userAnswers.proudestAchievement || "Not specified"}"
`;
  }

  return `Please analyze this GitHub repository and generate a structured project story targeted for a "${audience}" audience.

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
${onboardingContext}

README EXCERPT:
${repoData.readme.slice(0, 4500) || "No README available."}

REQUIRED JSON OUTPUT FORMAT:
{
  "title": "A catchy, polished project title (e.g. 'RepoFolio — Automated Portfolio Storyteller')",
  "one_line_pitch": "A crisp, memorable one-line value proposition",
  "problem": "Clear explanation of the pain point or gap this project addresses (2-3 sentences)",
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
  "pitch_script": "A 45-second spoken elevator pitch script written in first person for the developer to present at interviews or demo days.",
  "interview_questions": [
    {
      "question": "Why did you choose this tech stack architecture?",
      "talking_points": "Key points the developer should mention in response"
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
