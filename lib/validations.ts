import { z } from "zod";

export const CreateProjectSchema = z
  .object({
    url: z.string().optional(),
    github_url: z.string().optional(),
    audience: z.enum(["recruiter", "client", "non-technical", "judge"]).optional(),
    audience_version: z.enum(["recruiter", "client", "non-technical", "judge"]).optional(),
    onboardingAnswers: z
      .object({
        problemSolved: z.string().max(500).optional(),
        targetAudience: z.string().max(500).optional(),
        proudestAchievement: z.string().max(500).optional(),
      })
      .optional(),
  })
  .transform((data) => ({
    url: (data.url || data.github_url || "").trim(),
    audience: data.audience || data.audience_version || "recruiter",
    onboardingAnswers: data.onboardingAnswers,
  }))
  .refine(
    (data) =>
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+(?:\/)?$|^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/.test(
        data.url
      ),
    {
      message:
        "Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo or owner/repo)",
      path: ["url"],
    }
  );

export const UpdateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  one_line_pitch: z.string().min(1).max(400).optional(),
  problem: z.string().max(3000).optional(),
  solution: z.string().max(3000).optional(),
  features: z.array(z.string().max(500)).max(12).optional(),
  tech_stack: z
    .array(
      z.object({
        name: z.string().max(100),
        reason: z.string().max(300),
        category: z.string().max(50).optional(),
      })
    )
    .max(25)
    .optional(),
  how_it_works: z.array(z.string().max(500)).max(10).optional(),
  architecture_summary: z.string().max(3000).optional(),
  mermaid_diagram: z.string().max(5000).optional(),
  future_improvements: z.array(z.string().max(500)).max(10).optional(),
  pitch_script: z.string().max(2500).optional(),
  interview_questions: z
    .array(
      z.object({
        question: z.string().max(300),
        talking_points: z.string().max(1500).optional(),
      })
    )
    .max(15)
    .optional(),
  audience_version: z.enum(["recruiter", "client", "non-technical", "judge"]).optional(),
  live_demo_url: z.string().max(500).nullable().optional(),
  video_url: z.string().max(500).nullable().optional(),
  external_case_study_url: z.string().max(500).nullable().optional(),
  is_public: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const UploadImageSchema = z.object({
  imageUrl: z.string().min(5).max(10_000_000), // Supports remote URLs or base64 data URIs
  caption: z.string().max(200).optional(),
  sortOrder: z.number().int().min(0).max(100).default(0),
});

export const RegenerateSectionSchema = z.object({
  audience: z.enum(["recruiter", "client", "non-technical", "judge"]).optional(),
  section: z
    .enum([
      "title",
      "one_line_pitch",
      "problem",
      "solution",
      "features",
      "tech_stack",
      "how_it_works",
      "architecture_summary",
      "mermaid_diagram",
      "future_improvements",
      "pitch_script",
      "interview_questions",
    ])
    .optional(),
  onboardingAnswers: z
    .object({
      problemSolved: z.string().max(500).optional(),
      targetAudience: z.string().max(500).optional(),
      proudestAchievement: z.string().max(500).optional(),
    })
    .optional(),
});
