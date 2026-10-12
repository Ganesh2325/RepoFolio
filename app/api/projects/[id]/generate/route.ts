import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateProjectStory } from "@/server/ai";
import { AudienceVersion, GeneratedProjectStory, RepoIngestionData } from "@/types";
import { RegenerateSectionSchema } from "@/lib/validations";
import { checkRateLimit } from "@/server/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Rate limit regeneration
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip";
    const rateLimit = checkRateLimit(`regen-${project.id}-${ip}`, 30, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Regeneration rate limit reached. Please wait ${rateLimit.resetSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => ({}));
    const parseResult = RegenerateSectionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { audience = project.audience_version as AudienceVersion, section, onboardingAnswers } =
      parseResult.data;

    let repoData: RepoIngestionData;
    try {
      repoData = JSON.parse(project.raw_github_metadata) as RepoIngestionData;
    } catch {
      return NextResponse.json(
        { success: false, error: "Corrupted repository metadata. Unable to regenerate." },
        { status: 500 }
      );
    }

    // Generate fresh story
    const { story, modelUsed } = await generateProjectStory(repoData, audience, onboardingAnswers);

    let updateData: Record<string, unknown> = {
      audience_version: audience,
    };

    if (section && story[section as keyof GeneratedProjectStory] !== undefined) {
      const val = story[section as keyof GeneratedProjectStory];
      if (Array.isArray(val)) {
        updateData[section] = JSON.stringify(val);
      } else {
        updateData[section] = val;
      }
    } else {
      // Full story regeneration
      updateData = {
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
      };
    }

    // Record generation job
    await prisma.generationJob.create({
      data: {
        project_id: id,
        status: "completed",
        model_used: modelUsed,
        completed_at: new Date(),
      },
    });

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { sort_order: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      modelUsed,
      sectionUpdated: section || null,
      project: {
        ...updated,
        features: JSON.parse(updated.features || "[]"),
        tech_stack: JSON.parse(updated.tech_stack || "[]"),
        how_it_works: JSON.parse(updated.how_it_works || "[]"),
        future_improvements: JSON.parse(updated.future_improvements || "[]"),
        interview_questions: JSON.parse(updated.interview_questions || "[]"),
        raw_github_metadata: JSON.parse(updated.raw_github_metadata || "{}"),
      },
    });
  } catch (error) {
    console.error("Error regenerating project story:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to regenerate project story",
      },
      { status: 500 }
    );
  }
}
