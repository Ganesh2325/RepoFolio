import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpdateProjectSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
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

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        features: JSON.parse(project.features || "[]"),
        tech_stack: JSON.parse(project.tech_stack || "[]"),
        how_it_works: JSON.parse(project.how_it_works || "[]"),
        future_improvements: JSON.parse(project.future_improvements || "[]"),
        interview_questions: JSON.parse(project.interview_questions || "[]"),
        raw_github_metadata: JSON.parse(project.raw_github_metadata || "{}"),
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const rawBody = await req.json().catch(() => ({}));
    const parseResult = UpdateProjectSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const body = parseResult.data;
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.one_line_pitch !== undefined) updateData.one_line_pitch = body.one_line_pitch;
    if (body.problem !== undefined) updateData.problem = body.problem;
    if (body.solution !== undefined) updateData.solution = body.solution;
    if (body.features !== undefined) updateData.features = JSON.stringify(body.features);
    if (body.tech_stack !== undefined) updateData.tech_stack = JSON.stringify(body.tech_stack);
    if (body.how_it_works !== undefined) updateData.how_it_works = JSON.stringify(body.how_it_works);
    if (body.architecture_summary !== undefined) updateData.architecture_summary = body.architecture_summary;
    if (body.mermaid_diagram !== undefined) updateData.mermaid_diagram = body.mermaid_diagram;
    if (body.future_improvements !== undefined) updateData.future_improvements = JSON.stringify(body.future_improvements);
    if (body.pitch_script !== undefined) updateData.pitch_script = body.pitch_script;
    if (body.interview_questions !== undefined) updateData.interview_questions = JSON.stringify(body.interview_questions);
    if (body.audience_version !== undefined) updateData.audience_version = body.audience_version;
    if (body.live_demo_url !== undefined) updateData.live_demo_url = body.live_demo_url;
    if (body.video_url !== undefined) updateData.video_url = body.video_url;
    if (body.external_case_study_url !== undefined) updateData.external_case_study_url = body.external_case_study_url;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;
    if (body.status !== undefined) updateData.status = body.status;

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
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
