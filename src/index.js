import { fetchPage } from "./utils/fetcher.js";
import { parseHTML } from "./utils/parser.js";
import { c, printBanner, spinner } from "./utils/terminal.js";
import { checkSEO } from "./checks/seo.js";
import { checkPerformance } from "./checks/performance.js";
import { checkSecurity } from "./checks/security.js";
import { checkAccessibility } from "./checks/accessibility.js";
import { checkLinks } from "./checks/links.js";
import { checkIndexing } from "./checks/indexing.js";
import { printReport } from "./reporters/terminal.js";
import { generateHTMLReport } from "./reporters/html.js";

export async function runAudit(url, options = {}) {
  printBanner();

  // Step 1: Fetch
  const s1 = spinner(`Fetching ${url}`);
  const fetchResult = await fetchPage(url);

  if (!fetchResult.ok) {
    s1.fail(`Failed to fetch: ${fetchResult.error}`);
    const err = new Error(`Failed to fetch: ${fetchResult.error}`);
    err.code = "FETCH_FAILED";
    throw err;
  }

  s1.stop(`Fetched in ${fetchResult.responseTime}ms (${Math.round(fetchResult.size / 1024)} KB)`);

  // Step 2: Parse HTML
  const s2 = spinner("Parsing HTML");
  const parsed = parseHTML(fetchResult.html);
  s2.stop("HTML parsed");

  // Step 3: Run checks
  const enabledChecks = options.checks === "all"
    ? ["seo", "perf", "security", "accessibility", "links", "indexing"]
    : options.checks.split(",").map((s) => s.trim());

  const categories = [];

  if (enabledChecks.includes("seo")) {
    const s = spinner("Checking SEO");
    const result = checkSEO(parsed, url);
    categories.push(scoreCategory(result));
    s.stop("SEO checked");
  }

  if (enabledChecks.includes("perf")) {
    const s = spinner("Checking performance");
    const result = checkPerformance(parsed, fetchResult);
    categories.push(scoreCategory(result));
    s.stop("Performance checked");
  }

  if (enabledChecks.includes("security")) {
    const s = spinner("Checking security headers");
    const result = checkSecurity(fetchResult.headers, fetchResult);
    categories.push(scoreCategory(result));
    s.stop("Security checked");
  }

  if (enabledChecks.includes("accessibility")) {
    const s = spinner("Checking accessibility");
    const result = checkAccessibility(parsed);
    categories.push(scoreCategory(result));
    s.stop("Accessibility checked");
  }

  if (enabledChecks.includes("links")) {
    const s = spinner("Checking links");
    const result = await checkLinks(parsed, url, options);
    categories.push(scoreCategory(result));
    s.stop("Links checked");
  }

  if (enabledChecks.includes("indexing")) {
    const s = spinner("Checking robots.txt & sitemap");
    const result = await checkIndexing(fetchResult.url);
    categories.push(scoreCategory(result));
    s.stop("Indexing checked");
  }

  // Calculate overall score (guard against empty categories)
  const overallScore =
    categories.length > 0
      ? Math.round(
          categories.reduce((acc, cat) => acc + cat.score, 0) / categories.length
        )
      : 0;

  const auditResult = {
    url: fetchResult.url,
    timestamp: new Date().toISOString(),
    responseTime: fetchResult.responseTime,
    htmlSize: fetchResult.size,
    overallScore,
    categories,
  };

  // Output
  if (options.json) {
    console.log(JSON.stringify(auditResult, null, 2));
  } else {
    printReport(auditResult);
  }

  // HTML report
  if (options.output) {
    const outputPath = options.output.endsWith(".html")
      ? options.output
      : `${options.output}.html`;
    const s = spinner(`Generating HTML report`);
    await generateHTMLReport(auditResult, outputPath);
    s.stop(`Report saved to ${c.cyan}${outputPath}${c.reset}`);
  }

  return auditResult;
}

export function scoreCategory({ category, results }) {
  const total = results.length;
  if (total === 0) return { category, score: 100, results };

  let points = 0;
  for (const r of results) {
    if (r.status === "pass") points += 1;
    else if (r.status === "warn") points += 0.5;
    // fail = 0
  }

  const score = Math.round((points / total) * 100);
  return { category, score, results };
}
