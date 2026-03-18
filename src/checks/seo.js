import { SEO } from "../config.js";

export function checkSEO(parsed, _url) {
  const results = [];

  // Title tag
  if (!parsed.title) {
    results.push({ id: "title-missing", status: "fail", label: "Missing <title> tag", detail: "Every page needs a title tag for search engines." });
  } else if (parsed.title.length < SEO.TITLE_MIN_CHARS) {
    results.push({ id: "title-short", status: "warn", label: `Title too short (${parsed.title.length} chars)`, detail: `"${parsed.title}" — aim for 30-60 characters.` });
  } else if (parsed.title.length > SEO.TITLE_MAX_CHARS) {
    results.push({ id: "title-long", status: "warn", label: `Title too long (${parsed.title.length} chars)`, detail: `May get truncated in search results. Aim for 30-60 characters.` });
  } else {
    results.push({ id: "title-ok", status: "pass", label: `Title tag (${parsed.title.length} chars)`, detail: `"${parsed.title}"` });
  }

  // Meta description
  if (!parsed.metaDescription) {
    results.push({ id: "desc-missing", status: "fail", label: "Missing meta description", detail: "Add a meta description for better click-through rates." });
  } else if (parsed.metaDescription.length < SEO.DESC_MIN_CHARS) {
    results.push({ id: "desc-short", status: "warn", label: `Meta description short (${parsed.metaDescription.length} chars)`, detail: "Aim for 120-160 characters." });
  } else if (parsed.metaDescription.length > SEO.DESC_MAX_CHARS) {
    results.push({ id: "desc-long", status: "warn", label: `Meta description long (${parsed.metaDescription.length} chars)`, detail: "May get truncated. Aim for 120-160 characters." });
  } else {
    results.push({ id: "desc-ok", status: "pass", label: `Meta description (${parsed.metaDescription.length} chars)`, detail: null });
  }

  // H1 tags
  if (parsed.h1s.length === 0) {
    results.push({ id: "h1-missing", status: "fail", label: "No <h1> tag found", detail: "Every page should have exactly one H1." });
  } else if (parsed.h1s.length > 1) {
    results.push({ id: "h1-multiple", status: "warn", label: `Multiple H1 tags (${parsed.h1s.length})`, detail: "Best practice is one H1 per page." });
  } else {
    results.push({ id: "h1-ok", status: "pass", label: "Single H1 tag", detail: `"${parsed.h1s[0].substring(0, 60)}"` });
  }

  // Canonical URL
  if (!parsed.canonical) {
    results.push({ id: "canonical-missing", status: "warn", label: "No canonical URL", detail: "Add a canonical tag to prevent duplicate content issues." });
  } else {
    results.push({ id: "canonical-ok", status: "pass", label: "Canonical URL set", detail: parsed.canonical });
  }

  // Meta robots
  const robots = parsed.metaRobots?.toLowerCase() || "";
  if (robots.includes("noindex")) {
    results.push({ id: "robots-noindex", status: "warn", label: "Page set to noindex", detail: "Search engines will not index this page." });
  } else {
    results.push({ id: "robots-ok", status: "pass", label: "Page is indexable", detail: null });
  }

  // Open Graph
  if (!parsed.openGraph) {
    results.push({ id: "og-missing", status: "warn", label: "No Open Graph tags", detail: "Add og:title, og:description, og:image for social sharing." });
  } else {
    const missing = [];
    if (!parsed.openGraph.title) missing.push("og:title");
    if (!parsed.openGraph.description) missing.push("og:description");
    if (!parsed.openGraph.image) missing.push("og:image");
    if (missing.length > 0) {
      results.push({ id: "og-incomplete", status: "warn", label: `Open Graph incomplete`, detail: `Missing: ${missing.join(", ")}` });
    } else {
      results.push({ id: "og-ok", status: "pass", label: "Open Graph tags present", detail: null });
    }
  }

  // Image alt text
  const imagesWithoutAlt = parsed.images.filter((img) => !img.alt && !img.src.includes("data:"));
  if (imagesWithoutAlt.length > 0) {
    results.push({ id: "img-alt-missing", status: "fail", label: `${imagesWithoutAlt.length} image(s) missing alt text`, detail: "All images should have descriptive alt attributes." });
  } else if (parsed.images.length > 0) {
    results.push({ id: "img-alt-ok", status: "pass", label: "All images have alt text", detail: `${parsed.images.length} images checked.` });
  }

  // Structured data
  if (parsed.structuredData) {
    results.push({ id: "schema-ok", status: "pass", label: "Structured data found", detail: `${parsed.structuredData.length} JSON-LD block(s).` });
  } else {
    results.push({ id: "schema-missing", status: "warn", label: "No structured data", detail: "Consider adding JSON-LD for rich search results." });
  }

  // Lang attribute
  if (!parsed.lang) {
    results.push({ id: "lang-missing", status: "warn", label: "No lang attribute on <html>", detail: "Helps search engines and screen readers understand the page language." });
  } else {
    results.push({ id: "lang-ok", status: "pass", label: `Language: ${parsed.lang}`, detail: null });
  }

  return { category: "SEO", results };
}
