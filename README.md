# RepoFolio 🚀

> **Turn your GitHub repository into a project story that recruiters, clients, and judges can actually understand.**

RepoFolio turns raw GitHub repositories into beautiful, audience-specific, non-technical project story pages with verified proof of work, interactive Mermaid architecture diagrams, 45-second spoken elevator pitch scripts, and 5 likely technical interview questions.

---

## 🌟 Why RepoFolio?

Most GitHub repositories read like code documentation for developers. Recruiters, clients, and hackathon judges don't read commit messages or parse folders of source code. 

**RepoFolio bridges the gap:**
- **Recruiter Lens**: Highlights engineering trade-offs, scalability considerations, ownership, and tech stack decisions.
- **Client Lens**: Focuses on business problems solved, outcome metrics, and return on investment without code jargon.
- **Non-Technical Lens**: Explains the application using intuitive real-world metaphors that anyone can understand.
- **Hackathon Judge Lens**: Emphasizes novel technical execution under constraints, live demo flow, and future roadmap.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom dark mode design system, glassmorphism, and radial glowing accents
- **Database & ORM**: PostgreSQL / SQLite with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) with GitHub OAuth, Google OAuth, and 1-Click Guest/Demo Access
- **GitHub Ingestion**: GitHub REST API (Octokit & native fetch with rate-limit and missing README resilience)
- **AI Story Engine**: Multi-provider abstraction supporting Google Gemini (`gemini-2.0-flash`), OpenAI (`gpt-4o-mini`), and an internal heuristic grounding engine
- **Diagrams**: Interactive Mermaid.js flowcharts with live syntax editing, zoom/pan controls, and fallback rendering
- **Proof of Work**: Multi-image screenshot uploader with lightbox zoom, YouTube/Loom video embed, and live demo verification
- **Validation**: Strict schema verification with Zod

---

## 📁 Project Structure

```
d:/GITT/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth GitHub, Google & Guest login handlers
│   │   ├── projects/route.ts            # POST (Ingest GitHub repo + AI story), GET (list)
│   │   ├── projects/[id]/route.ts       # GET (single), PATCH (update), DELETE
│   │   ├── projects/[id]/generate/      # POST (regenerate story or section for audience)
│   │   ├── projects/[id]/images/        # POST (upload screenshot), DELETE
│   │   ├── public/projects/[slug]/      # GET (public page data with privacy enforcement)
│   │   └── seed/route.ts                # POST (auto-seed demo projects)
│   ├── dashboard/
│   │   ├── page.tsx                     # Dashboard: projects list, metrics, status badges
│   │   └── project/[id]/page.tsx        # Project Story Editor: full section editing & controls
│   ├── p/[slug]/
│   │   └── page.tsx                     # Shareable public story page with OG metadata
│   ├── globals.css                      # Modern dark theme, glassmorphism, and glow tokens
│   ├── layout.tsx                       # Root layout with fonts, metadata, Navbar, Footer
│   └── page.tsx                         # Landing page with interactive hero, demo preview, FAQ
├── components/
│   ├── AudienceSelector.tsx             # Audience version switcher (Recruiter/Client/Non-Tech/Judge)
│   ├── Footer.tsx                       # Footer with links and branding
│   ├── Icons.tsx                        # Brand SVG icons for GitHub and Google
│   ├── InterviewPrepAccordion.tsx       # 5 technical interview questions with talking points
│   ├── MermaidChart.tsx                 # Client-side dynamic Mermaid diagram with zoom & syntax code
│   ├── Navbar.tsx                       # Header with project trigger, user menu & auth modal
│   ├── PitchTeleprompter.tsx            # 45-second elevator pitch teleprompter with timer & audio
│   ├── ProjectCard.tsx                  # Dashboard project item with status and actions
│   ├── RepoIngestModal.tsx              # URL input modal with live step tracker & onboarding hints
│   ├── ScreenshotUploader.tsx           # Multi-screenshot uploader with lightbox modal
│   └── SessionProviderWrapper.tsx       # NextAuth client session provider
├── lib/
│   ├── auth.ts                          # NextAuth options and database user sync
│   ├── db.ts                            # PrismaClient singleton with global hot-reload cache
│   ├── demo-data.ts                     # 3 pre-seeded full-stack sample projects
│   └── utils.ts                         # Class mergers, slug generators, URL parsers
├── prisma/
│   └── schema.prisma                    # Database schema: users, projects, images, generation_jobs
├── scripts/
│   └── seed.js                          # Standalone demo data seeder script
├── server/
│   ├── ai.ts                            # AI generation service with Gemini, OpenAI & fallback
│   ├── github.ts                        # GitHub REST API ingestion & manifest parser
│   └── prompt.ts                        # Grounded persona prompts with strict JSON schema
├── types/
│   └── index.ts                         # Complete TypeScript interfaces
├── .env.example                         # Environment configuration template
└── README.md                            # Comprehensive setup & architecture documentation
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (developed and verified on Node.js v22.20)
- **npm** or **pnpm**

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key variables:
```env
# Database (defaults to SQLite dev.db for zero-configuration local runs)
DATABASE_URL="file:./dev.db"

# NextAuth Secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="repofolio-super-secret-key-32-chars-long"

# OAuth Providers (Optional in Demo Mode; required for production OAuth)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub API Personal Access Token (Optional: increases rate limits from 60/hr to 5,000/hr)
GITHUB_TOKEN=""

# AI Provider ("gemini", "openai", or auto fallback)
AI_PROVIDER="gemini"
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

### 3. Database Initialization & Seeding
Push the schema to SQLite and seed with 3 production-grade sample projects:
```bash
# Push database schema
npx prisma db push

# Seed 3 rich sample projects (MealMaker AI, GitPulse, CloudShield)
node scripts/seed.js
```

### 4. Running the Application
Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verifying Key MVP Flows

1. **Explore Pre-Seeded Projects**:
   - Visit [http://localhost:3000/p/alexrivers-mealmaker-ai](http://localhost:3000/p/alexrivers-mealmaker-ai) to see a live public story page.
   - Switch between **Recruiter**, **Client**, and **Non-Technical** tabs directly on the page.
   - Test the **45-second pitch teleprompter** with timer and audio text-to-speech.
   - Explore the **Mermaid architecture diagram** with zoom controls.
   - Inspect the **5 interview questions accordion**.

2. **Ingest Any Public GitHub Repo**:
   - Go to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) or the landing page.
   - Click **Create Story** and paste any public repository (e.g., `expressjs/express`, `facebook/react`, or your own repo).
   - Watch the live 4-step progress tracker fetch metadata, analyze dependencies, and generate the story.

3. **Edit & Publish**:
   - In the Project Story Editor, refine any copy, regenerate individual sections, add screenshots, and toggle from **Draft** to **Published Live**.
   - Copy the public shareable link (`/p/[slug]`) to view and share with recruiters.

---

## 🛡️ Security & Reliability Features

- **SSRF Prevention**: Strict regex validation on GitHub repository owners and repo names prevents Server-Side Request Forgery.
- **Privacy Enforcement**: Draft and private projects cannot be viewed without proper credentials.
- **Graceful Rate Limits**: Handles GitHub unauthenticated rate limits (60/hr) cleanly and provides clear warning banners.
- **Fail-Safe AI Generation**: Multi-tier architecture tries Google Gemini first, falls back to OpenAI, and uses the smart heuristic engine if API keys are omitted.

---

## ⚠️ Known Limitations in MVP

- **Public Repositories Only**: Private repositories requiring GitHub OAuth read scopes are intentionally omitted in v1 to keep permissions simple.
- **File Hierarchy Depth**: Codebase structure analysis inspects the root tree and dependency manifests (`package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, etc.) rather than deep recursive parsing of every nested file.
- **Single-User Workspace**: Projects are associated with individual user accounts rather than shared organizational team workspaces.

---

## 🚀 Suggested Next Features for Version 2

1. **Auto-Generated Video Pitch**: Synthesize screenshots and the 45-second pitch script into a downloadable 1080p MP4 with voiceover.
2. **Contribution Ownership Map**: For team or hackathon projects, parse git blame to attribute features to specific team members (*"Priya built the vision pipeline, Sam built the database"*).
3. **LinkedIn / Resume Export**: Export a one-click formatted LinkedIn post draft and high-resolution PDF case study flyer.
4. **Interactive Code Snippet Highlights**: Let developers bookmark 2–3 specific GitHub code lines/functions that demonstrate clean coding practices.
5. **Multi-Language Regional Explanations**: Generate stories in Spanish, Hindi, Telugu, French, and Japanese for regional hackathons and local clients.
