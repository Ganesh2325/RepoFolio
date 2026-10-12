import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(repoName: string, owner?: string): string {
  const base = `${owner ? `${owner}-` : ""}${repoName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  if (!url || typeof url !== "string") return null;
  const cleaned = url.trim().replace(/\/+$/, "");

  // Match formats:
  // https://github.com/owner/repo
  // http://github.com/owner/repo
  // github.com/owner/repo
  // owner/repo
  const patterns = [
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)/i,
    /^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1] && match[2]) {
      const owner = match[1];
      let repo = match[2];
      if (repo.endsWith(".git")) {
        repo = repo.slice(0, -4);
      }
      return { owner, repo };
    }
  }

  return null;
}

export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCleanYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}
