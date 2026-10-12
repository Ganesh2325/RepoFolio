export type AudienceVersion = "recruiter" | "client" | "non-technical" | "judge";

export interface TechStackItem {
  name: string;
  reason: string;
  category?: string; // e.g., "Frontend", "Backend", "Database", "AI/ML", "DevOps"
}

export interface GeneratedProjectStory {
  title: string;
  one_line_pitch: string;
  problem: string;
  solution: string;
  features: string[];
  tech_stack: TechStackItem[];
  how_it_works: string[];
  architecture_summary: string;
  mermaid_diagram: string;
  future_improvements: string[];
  pitch_script: string;
  interview_questions: {
    question: string;
    talking_points?: string;
  }[];
  confidence_notes?: string[];
}

export interface RepoIngestionData {
  owner: string;
  repo: string;
  url: string;
  name: string;
  description: string;
  topics: string[];
  stars: number;
  forks: number;
  openIssuesCount: number;
  primaryLanguage: string;
  license?: string;
  homepageUrl?: string;
  createdAt: string;
  updatedAt: string;
  readme: string;
  hasMissingOrShortReadme: boolean;
  languages: Record<string, number>;
  rootFiles: string[];
  manifests: {
    packageJson?: Record<string, unknown> | null;
    requirementsTxt?: string | null;
    pyprojectToml?: string | null;
    cargoToml?: string | null;
    goMod?: string | null;
    pomXml?: string | null;
  };
  recentCommits: {
    message: string;
    date: string;
    author: string;
  }[];
  contributors: {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
  }[];
  extractedImages?: {
    url: string;
    caption?: string;
  }[];
}

export interface UserOnboardingAnswers {
  problemSolved?: string;
  targetAudience?: string;
  proudestAchievement?: string;
}

export interface ProjectImageModel {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string | null;
  sort_order: number;
  created_at: string | Date;
}

export interface ProjectModel {
  id: string;
  user_id: string;
  github_owner: string;
  github_repo: string;
  github_url: string;
  slug: string;
  title: string;
  one_line_pitch: string;
  problem: string;
  solution: string;
  features: string[];
  tech_stack: TechStackItem[];
  how_it_works: string[];
  architecture_summary: string;
  mermaid_diagram: string;
  future_improvements: string[];
  pitch_script: string;
  interview_questions: { question: string; talking_points?: string }[];
  audience_version: AudienceVersion;
  live_demo_url?: string | null;
  video_url?: string | null;
  external_case_study_url?: string | null;
  is_public: boolean;
  status: "draft" | "published";
  raw_github_metadata: RepoIngestionData;
  created_at: string | Date;
  updated_at: string | Date;
  images?: ProjectImageModel[];
  user?: {
    id: string;
    name?: string | null;
    email: string;
    avatar_url?: string | null;
    github_username?: string | null;
  };
}
