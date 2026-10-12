import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchGitHubRepoData } from "@/server/github";
import { generateProjectStory } from "@/server/ai";
import { generateSlug } from "@/lib/utils";
import { CreateProjectSchema } from "@/lib/validations";
import { checkRateLimit } from "@/server/rate-limit";

export async function POST(req: NextRequest) {
  try {
    let userId: string | undefined;

    // Determine client identifier for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous-ip";
    const rateLimitKey = `ip-${ip}`;

    // Apply rate limit: generous in dev/local mode, standard in production
    const maxAllowed = process.env.NODE_ENV === "production" ? 15 : 60;
    const rateLimit = checkRateLimit(rateLimitKey, maxAllowed, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit reached. Please wait ${rateLimit.resetSeconds} seconds before generating another project story.`,
        },
        { status: 429 }
      );
    }

    // Validate request body
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = CreateProjectSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { url, audience, onboardingAnswers } = parseResult.data;

    // 1. Ingest GitHub repository data
    const ingestResult = await fetchGitHubRepoData(url);
    if (!ingestResult.success) {
      return NextResponse.json(
        { success: false, error: ingestResult.error },
        { status: 400 }
      );
    }

    const repoData = ingestResult.data;

    // Resolve or provision user directly from repository's real GitHub owner
    let user = await prisma.user.findFirst({
      where: { github_username: repoData.owner },
    });
    if (!user) {
      const sanitized = repoData.owner.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
      user = await prisma.user.create({
        data: {
          email: `${sanitized}@github.repo`,
          name: repoData.owner,
          avatar_url: `https://github.com/${repoData.owner}.png`,
          github_username: repoData.owner,
        },
      });
    }
    userId = user.id;

    // 2. Generate AI Project Story
    const { story, modelUsed } = await generateProjectStory(
      repoData,
      audience,
      onboardingAnswers
    );

    // 3. Create unique slug
    let slug = generateSlug(repoData.name, repoData.owner);
    const existingSlug = await prisma.project.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // 4. Save to database
    const project = await prisma.project.create({
      data: {
        user_id: userId,
        github_owner: repoData.owner,
        github_repo: repoData.repo,
        github_url: repoData.url,
        slug,
        title: story.title,
        one_line_pitch: story.one_line_pitch,
        problem: story.problem,
        solution: story.solution,
        features: JSON.stringify(story.features),
        tech_stack: JSON.stringify(story.tech_stack),
        how_it_works: JSON.stringify(story.how_it_works),
        architecture_summary: story.architecture_summary,
        mermaid_diagram: story.mermaid_diagram,
        future_improvements: JSON.stringify(story.future_improvements),
        pitch_script: story.pitch_script,
        interview_questions: JSON.stringify(story.interview_questions),
        audience_version: audience,
        live_demo_url: repoData.homepageUrl || null,
        is_public: true,
        status: "published",
        raw_github_metadata: JSON.stringify(repoData),
        generation_jobs: {
          create: {
            status: "completed",
            model_used: modelUsed,
            completed_at: new Date(),
          },
        },
        images: {
          create:
            repoData.extractedImages && repoData.extractedImages.length > 0
              ? repoData.extractedImages.slice(0, 6).map((img, idx) => ({
                  image_url: img.url,
                  caption: img.caption || `${story.title} Visual ${idx + 1}`,
                  sort_order: idx + 1,
                }))
              : [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        features: story.features,
        tech_stack: story.tech_stack,
        how_it_works: story.how_it_works,
        future_improvements: story.future_improvements,
        interview_questions: story.interview_questions,
        raw_github_metadata: repoData,
      },
    });
  } catch (error) {
    console.error("Error creating project from repo:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while processing the repository.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return all project stories in the database, newest first
    const projects = await prisma.project.findMany({
      orderBy: { updated_at: "desc" },
      include: {
        images: {
          orderBy: { sort_order: "asc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            github_username: true,
          },
        },
      },
    });

    const parsed = projects.map((p) => {
      let features: string[] = [];
      let tech_stack: unknown[] = [];
      let how_it_works: string[] = [];
      let raw_github_metadata = {};
      try {
        features = JSON.parse(p.features);
      } catch {
        features = [];
      }
      try {
        tech_stack = JSON.parse(p.tech_stack);
      } catch {
        tech_stack = [];
      }
      try {
        how_it_works = JSON.parse(p.how_it_works);
      } catch {
        how_it_works = [];
      }
      try {
        raw_github_metadata = JSON.parse(p.raw_github_metadata);
      } catch {
        raw_github_metadata = {};
      }

      return {
        ...p,
        features,
        tech_stack,
        how_it_works,
        raw_github_metadata,
      };
    });

    return NextResponse.json({ success: true, projects: parsed });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
