const BASE_URL = "http://localhost:3000";

async function testProjectCreation() {
  console.log("Testing POST /api/projects with live Gemini generation...");

  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: "https://github.com/expressjs/express",
      audience: "recruiter"
    })
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Success:", data.success);
  if (data.success && data.project) {
    console.log("✓ Project created successfully!");
    console.log("ID:", data.project.id);
    console.log("Title:", data.project.title);
    console.log("Slug:", data.project.slug);
    console.log("Pitch:", data.project.one_line_pitch);
    console.log("Tech Stack:", data.project.tech_stack?.length, "technologies");
    console.log("Features:", data.project.features?.length, "features");
    console.log("Mermaid diagram snippet:\n", data.project.mermaid_diagram?.slice(0, 150));
    console.log("\nPublic Story URL: http://localhost:3000/p/" + data.project.slug);
  } else {
    console.error("Error creating project:", data);
  }
}

testProjectCreation();
