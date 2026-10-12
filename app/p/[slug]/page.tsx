import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import PublicProjectView from "@/components/PublicProjectView";
import { FolderGit2, ArrowLeft } from "lucide-react";

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectBySlug(slug: string) {
  return await prisma.project.findUnique({
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
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Story Not Found | RepoFolio",
      description: "This project story does not exist or may have been removed.",
    };
  }

  const primaryImage =
    project.images?.[0]?.image_url ||
    `https://github.com/${project.github_owner}.png`;

  return {
    title: `${project.title} | RepoFolio Project Story`,
    description: project.one_line_pitch,
    openGraph: {
      title: project.title,
      description: project.one_line_pitch,
      url: `https://repofolio.dev/p/${project.slug}`,
      siteName: "RepoFolio",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.one_line_pitch,
      images: [primaryImage],
    },
  };
}

export default async function PublicProjectPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 mx-auto">
          <FolderGit2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Project story not found</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          This project story does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to RepoFolio Home</span>
        </Link>
      </div>
    );
  }

  // Parse JSON fields
  const parsedProject = {
    ...project,
    audience_version: (project.audience_version as "recruiter" | "client" | "non-technical" | "judge") || "recruiter",
    status: (project.status as "draft" | "published") || "published",
    features: JSON.parse(project.features || "[]"),
    tech_stack: JSON.parse(project.tech_stack || "[]"),
    how_it_works: JSON.parse(project.how_it_works || "[]"),
    future_improvements: JSON.parse(project.future_improvements || "[]"),
    interview_questions: JSON.parse(project.interview_questions || "[]"),
    raw_github_metadata: JSON.parse(project.raw_github_metadata || "{}"),
  };

  return <PublicProjectView initialProject={parsedProject} />;
}
