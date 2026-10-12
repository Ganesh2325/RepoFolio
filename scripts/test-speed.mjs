const BASE_URL = "http://localhost:3000";

async function testRepo(url, audience = "recruiter") {
  console.log(`\n======================================================`);
  console.log(`Testing Ingestion for: ${url} (${audience})`);
  console.log(`======================================================`);

  const startTime = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, audience })
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const data = await res.json();

    console.log(`Status: ${res.status} | Time: ${elapsed}s`);
    if (data.success && data.project) {
      console.log(`✓ SUCCESS!`);
      console.log(`Title: ${data.project.title}`);
      console.log(`Slug: ${data.project.slug}`);
      console.log(`Architecture Flow (Mermaid length): ${data.project.mermaid_diagram?.length || 0} chars`);
      console.log(`Features count: ${data.project.features?.length || 0}`);
      console.log(`Images count: ${data.project.images?.length || 0}`);
      console.log(`Tech stack: ${data.project.tech_stack?.map(t => t.name).join(', ')}`);
      console.log(`Interview Questions: ${data.project.interview_questions?.length || 0}`);
      console.log(`Live Link: http://localhost:3000/p/${data.project.slug}`);
      return true;
    } else {
      console.error(`✕ FAILED:`, data.error || data);
      return false;
    }
  } catch (err) {
    console.error(`✕ Network/Script Exception:`, err.message);
    return false;
  }
}

async function run() {
  // Test a fast popular repo to prove it works for ANY public repo
  await testRepo("https://github.com/expressjs/express", "recruiter");
}

run();
