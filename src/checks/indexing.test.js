import test from "node:test";
import assert from "node:assert";
import { checkIndexing } from "./indexing.js";

async function mockFetchText(url) {
  if (url.endsWith("/robots.txt")) {
    return {
      ok: true,
      text: "User-agent: *\nDisallow: /admin\nSitemap: https://example.com/sitemap.xml",
    };
  }
  if (url.endsWith("/sitemap.xml")) {
    return {
      ok: true,
      text: '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com/</loc></url></urlset>',
    };
  }
  return { ok: false };
}

test("checkIndexing returns Indexing category with results", async () => {
  const result = await checkIndexing("https://example.com", {
    fetchText: mockFetchText,
  });
  assert.strictEqual(result.category, "Indexing");
  assert.ok(Array.isArray(result.results));
  assert.ok(result.results.length >= 2);
});

test("checkIndexing checks for robots.txt and sitemap", async () => {
  const result = await checkIndexing("https://example.com", {
    fetchText: mockFetchText,
  });
  const ids = result.results.map((r) => r.id);
  assert.ok(ids.includes("robots-ok") || ids.includes("robots-missing") || ids.includes("robots-empty"));
  assert.ok(ids.includes("sitemap-ok") || ids.includes("sitemap-missing") || ids.includes("sitemap-invalid"));
});

test("checkIndexing reports robots-missing when robots.txt fails", async () => {
  const result = await checkIndexing("https://example.com", {
    fetchText: () => ({ ok: false }),
  });
  const robotsResult = result.results.find((r) => r.id === "robots-missing");
  assert.ok(robotsResult);
  assert.strictEqual(robotsResult.status, "fail");
});

test("checkIndexing discovers sitemap from robots.txt", async () => {
  const result = await checkIndexing("https://example.com", {
    fetchText: mockFetchText,
  });
  const sitemapResult = result.results.find((r) => r.id === "sitemap-ok");
  assert.ok(sitemapResult);
  assert.strictEqual(sitemapResult.status, "pass");
});
