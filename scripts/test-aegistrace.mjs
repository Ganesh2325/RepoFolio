const BASE_URL = "http://localhost:3000";

async function testAegisTrace() {
  console.log("==================================================================");
  console.log("   TESTING USER REPO INGESTION & GEMINI STORY GENERATION          ");
  console.log("   TARGET: https://github.com/Ganesh2325/AegisTrace               ");
  console.log("==================================================================\n");

  const startTime = Date.now();
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: "https://github.com/Ganesh2325/AegisTrace",
      audience: "recruiter"
    })
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const data = await res.json();

  console.log(`HTTP Status: ${res.status} (completed in ${duration}s)`);
  if (data.success && data.project) {
    console.log("🎉 SUCCESS! RepoFolio processed Ganesh2325/AegisTrace with zero errors!\n");
    console.log("Project ID:", data.project.id);
    console.log("Project Title:", data.project.title);
    console.log("Public Slug:", data.project.slug);
    console.log("One-Line Pitch:", data.project.one_line_pitch);
    console.log("\nProblem:", data.project.problem);
    console.log("\nSolution:", data.project.solution);
    console.log("\nFeatures Count:", data.project.features?.length);
    data.project.features?.forEach((f, i) => console.log(`  ${i+1}. ${f}`));
    console.log("\nTech Stack:", data.project.tech_stack?.map(t => `${t.name}: ${t.reason}`).join(" | "));
    console.log("\nMermaid Architecture Flow:\n", data.project.mermaid_diagram);
    console.log("\n45-Second Pitch Teleprompter:\n", data.project.pitch_script);

    // Auto publish so the user can immediately view it
    const pubRes = await fetch(`${BASE_URL}/api/projects/${data.project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published", is_public: true })
    });
    const pubData = await pubRes.json();
    if (pubData.success) {
      console.log(`\n✓ Project is published live!`);
      console.log(`👉 Open Public Page: http://localhost:3000/p/${data.project.slug}`);
      console.log(`👉 Open Story Editor: http://localhost:3000/dashboard/project/${data.project.id}`);
    }
  } else {
    console.error("✕ Failed with error:", data.error || data);
  }
}

testAegisTrace();
