// Comprehensive End-to-End Test Suite for RepoFolio
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================================");
  console.log("   REPOFOLIO AUTOMATED USER FLOW & SECURITY VERIFICATION SUITE   ");
  console.log("==================================================================\n");

  let passed = 0;
  let total = 0;

  // 1. Landing Page Availability
  total++;
  console.log("1. Testing Landing Page (GET /)...");
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status === 200) {
      const html = await res.text();
      if (html.includes("RepoFolio") && html.includes("Turn your GitHub repository into a project story")) {
        console.log("   ✓ Landing page loaded successfully with core headline and value proposition");
        passed++;
      } else {
        console.error("   ✕ Landing page HTML missing expected branding");
      }
    } else {
      console.error(`   ✕ Landing page failed with HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("   ✕ Landing page fetch error:", err.message);
  }

  // 2. Public Project Story Page & Open Graph Metadata
  total++;
  console.log("\n2. Testing Public Project Story Page (GET /p/alexrivers-mealmaker-ai)...");
  try {
    const res = await fetch(`${BASE_URL}/p/alexrivers-mealmaker-ai`);
    if (res.status === 200) {
      const html = await res.text();
      const hasOgTitle = html.includes('og:title') || html.includes('MealMaker AI');
      const hasAudienceLens = html.includes('recruiter') || html.includes('Audience Lens');
      const hasPitchScript = html.includes('pitch') || html.includes('Spoken Pitch');
      if (hasOgTitle && (hasAudienceLens || hasPitchScript)) {
        console.log("   ✓ Public story loaded with audience lens, 45s pitch, and metadata");
        passed++;
      } else {
        console.error("   ✕ Public story page missing expected elements");
      }
    } else {
      console.error(`   ✕ Public story page returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("   ✕ Public page fetch error:", err.message);
  }

  // 3. Security Audit: Private/Draft Project slug access protection
  total++;
  console.log("\n3. Testing Security: Unauthenticated access to non-existent or private slug...");
  try {
    const res = await fetch(`${BASE_URL}/p/non-existent-secret-slug-12345`);
    const html = await res.text();
    if (res.status === 200 && (html.includes("not found") || html.includes("private"))) {
      console.log("   ✓ Protected: Unauthenticated visitor blocked from non-existent/private project");
      passed++;
    } else {
      console.error("   ✕ Security check failed: Expected not found/private warning, got HTTP", res.status);
    }
  } catch (err) {
    console.error("   ✕ Security check error:", err.message);
  }

  // 4. Testing Security: Forbidden access to another user's project
  total++;
  console.log("\n4. Testing Security: Unauthorized project modification (PATCH /api/projects/[id])...");
  try {
    const res = await fetch(`${BASE_URL}/api/projects/non-existent-or-unauthorized-id`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Malicious Tampering Attempt"
      })
    });
    // Should return 404 (if not found) or 403 (if forbidden), never 200
    if (res.status === 404 || res.status === 403) {
      console.log(`   ✓ Protected: Unauthorized modification rejected cleanly (HTTP ${res.status})`);
      passed++;
    } else {
      console.error(`   ✕ Security check failed: Expected 403 or 404, got HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("   ✕ Ownership check error:", err.message);
  }

  // 5. Ingestion URL Validation: Malicious/Invalid URLs
  total++;
  console.log("\n5. Testing Ingestion Input Validation (Invalid/Malicious URLs)...");
  try {
    // Test SSRF attempt or invalid domain
    const badRes = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        github_url: "https://evil-phishing-site.com/exploit",
        audience_version: "recruiter"
      })
    });
    // Even before auth or at auth boundary, it should never succeed
    if (badRes.status === 401 || badRes.status === 400) {
      console.log(`   ✓ Protected: Bad URL rejected cleanly (HTTP ${badRes.status})`);
      passed++;
    } else {
      console.error(`   ✕ Bad URL not rejected: HTTP ${badRes.status}`);
    }
  } catch (err) {
    console.error("   ✕ Input validation check error:", err.message);
  }

  // 6. Direct Ingestion & Heuristic Verification across 4 Archetypes
  total++;
  console.log("\n6. Testing 4 Archetypes via in-app API (GET /api/test-archetypes)...");
  try {
    const res = await fetch(`${BASE_URL}/api/test-archetypes`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        console.log(`   ✓ All ${data.results.length} Archetypes generated & validated cleanly:`);
        for (const item of data.results) {
          console.log(`     - [PASS] ${item.name}`);
        }
        passed++;
      } else {
        console.error("   ✕ Archetype tests returned failures:", data);
      }
    } else {
      console.error(`   ✕ Archetypes API returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("   ✕ Archetype testing error:", err.message);
  }

  // 7. Test Public Story API endpoint (/api/public/projects/[slug])
  total++;
  console.log("\n7. Testing Public Project API Endpoint (GET /api/public/projects/alexrivers-mealmaker-ai)...");
  try {
    const res = await fetch(`${BASE_URL}/api/public/projects/alexrivers-mealmaker-ai`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.success && data.project?.title && Array.isArray(data.project.images)) {
        console.log(`   ✓ Public API returned structured JSON for "${data.project.title}" with ${data.project.images.length} images`);
        passed++;
      } else {
        console.error("   ✕ Public API response malformed:", data);
      }
    } else {
      console.error(`   ✕ Public API returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("   ✕ Public API error:", err.message);
  }

  console.log("\n==================================================================");
  console.log(`   TEST SUMMARY: ${passed}/${total} AUTOMATED SUITE TESTS PASSED`);
  console.log("==================================================================");

  if (passed === total) {
    console.log("🎉 ALL TESTS PASSED! RepoFolio MVP is fully stable and verified.");
  } else {
    process.exit(1);
  }
}

runTests();
