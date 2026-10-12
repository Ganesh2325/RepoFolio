import { RepoIngestionData } from "@/types";
import { parseGitHubUrl } from "@/lib/utils";

interface GitHubErrorResponse {
  message?: string;
  documentation_url?: string;
}

export async function fetchGitHubRepoData(
  rawInput: string
): Promise<{ success: true; data: RepoIngestionData } | { success: false; error: string }> {
  const parsed = parseGitHubUrl(rawInput);
  if (!parsed) {
    return {
      success: false,
      error:
        "Invalid GitHub repository URL. Please provide a link like 'https://github.com/username/repository' or 'username/repository'.",
    };
  }

  const { owner, repo } = parsed;

  // Strict alphanumeric / hyphen / dot check to prevent SSRF
  if (!/^[a-zA-Z0-9_\-\.]+$/.test(owner) || !/^[a-zA-Z0-9_\-\.]+$/.test(repo)) {
    return {
      success: false,
      error: "Invalid repository format. Only alphanumeric characters, hyphens, and dots are allowed.",
    };
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoFolio-Story-Engine/1.0",
  };

  if (
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_TOKEN.trim().length > 15 &&
    !process.env.GITHUB_TOKEN.toLowerCase().includes("dummy")
  ) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }

  try {
    // 1. Fetch Repository Metadata
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 },
    });

    // If token returned 401 (e.g. invalid or revoked), fallback to unauthenticated request
    if (repoRes.status === 401 && headers["Authorization"]) {
      delete headers["Authorization"];
      repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        next: { revalidate: 60 },
      });
    }

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return {
          success: false,
          error: `Repository '${owner}/${repo}' was not found. Please verify the repository exists and is public.`,
        };
      }
      if (repoRes.status === 403 || repoRes.status === 429) {
        console.warn(`GitHub REST API rate limit reached (HTTP ${repoRes.status}). Switching seamlessly to raw/web fallback scraper...`);
        return await fetchPublicGitHubWebFallback(owner, repo);
      }
      console.warn(`GitHub API returned status ${repoRes.status}. Attempting raw/web fallback...`);
      return await fetchPublicGitHubWebFallback(owner, repo);
    }

    const repoInfo = await repoRes.json();

    // 2. Fetch README
    let readmeContent = "";
    let hasMissingOrShortReadme = false;
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers,
      });
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content && readmeData.encoding === "base64") {
          readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        } else if (readmeData.download_url) {
          const rawReadme = await fetch(readmeData.download_url);
          readmeContent = await rawReadme.text();
        }
      }
    } catch (e) {
      console.warn("Could not fetch README:", e);
    }

    if (!readmeContent || readmeContent.trim().length < 150) {
      hasMissingOrShortReadme = true;
    }

    // 3. Fetch Languages
    let languages: Record<string, number> = {};
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
      });
      if (langRes.ok) {
        languages = await langRes.json();
      }
    } catch (e) {
      console.warn("Could not fetch languages:", e);
    }

    // 4. Fetch Root Directory Contents
    let rootFiles: string[] = [];
    const manifests: RepoIngestionData["manifests"] = {};
    try {
      const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers,
      });
      if (contentsRes.ok) {
        const contents = await contentsRes.json();
        if (Array.isArray(contents)) {
          rootFiles = contents.map((item: { name: string; type: string }) =>
            item.type === "dir" ? `${item.name}/` : item.name
          );

          // Check for key manifest files and fetch content
          for (const item of contents) {
            const fileName = item.name.toLowerCase();
            if (
              [
                "package.json",
                "requirements.txt",
                "pyproject.toml",
                "cargo.toml",
                "go.mod",
                "pom.xml",
              ].includes(fileName) &&
              item.download_url
            ) {
              try {
                const fileRes = await fetch(item.download_url);
                if (fileRes.ok) {
                  const text = await fileRes.text();
                  if (fileName === "package.json") {
                    try {
                      manifests.packageJson = JSON.parse(text);
                    } catch {
                      // ignore parse error
                    }
                  } else if (fileName === "requirements.txt") {
                    manifests.requirementsTxt = text.split("\n").slice(0, 40).join("\n");
                  } else if (fileName === "pyproject.toml") {
                    manifests.pyprojectToml = text.split("\n").slice(0, 40).join("\n");
                  } else if (fileName === "cargo.toml") {
                    manifests.cargoToml = text.split("\n").slice(0, 40).join("\n");
                  } else if (fileName === "go.mod") {
                    manifests.goMod = text.split("\n").slice(0, 40).join("\n");
                  } else if (fileName === "pom.xml") {
                    manifests.pomXml = text.split("\n").slice(0, 40).join("\n");
                  }
                }
              } catch (manifestErr) {
                console.warn(`Error fetching manifest ${item.name}:`, manifestErr);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch root contents:", e);
    }

    // 5. Fetch Recent Commits (up to 5)
    const recentCommits: RepoIngestionData["recentCommits"] = [];
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
        { headers }
      );
      if (commitsRes.ok) {
        const commits = await commitsRes.json();
        if (Array.isArray(commits)) {
          for (const c of commits) {
            recentCommits.push({
              message: c.commit?.message?.split("\n")[0] || "Update code",
              date: c.commit?.committer?.date || c.commit?.author?.date || "",
              author: c.commit?.author?.name || c.author?.login || "Contributor",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch commits:", e);
    }

    // 6. Fetch Contributors (up to 5)
    const contributors: RepoIngestionData["contributors"] = [];
    try {
      const contribRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`,
        { headers }
      );
      if (contribRes.ok) {
        const contribs = await contribRes.json();
        if (Array.isArray(contribs)) {
          for (const item of contribs) {
            contributors.push({
              login: item.login,
              avatar_url: item.avatar_url,
              contributions: item.contributions || 0,
              html_url: item.html_url,
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch contributors:", e);
    }

    // Assemble unified repository ingestion data
    const ingestionData: RepoIngestionData = {
      owner: repoInfo.owner?.login || owner,
      repo: repoInfo.name || repo,
      url: repoInfo.html_url || `https://github.com/${owner}/${repo}`,
      name: repoInfo.name || repo,
      description: repoInfo.description || "",
      topics: Array.isArray(repoInfo.topics) ? repoInfo.topics : [],
      stars: repoInfo.stargazers_count || 0,
      forks: repoInfo.forks_count || 0,
      openIssuesCount: repoInfo.open_issues_count || 0,
      primaryLanguage: repoInfo.language || Object.keys(languages)[0] || "Unknown",
      license: repoInfo.license?.name || repoInfo.license?.spdx_id || undefined,
      homepageUrl: repoInfo.homepage || undefined,
      createdAt: repoInfo.created_at || new Date().toISOString(),
      updatedAt: repoInfo.updated_at || new Date().toISOString(),
      readme: readmeContent.slice(0, 15000), // Cap readme to prevent excessive token consumption
      hasMissingOrShortReadme,
      languages,
      rootFiles: rootFiles.slice(0, 50),
      manifests,
      recentCommits,
      contributors,
      extractedImages: extractImagesFromReadme(readmeContent, owner, repo),
    };

    return {
      success: true,
      data: ingestionData,
    };
  } catch (err: unknown) {
    console.warn("REST API threw error, falling back to public web/raw scraper:", err);
    return await fetchPublicGitHubWebFallback(owner, repo);
  }
}

function extractImagesFromReadme(
  readme: string,
  owner: string,
  repo: string,
  defaultBranch = "HEAD"
): { url: string; caption?: string }[] {
  if (!readme) return [];
  const images: { url: string; caption?: string }[] = [];
  const mdRegex = /!\[(.*?)\]\((.*?)\)/g;
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;

  for (const match of readme.matchAll(mdRegex)) {
    const caption = match[1]?.trim() || `${repo} Visual`;
    let url = match[2]?.trim().split(" ")[0];
    if (
      url &&
      !url.includes("badge") &&
      !url.includes("shields.io") &&
      !url.includes("img.shields") &&
      !url.includes("travis-ci") &&
      !url.includes("circleci")
    ) {
      if (!url.startsWith("http")) {
        const cleanPath = url.replace(/^\.\//, "").replace(/^\//, "");
        url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${defaultBranch}/${cleanPath}`;
      }
      images.push({ caption, url });
    }
  }

  for (const match of readme.matchAll(htmlImgRegex)) {
    let url = match[1]?.trim();
    if (
      url &&
      !url.includes("badge") &&
      !url.includes("shields.io") &&
      !url.includes("img.shields")
    ) {
      if (!url.startsWith("http")) {
        const cleanPath = url.replace(/^\.\//, "").replace(/^\//, "");
        url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${defaultBranch}/${cleanPath}`;
      }
      images.push({ caption: `${repo} Visual`, url });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  }).slice(0, 6);
}

async function fetchFileContentFallback(
  owner: string,
  repo: string,
  branch: string,
  filepath: string
): Promise<string | null> {
  const cleanPath = filepath.replace(/^\//, "");

  // 1. Try jsDelivr fast edge CDN with 2.5s timeout (avoids raw.github ISP blocks)
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${cleanPath}`,
      {
        signal: AbortSignal.timeout(2500),
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch {}

  // 2. Try raw.githubusercontent.com with 2.5s timeout
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanPath}`,
      {
        signal: AbortSignal.timeout(2500),
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch {}

  // 3. Try github.com raw endpoint with 2.5s timeout
  try {
    const res = await fetch(
      `https://github.com/${owner}/${repo}/raw/${branch}/${cleanPath}`,
      {
        signal: AbortSignal.timeout(2500),
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch {}

  return null;
}

export async function fetchPublicGitHubWebFallback(
  owner: string,
  repo: string
): Promise<{ success: true; data: RepoIngestionData } | { success: false; error: string }> {
  try {
    // 1. Fetch public HTML page to extract metadata & branch
    let html = "";
    let description = "";
    let stars = 0;
    let forks = 0;
    let topics: string[] = [];
    let primaryLanguage = "TypeScript";
    const rootFiles: string[] = [];
    let resolvedBranch = "main";

    try {
      const htmlRes = await fetch(`https://github.com/${owner}/${repo}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 60 },
      });

      if (htmlRes.status === 404) {
        return {
          success: false,
          error: `Repository '${owner}/${repo}' was not found. Please verify the repository exists and is public.`,
        };
      }

      if (htmlRes.ok) {
        html = await htmlRes.text();

        // Check if GitHub rendered a 404 page despite HTTP status
        if (
          html.includes("This is not the web page you are looking for") ||
          html.includes("<title>Page not found")
        ) {
          return {
            success: false,
            error: `Repository '${owner}/${repo}' was not found. Please verify the repository exists and is public.`,
          };
        }

        // Detect default branch from page
        const branchMatch =
          html.match(/class="css-truncate-target"[^>]*>([^<]+)<\/span>/i) ||
          html.match(new RegExp(`/${owner}/${repo}/(?:tree|blob)/([^"/]+)`, "i"));
        if (branchMatch && branchMatch[1] && !branchMatch[1].includes("/")) {
          resolvedBranch = branchMatch[1].trim();
        }

        // Description
        const descMatch =
          html.match(/<p class="[^"]*f4[^"]*">([\s\S]*?)<\/p>/i) ||
          html.match(/property="og:description" content="([^"]+)"/i) ||
          html.match(/name="description" content="([^"]+)"/i);
        if (descMatch) {
          description = descMatch[1].trim().replace(/\s+/g, " ");
        }

        // Stars
        const starMatch = html.match(
          new RegExp(`/${owner}/${repo}/stargazers[^>]*>.*?([0-9,kK.]+)`, "is")
        );
        if (starMatch) {
          stars = parseInt(starMatch[1].replace(/,/g, ""), 10) || 0;
        }

        // Forks
        const forkMatch = html.match(
          new RegExp(`/${owner}/${repo}/network/members[^>]*>.*?([0-9,kK.]+)`, "is")
        );
        if (forkMatch) {
          forks = parseInt(forkMatch[1].replace(/,/g, ""), 10) || 0;
        }

        // Topics
        const topicMatches = [
          ...html.matchAll(new RegExp(`href="/topics/([^"]+)"`, "g")),
        ].map((m) => m[1]);
        topics = [...new Set(topicMatches)];

        // Primary language
        const langMatch =
          html.match(/class="color-fg-default text-bold mr-1">([^<]+)<\/span>/i) ||
          html.match(/itemprop="programmingLanguage">([^<]+)<\/span>/i);
        if (langMatch) {
          primaryLanguage = langMatch[1].trim();
        }

        // File names
        const fileMatches = [
          ...html.matchAll(
            new RegExp(`/${owner}/${repo}/(?:tree|blob)/${resolvedBranch}/([^"?#]+)`, "g")
          ),
        ].map((m) => m[1]);
        rootFiles.push(...new Set(fileMatches));
      }
    } catch (scrapeErr) {
      console.warn("Public HTML scrape warning:", scrapeErr);
    }

    // 2. Fetch README via multi-CDN fallback
    let readmeContent = "";
    for (const b of [resolvedBranch, "main", "master", "HEAD"]) {
      for (const name of ["README.md", "readme.md", "README.MD", "Readme.md"]) {
        const text = await fetchFileContentFallback(owner, repo, b, name);
        if (text) {
          readmeContent = text;
          resolvedBranch = b;
          break;
        }
      }
      if (readmeContent) break;
    }

    // 3. Extract Images from README
    const extractedImages = extractImagesFromReadme(readmeContent, owner, repo, resolvedBranch);

    // 4. Ingest Key Dependency Manifests
    const manifests: RepoIngestionData["manifests"] = {};
    const manifestCandidates = [
      "package.json",
      "frontend/package.json",
      "requirements.txt",
      "pyproject.toml",
      "pom.xml",
      "go.mod",
      "Cargo.toml",
      "docker-compose.yml",
    ];

    for (const manifestPath of manifestCandidates) {
      const text = await fetchFileContentFallback(owner, repo, resolvedBranch, manifestPath);
      if (text) {
        if (manifestPath.endsWith("package.json") && !manifests.packageJson) {
          try {
            manifests.packageJson = JSON.parse(text);
          } catch {}
        } else if (manifestPath.endsWith("requirements.txt") && !manifests.requirementsTxt) {
          manifests.requirementsTxt = text.split("\n").slice(0, 40).join("\n");
        } else if (manifestPath.endsWith("pyproject.toml") && !manifests.pyprojectToml) {
          manifests.pyprojectToml = text.split("\n").slice(0, 40).join("\n");
        } else if (manifestPath.endsWith("go.mod") && !manifests.goMod) {
          manifests.goMod = text.split("\n").slice(0, 40).join("\n");
        } else if (manifestPath.endsWith("Cargo.toml") && !manifests.cargoToml) {
          manifests.cargoToml = text.split("\n").slice(0, 40).join("\n");
        } else if (manifestPath.endsWith("pom.xml") && !manifests.pomXml) {
          manifests.pomXml = text.split("\n").slice(0, 40).join("\n");
        }
      }
    }

    // Infer language if missing
    if (primaryLanguage === "TypeScript" && manifests.requirementsTxt) {
      primaryLanguage = "Python";
    }

    const hasMissingOrShortReadme = !readmeContent || readmeContent.trim().length < 150;

    const cleanDescription = description
      .replace(/Contribute to .* development by creating an account on GitHub\./i, "")
      .trim();

    return {
      success: true,
      data: {
        owner,
        repo,
        url: `https://github.com/${owner}/${repo}`,
        name: repo,
        description: cleanDescription || `${repo} application repository`,
        topics,
        stars,
        forks,
        openIssuesCount: 0,
        primaryLanguage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readme: readmeContent.slice(0, 15000),
        hasMissingOrShortReadme,
        languages: { [primaryLanguage]: 100000 },
        rootFiles: rootFiles.slice(0, 50),
        manifests,
        recentCommits: [],
        contributors: [
          {
            login: owner,
            avatar_url: `https://github.com/${owner}.png`,
            contributions: 1,
            html_url: `https://github.com/${owner}`,
          },
        ],
        extractedImages,
      },
    };
  } catch (fallbackError: unknown) {
    console.error("Critical error in public web fallback:", fallbackError);
    return {
      success: false,
      error:
        fallbackError instanceof Error
          ? fallbackError.message
          : "Could not fetch repository from GitHub.",
    };
  }
}
