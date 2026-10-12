import { AudienceVersion, GeneratedProjectStory, RepoIngestionData } from "@/types";

export interface DemoProjectDef {
  owner: string;
  repo: string;
  url: string;
  slug: string;
  title: string;
  one_line_pitch: string;
  problem: string;
  solution: string;
  features: string[];
  tech_stack: { name: string; reason: string }[];
  how_it_works: string[];
  architecture_summary: string;
  mermaid_diagram: string;
  future_improvements: string[];
  pitch_script: string;
  interview_questions: { question: string; talking_points?: string }[];
  audience_version: AudienceVersion;
  live_demo_url: string;
  video_url: string;
  external_case_study_url: string;
  status: "published";
  is_public: boolean;
  images: {
    image_url: string;
    caption: string;
    sort_order: number;
  }[];
  raw_github_metadata: RepoIngestionData;
}

export const SAMPLE_PROJECTS: DemoProjectDef[] = [
  {
    owner: "alexrivers",
    repo: "mealmaker-ai",
    url: "https://github.com/alexrivers/mealmaker-ai",
    slug: "alexrivers-mealmaker-ai",
    title: "MealMaker — AI Food Vision & Instant Nutrition Intelligence",
    one_line_pitch: "Snap a photo of any homemade or restaurant dish to instantly extract macros, ingredients, and personalized dietary alerts in under 2 seconds.",
    problem: "Over 80% of health-conscious individuals abandon manual calorie logging within 14 days because estimating portion sizes and manually searching ingredients is tedious, error-prone, and unsustainable.",
    solution: "MealMaker combines multi-modal computer vision with a nutritional vector database to classify dishes, estimate volumetric portions, and output verifiable calorie and macronutrient breakdowns in real time.",
    features: [
      "Zero-Effort Food Recognition: Instant multi-dish detection from single smartphone photos",
      "Volumetric Portion Estimation: Calibrated depth estimation estimating grams and servings",
      "Dynamic Allergy & Diet Alerts: Instant warnings for gluten, dairy, high sodium, and keto targets",
      "Offline Edge Fallback: On-device caching allowing logging even in low-connectivity gym environments",
      "Weekly Metabolic Trends: Interactive analytics tracking protein adherence and micronutrient balance",
    ],
    tech_stack: [
      { name: "Next.js 15 (App Router)", reason: "Server Components for ultra-fast first contentful paint and responsive mobile navigation" },
      { name: "TypeScript", reason: "Guarantees type-safety between the camera feed stream, AI response schemas, and database queries" },
      { name: "Tailwind CSS", reason: "Utility-first rapid prototyping of responsive dark/light nutrition dashboard cards" },
      { name: "Gemini 2.0 Flash Vision", reason: "Sub-second multi-dish image classification and ingredient extraction" },
      { name: "PostgreSQL & Prisma", reason: "Relational persistence of user meals, nutritional history, and personalized dietary constraints" },
    ],
    how_it_works: [
      "1. Camera Capture: User snaps or uploads a meal photo via mobile or desktop web app.",
      "2. Image Preprocessing: Client-side compression optimizes payload to <250KB before uploading.",
      "3. Multi-modal AI Vision: Vision model detects food classes, estimated volume, and cooking styles.",
      "4. Nutrition Validation: Ingested items are matched against verified USDA FoodData Central databases.",
      "5. Interactive Review: User reviews detected dishes, adjusts sliders if desired, and saves to daily diary.",
    ],
    architecture_summary: "A client-first progressive web app communicating with serverless Next.js API endpoints. Food images are pre-processed, passed through a multi-modal LLM vision pipeline, normalized against nutritional databases, and persisted in PostgreSQL.",
    mermaid_diagram: `flowchart TD
  User([User Mobile Camera]) -->|Snap Photo| WebApp[Next.js PWA Client]
  WebApp -->|Preprocessed Image| APIRouter[API Route /api/analyze]
  APIRouter -->|Vision Prompt| VisionAI[Multi-Modal Vision Engine]
  APIRouter -->|USDA Query| USDADb[(Nutrition Knowledge Base)]
  VisionAI -->|Ingredient JSON| APIRouter
  USDADb -->|Calibrated Macros| APIRouter
  APIRouter -->|Persist Meal| DB[(PostgreSQL Database)]
  APIRouter -->|Response Payload| WebApp`,
    future_improvements: [
      "Integration with Apple Health and Google Health Connect for automated burn-rate balancing",
      "Barcode scanning for packaged pantry items to complement fresh food recognition",
      "Real-time video stream continuous food recognition in AR camera glasses",
    ],
    pitch_script: "Hi! I built MealMaker to solve a problem millions of people struggle with: manual calorie counting sucks. With MealMaker, you simply take a photo of your plate, and in under two seconds, our multi-modal vision pipeline detects every dish, estimates portions, and logs precise macros. Built with Next.js, TypeScript, and Gemini Vision, it turns a 5-minute logging chore into an effortless snapshot.",
    interview_questions: [
      {
        question: "How do you handle ambiguous dishes, such as soups or mixed casseroles where ingredients are obscured?",
        talking_points: "Explain heuristic probability scoring, asking user for quick confirmation ('Did this soup contain heavy cream or coconut milk?'), and falling back to average nutritional baselines.",
      },
      {
        question: "How did you optimize image payload sizes for mobile users on cellular networks?",
        talking_points: "Implemented HTML5 Canvas client-side downscaling and WebP compression before network dispatch, reducing payload size by 85%.",
      },
      {
        question: "Why did you choose PostgreSQL with Prisma over a NoSQL document database?",
        talking_points: "Nutritional logs require strict relational constraints between users, days, meals, and food items, with aggregations for historical weekly reporting.",
      },
      {
        question: "What was your strategy for handling third-party AI vision latency or downtime?",
        talking_points: "Implemented exponential backoff retries, optimistic UI loading states with skeleton feedback, and local offline queuing in IndexedDB.",
      },
      {
        question: "If you had 100,000 active concurrent users uploading photos at lunch hour, what architecture changes would you make?",
        talking_points: "Offload AI image processing to an asynchronous Redis / BullMQ message queue, store raw photos in S3/Blob storage, and notify the frontend via WebSockets or Server-Sent Events.",
      },
    ],
    audience_version: "recruiter",
    live_demo_url: "https://mealmaker.vercel.app",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    external_case_study_url: "https://devpost.com/software/mealmaker-ai",
    status: "published",
    is_public: true,
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
        caption: "Healthy meal recognition scanning salmon, asparagus, and quinoa bowl in under 1.8s",
        sort_order: 1,
      },
      {
        image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
        caption: "Interactive macronutrient dashboard breakdown showing daily protein, carb, and healthy fat targets",
        sort_order: 2,
      },
      {
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
        caption: "Portion adjustment view with confidence meters and USDA database verification badges",
        sort_order: 3,
      },
    ],
    raw_github_metadata: {
      owner: "alexrivers",
      repo: "mealmaker-ai",
      url: "https://github.com/alexrivers/mealmaker-ai",
      name: "mealmaker-ai",
      description: "AI-powered food vision and instant nutritional intelligence web application",
      topics: ["nextjs", "computer-vision", "ai", "nutrition", "typescript", "prisma"],
      stars: 342,
      forks: 48,
      openIssuesCount: 3,
      primaryLanguage: "TypeScript",
      createdAt: "2024-03-15T10:00:00Z",
      updatedAt: "2024-10-10T14:30:00Z",
      readme: "# MealMaker AI\n\nAI-powered food recognition and real-time nutrition intelligence.",
      hasMissingOrShortReadme: false,
      languages: { TypeScript: 84500, JavaScript: 12000, CSS: 8400 },
      rootFiles: ["app/", "components/", "lib/", "public/", "package.json", "README.md", "tsconfig.json"],
      manifests: {
        packageJson: {
          dependencies: {
            next: "^15.0.0",
            react: "^19.0.0",
            tailwindcss: "^4.0.0",
            "@prisma/client": "^6.0.0",
            "@google/genai": "^2.0.0",
          },
        },
      },
      recentCommits: [
        { message: "feat: add volumetric portion estimation slider", date: "2024-10-10", author: "Alex Rivers" },
        { message: "perf: optimize client-side image compression before upload", date: "2024-10-08", author: "Alex Rivers" },
        { message: "fix: handle edge case with unrecognized multi-soup bowls", date: "2024-10-05", author: "Alex Rivers" },
      ],
      contributors: [
        { login: "alexrivers", avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4", contributions: 89, html_url: "https://github.com/alexrivers" },
      ],
    },
  },
  {
    owner: "alexrivers",
    repo: "gitpulse-metrics",
    url: "https://github.com/alexrivers/gitpulse-metrics",
    slug: "alexrivers-gitpulse-metrics",
    title: "GitPulse — Real-Time Engineering Velocity & Pull Request Flow Intelligence",
    one_line_pitch: "Uncover engineering bottlenecks, PR review lag, and merge velocity metrics without intrusive surveillance.",
    problem: "Software teams often suffer from prolonged PR turnaround times and deployment gridlocks, yet traditional manager dashboards feel punitive and focus on flawed vanity metrics like raw commit counts.",
    solution: "GitPulse connects with GitHub organization webhooks to surface constructive cycle-time insights, highlighting review queues, review debt, and CI failure patterns to help teams ship faster collaboratively.",
    features: [
      "Review Turnaround Heatmaps: Pinpoint what times of week pull requests wait longest for feedback",
      "CI Flakiness Diagnostic: Automated detection of test suites that cause flaky PR blockages",
      "PR Size vs Merge Time Analysis: Actionable guidance encouraging atomic pull requests",
      "Developer Privacy First: No individual ranking or stack-ranking; aggregates team-wide workflow health",
      "Slack Digest Bot: Daily 9:00 AM summary of stale PRs needing constructive peer reviews",
    ],
    tech_stack: [
      { name: "TypeScript & Node.js", reason: "Asynchronous I/O handling high-throughput GitHub webhook payloads" },
      { name: "FastAPI / Python", reason: "High-performance statistical analysis and rolling percentile calculations" },
      { name: "Redis", reason: "Real-time rate-limiting and temporary webhook event deduplication" },
      { name: "PostgreSQL", reason: "Robust relational storage of repository events, review timestamps, and metrics" },
      { name: "Tremor & Tailwind CSS", reason: "Minimalist executive charts and engineering health dashboards" },
    ],
    how_it_works: [
      "1. Webhook Ingestion: GitHub sends signed webhook payloads on pull_request and review events.",
      "2. Signature Verification: Secure HMAC-SHA256 verification confirms payload authenticity.",
      "3. Time Differential Engine: Computes exact lead times: open -> first review -> approved -> merged.",
      "4. Statistical Normalization: Filters out bots (e.g. Dependabot, Renovate) and weekend delays.",
      "5. Dashboard Presentation: Renders interactive charts showing 30-day moving averages and trends.",
    ],
    architecture_summary: "Event-driven architecture ingesting GitHub webhooks via edge routes, buffering them through Redis, computing lead times via asynchronous worker routines, and serving metrics via Next.js dashboards.",
    mermaid_diagram: `flowchart TD
  GitHub[GitHub Webhook Events] -->|HMAC Verified POST| Ingest[API Ingestion Layer]
  Ingest -->|Queue Event| RedisQ[(Redis Stream)]
  RedisQ --> Worker[Metrics Processor Worker]
  Worker -->|Compute Cycle Time| DB[(PostgreSQL Store)]
  Worker -->|Notify Stale PRs| SlackBot[Slack Bot Webhook]
  User([Engineering Lead]) -->|View Trends| Dash[Next.js Dashboard]
  Dash -->|Query Analytics| DB`,
    future_improvements: [
      "GitLab and Bitbucket webhook compatibility for hybrid enterprise codebases",
      "AI-driven automated code reviewer recommendation based on past file blame history",
      "DORA metrics out-of-the-box certification export for quarterly executive reviews",
    ],
    pitch_script: "GitPulse was born out of frustration with toxic engineering dashboards. Instead of tracking meaningless commit counts, GitPulse measures workflow friction—like pull requests waiting 4 days for a 2-line approval. By providing clear cycle time insights and gentle Slack reminders, teams cut review lag by 40% within their first two sprints.",
    interview_questions: [
      {
        question: "How do you guarantee security when accepting webhooks from external GitHub servers?",
        talking_points: "Discuss verifying the X-Hub-Signature-256 header using a shared secret and crypto.createHmac, plus replay protection using timestamp checks.",
      },
      {
        question: "How do you handle bursts of hundreds of webhooks during a massive mono-repo release?",
        talking_points: "Decouple ingestion from processing: respond with HTTP 202 immediately after writing to Redis, and let worker consumers process jobs idempotently.",
      },
      {
        question: "How do you account for weekends and holidays in cycle time calculations?",
        talking_points: "Implemented custom business-hours calculation logic that subtracts weekend hours and configurable team holiday schedules from raw timestamps.",
      },
      {
        question: "What index optimizations did you implement in Postgres for high-volume event queries?",
        talking_points: "Created composite indexes on (repository_id, created_at) and partial indexes on unmerged open PRs to keep dashboard queries under 15ms.",
      },
      {
        question: "How did you design the user experience to keep the tool constructive rather than punitive?",
        talking_points: "Deliberately omit individual developer scorecards; all metrics are aggregated at the squad or repository level to foster psychological safety.",
      },
    ],
    audience_version: "recruiter",
    live_demo_url: "https://gitpulse.dev",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    external_case_study_url: "https://alexrivers.hashnode.dev/gitpulse-architecture",
    status: "published",
    is_public: true,
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Engineering velocity overview showing 30-day PR cycle time moving average",
        sort_order: 1,
      },
      {
        image_url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
        caption: "Heatmap visualization identifying peak review queue backlog hours on Wednesday afternoons",
        sort_order: 2,
      },
    ],
    raw_github_metadata: {
      owner: "alexrivers",
      repo: "gitpulse-metrics",
      url: "https://github.com/alexrivers/gitpulse-metrics",
      name: "gitpulse-metrics",
      description: "Real-time engineering cycle time and PR velocity intelligence platform",
      topics: ["developer-tools", "github-api", "analytics", "typescript", "postgres"],
      stars: 512,
      forks: 67,
      openIssuesCount: 5,
      primaryLanguage: "TypeScript",
      createdAt: "2024-01-20T08:00:00Z",
      updatedAt: "2024-10-11T12:00:00Z",
      readme: "# GitPulse\n\nActionable PR cycle time insights for high-performing engineering squads.",
      hasMissingOrShortReadme: false,
      languages: { TypeScript: 112000, Python: 34000, SQL: 12000 },
      rootFiles: ["src/", "workers/", "dashboard/", "docker-compose.yml", "package.json", "README.md"],
      manifests: {
        packageJson: {
          dependencies: {
            "@octokit/rest": "^20.0.0",
            ioredis: "^5.3.0",
            pg: "^8.11.0",
            zod: "^3.22.0",
          },
        },
      },
      recentCommits: [
        { message: "feat: add business hours exclusion filter for weekend PRs", date: "2024-10-11", author: "Alex Rivers" },
        { message: "perf: add composite index on repo_events(repo_id, timestamp)", date: "2024-10-09", author: "Alex Rivers" },
      ],
      contributors: [
        { login: "alexrivers", avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4", contributions: 124, html_url: "https://github.com/alexrivers" },
      ],
    },
  },
  {
    owner: "alexrivers",
    repo: "cloudshield-sec",
    url: "https://github.com/alexrivers/cloudshield-sec",
    slug: "alexrivers-cloudshield-sec",
    title: "CloudShield — Zero-Trust Cloud Infrastructure & Terraform Drift Guard",
    one_line_pitch: "Continuous security policy enforcement that catches S3 leaks, open security groups, and IAM privilege creep before deployment.",
    problem: "Over 75% of cloud security breaches originate from simple misconfigurations like public storage buckets or wildcard IAM permissions introduced inadvertently in Terraform PRs.",
    solution: "CloudShield parses infrastructure-as-code files during GitHub Actions runs, enforcing Open Policy Agent rules and blocking non-compliant changes before cloud resources are provisioned.",
    features: [
      "Static Terraform AST Parsing: Evaluates HCL syntax trees without needing live AWS credentials",
      "OPA Policy Engine: Over 120 pre-built CIS Benchmark and SOC-2 compliance check rules",
      "Automated PR Annotations: Pins clear remediation code diffs directly on offending lines",
      "Drift Detection Daemon: Periodically checks live cloud state against committed Terraform files",
      "Exportable Executive Audit Logs: One-click PDF/CSV reports for external compliance auditors",
    ],
    tech_stack: [
      { name: "Go & Rust", reason: "Blazing fast CLI execution scanning 10,000 Terraform resources in under 400 milliseconds" },
      { name: "Open Policy Agent (Rego)", reason: "Declarative policy language decoupling compliance rules from scanner logic" },
      { name: "GitHub Actions", reason: "Zero-friction CI/CD pipeline blocking pull requests with critical vulnerabilities" },
      { name: "Next.js & Tailwind CSS", reason: "Clean security dashboard displaying compliance score trends and open remediations" },
    ],
    how_it_works: [
      "1. Git Push / PR Trigger: A developer opens a pull request containing Terraform changes.",
      "2. HCL Syntax Tree Parsing: CloudShield's binary parses .tf files into a normalized JSON AST.",
      "3. Policy Evaluation: The OPA Rego engine verifies resource parameters against security baselines.",
      "4. Pull Request Commenting: If violations exist, precise suggested diffs are posted via GitHub API.",
      "5. Security Gate: Blocks PR merge if severity is critical, ensuring zero-trust guardrails.",
    ],
    architecture_summary: "High-performance Go CLI runner embedded in CI/CD pipelines, sending violation telemetry to a centralized Next.js compliance web platform.",
    mermaid_diagram: `flowchart TD
  Dev[Developer Git Push] --> CI[GitHub Actions Workflow]
  CI --> Scanner[CloudShield Go/Rust Binary]
  Scanner -->|Evaluate HCL AST| OPA[OPA Rego Compliance Engine]
  OPA -->|Violations Found| CI
  CI -->|Post Line Annotations| PR[Pull Request Review]
  Scanner -->|Telemetry Event| API[CloudShield Telemetry API]
  API --> CentralDB[(Compliance Database)]
  SecLead([Security Lead]) --> Dash[Security Dashboard UI]`,
    future_improvements: [
      "Auto-generating pull requests that automatically fix simple misconfigurations (e.g. enabling encryption)",
      "Support for Kubernetes Helm charts and Dockerfile vulnerability linting",
      "Slack incident paging for urgent unapproved production drift",
    ],
    pitch_script: "CloudShield prevents costly cloud data breaches before code ever reaches production. By embedding an ultra-fast OPA policy scanner directly into pull requests, developers get immediate, constructive guidance like 'enable SSE-KMS on this S3 bucket' before merging. It bridges the gap between fast engineering and strict enterprise security.",
    interview_questions: [
      {
        question: "Why did you implement the scanner binary in Go rather than TypeScript or Python?",
        talking_points: "CI runners need near-zero startup time and small binary footprints; Go compiles to a standalone 15MB binary that executes in 300ms without Node or Python runtime installations.",
      },
      {
        question: "How do you write Open Policy Agent (Rego) rules that don't produce false positives?",
        talking_points: "Explain scoping rules to specific resource types, checking for explicit exception tags (e.g. 'override_approved_by'), and structuring rules with unit tests.",
      },
      {
        question: "How do you prevent the security check from slowing down the developer's pull request workflow?",
        talking_points: "Parse only modified Terraform files on pull requests rather than scanning the entire repository, keeping execution times under 1 second.",
      },
      {
        question: "What happens if a developer introduces a new module that the parser hasn't seen before?",
        talking_points: "The parser extracts variable definitions and module outputs recursively, with safe fallbacks flagging uninspected third-party modules as informational warnings.",
      },
      {
        question: "How does CloudShield maintain compliance with evolving standards like SOC-2 or ISO 27001?",
        talking_points: "Decouple rule sets into versioned policy packs that update independently of the scanner engine, allowing seamless compliance baseline updates.",
      },
    ],
    audience_version: "recruiter",
    live_demo_url: "https://cloudshield-sec.dev",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    external_case_study_url: "https://github.com/alexrivers/cloudshield-sec",
    status: "published",
    is_public: true,
    images: [
      {
        image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        caption: "Real-time cloud compliance score tracking SOC-2 and CIS benchmark posture",
        sort_order: 1,
      },
      {
        image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        caption: "Automated PR annotation showing suggested fix for unencrypted AWS S3 bucket",
        sort_order: 2,
      },
    ],
    raw_github_metadata: {
      owner: "alexrivers",
      repo: "cloudshield-sec",
      url: "https://github.com/alexrivers/cloudshield-sec",
      name: "cloudshield-sec",
      description: "Continuous zero-trust cloud infrastructure and Terraform security drift guard",
      topics: ["security", "terraform", "devsecops", "opa", "golang", "cloud"],
      stars: 840,
      forks: 112,
      openIssuesCount: 4,
      primaryLanguage: "Go",
      createdAt: "2024-02-10T12:00:00Z",
      updatedAt: "2024-10-10T16:00:00Z",
      readme: "# CloudShield\n\nZero-trust Terraform policy scanner blocking cloud misconfigurations in CI/CD.",
      hasMissingOrShortReadme: false,
      languages: { Go: 145000, TypeScript: 28000, Rego: 18000 },
      rootFiles: ["cmd/", "pkg/", "policies/", "dashboard/", "Makefile", "README.md"],
      manifests: {
        goMod: "module github.com/alexrivers/cloudshield\n\ngo 1.22\n\nrequire github.com/open-policy-agent/opa v0.60.0",
      },
      recentCommits: [
        { message: "feat: add SOC-2 AWS KMS customer-managed key enforcement rule", date: "2024-10-10", author: "Alex Rivers" },
        { message: "perf: cache OPA compiled policy modules across PR runs", date: "2024-10-06", author: "Alex Rivers" },
      ],
      contributors: [
        { login: "alexrivers", avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4", contributions: 178, html_url: "https://github.com/alexrivers" },
      ],
    },
  },
];
