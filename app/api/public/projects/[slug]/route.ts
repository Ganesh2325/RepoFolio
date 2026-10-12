import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug },
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
      return NextResponse.json(
        { success: false, error: "Project story not found." },
        { status: 404 }
      );
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
    console.error("Error fetching public project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load public project" },
      { status: 500 }
    );
  }
}
