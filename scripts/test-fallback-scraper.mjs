async function testFallback(owner, repo) {
  console.log(`Testing raw/web fallback for ${owner}/${repo}...`);

  // 1. Fetch README from raw.githubusercontent.com (branches: main, master, HEAD)
  const branches = ["main", "master", "HEAD"];
  let readme = "";
  let resolvedBranch = "main";

  for (const b of branches) {
    for (const name of ["README.md", "readme.md", "README.MD", "Readme.md"]) {
      try {
        const r = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${b}/${name}`);
        if (r.ok) {
          readme = await r.text();
          resolvedBranch = b;
          console.log(`✓ Found README at branch '${b}' file '${name}', length: ${readme.length}`);
          break;
        }
      } catch (e) {}
    }
    if (readme) break;
  }

  // 2. Fetch repo HTML page to extract metadata
  let description = "";
  let stars = 0;
  let forks = 0;
  let topics = [];
  let primaryLanguage = "TypeScript";
  const rootFiles = [];

  try {
    const htmlRes = await fetch(`https://github.com/${owner}/${repo}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      // Description
      const descMatch = html.match(/<p class="[^"]*f4[^"]*">([\s\S]*?)<\/p>/i) ||
                        html.match(/property="og:description" content="([^"]+)"/i) ||
                        html.match(/name="description" content="([^"]+)"/i);
      if (descMatch) {
        description = descMatch[1].trim().replace(/\s+/g, " ");
      }

      // Stars
      const starMatch = html.match(new RegExp(`/${owner}/${repo}/stargazers[^>]*>.*?([0-9,kK.]+)`, "is"));
      if (starMatch) {
        stars = parseInt(starMatch[1].replace(/,/g, ""), 10) || 0;
      }

      // Topics
      const topicMatches = [...html.matchAll(new RegExp(`href="/topics/([^"]+)"`, "g"))].map(m => m[1]);
      topics = [...new Set(topicMatches)];

      // Primary language
      const langMatch = html.match(/class="color-fg-default text-bold mr-1">([^<]+)<\/span>/i) ||
                        html.match(/itemprop="programmingLanguage">([^<]+)<\/span>/i);
      if (langMatch) {
        primaryLanguage = langMatch[1].trim();
      }

      // File links
      const fileMatches = [...html.matchAll(new RegExp(`/${owner}/${repo}/(?:tree|blob)/${resolvedBranch}/([^"?#]+)`, "g"))].map(m => m[1]);
      rootFiles.push(...new Set(fileMatches));
    }
  } catch (err) {
    console.warn("HTML scrape failed:", err.message);
  }

  // 3. Extract Images from README
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const extractedImages = [];

  for (const match of readme.matchAll(imageRegex)) {
    const caption = match[1];
    let url = match[2].trim().split(" ")[0]; // remove title if present
    if (!url.startsWith("http")) {
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${resolvedBranch}/${url.replace(/^\.\//, "")}`;
    }
    extractedImages.push({ caption, url });
  }

  for (const match of readme.matchAll(htmlImgRegex)) {
    let url = match[1].trim();
    if (!url.startsWith("http")) {
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${resolvedBranch}/${url.replace(/^\.\//, "")}`;
    }
    extractedImages.push({ caption: "Screenshot", url });
  }

  // 4. Try Manifests
  const manifests = {};
  for (const manifestPath of ["package.json", "frontend/package.json", "requirements.txt", "pyproject.toml", "pom.xml", "go.mod", "Cargo.toml", "docker-compose.yml"]) {
    try {
      const mRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${resolvedBranch}/${manifestPath}`);
      if (mRes.ok) {
        const text = await mRes.text();
        console.log(`✓ Found manifest: ${manifestPath}`);
        if (manifestPath.endsWith("package.json")) {
          try { manifests.packageJson = JSON.parse(text); } catch {}
        } else if (manifestPath.endsWith("requirements.txt")) {
          manifests.requirementsTxt = text.split("\n").slice(0, 40).join("\n");
        } else if (manifestPath.endsWith("docker-compose.yml")) {
          manifests.dockerCompose = text.split("\n").slice(0, 40).join("\n");
        }
      }
    } catch {}
  }

  console.log("\n--- RESULT SUMMARY ---");
  console.log("Name:", repo);
  console.log("Description:", description || "Extracted from README");
  console.log("Primary Language:", primaryLanguage);
  console.log("Stars:", stars);
  console.log("Topics:", topics);
  console.log("Root files count:", rootFiles.length);
  console.log("Images extracted:", extractedImages.length);
  console.log("Manifests detected:", Object.keys(manifests));
}

testFallback("Ganesh2325", "AegisTrace");
