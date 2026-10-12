import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, imageId } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.project_id !== id) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true, message: "Screenshot deleted" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
