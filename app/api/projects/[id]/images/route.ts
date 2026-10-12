import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UploadImageSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    if (project.images.length >= 8) {
      return NextResponse.json(
        { success: false, error: "Maximum limit of screenshots reached (8 max)." },
        { status: 400 }
      );
    }

    const rawBody = await req.json().catch(() => ({}));
    const parseResult = UploadImageSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { imageUrl, caption = "", sortOrder = 0 } = parseResult.data;

    const newImage = await prisma.projectImage.create({
      data: {
        project_id: id,
        image_url: imageUrl,
        caption: caption.trim() || undefined,
        sort_order: sortOrder || project.images.length + 1,
      },
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error("Error creating project image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
