import { fetchText } from "../utils/fetcher.js";

export async function checkIndexing(baseUrl, options = {}) {
  const fetchTextFn = options.fetchText ?? fetchText;
  const results = [];
  const origin = new URL(baseUrl).origin;

  // robots.txt
  const robotsUrl = `${origin}/robots.txt`;
  const robotsResult = await fetchTextFn(robotsUrl);
  let sitemapUrls = [];

  if (!robotsResult.ok) {
    results.push({
      id: "robots-missing",
      status: "fail",
      label: "No robots.txt found",
      detail: `Fetching ${robotsUrl} failed. Add a robots.txt at your site root so crawlers know your crawl rules.`,
    });
  } else {
    const hasUserAgent = /user-agent\s*:/i.test(robotsResult.text);
    const sitemapMatches = [...robotsResult.text.matchAll(/sitemap\s*:\s*(\S+)/gi)];
    sitemapUrls = sitemapMatches.map((m) => m[1]?.trim()).filter(Boolean);

    if (!hasUserAgent) {
      results.push({
        id: "robots-empty",
        status: "warn",
        label: "robots.txt present but has no User-agent rules",
        detail: "Consider adding User-agent and Disallow/Allow directives.",
      });
    } else {
      results.push({
        id: "robots-ok",
        status: "pass",
        label: "robots.txt present",
        detail: sitemapUrls.length > 0 ? `Declares ${sitemapUrls.length} sitemap(s)` : null,
      });
    }
  }

  // sitemap.xml — discover from robots.txt or try /sitemap.xml
  const sitemapUrl = sitemapUrls.length > 0 ? sitemapUrls[0] : `${origin}/sitemap.xml`;

  const sitemapResult = await fetchTextFn(sitemapUrl);

  if (!sitemapResult.ok) {
    results.push({
      id: "sitemap-missing",
      status: "fail",
      label: "No sitemap found",
      detail: `Add a sitemap.xml (or declare it in robots.txt) so search engines can discover your pages.`,
    });
  } else {
    const hasUrlset = /<urlset/i.test(sitemapResult.text);
    const hasSitemapIndex = /<sitemapindex/i.test(sitemapResult.text);
    const urlCount = (sitemapResult.text.match(/<url>/gi) || []).length;

    if (hasUrlset || hasSitemapIndex) {
      const detail =
        hasSitemapIndex
          ? "Sitemap index (references other sitemaps)"
          : `${urlCount} URL(s) listed`;
      results.push({
        id: "sitemap-ok",
        status: "pass",
        label: "Sitemap found",
        detail,
      });
    } else {
      results.push({
        id: "sitemap-invalid",
        status: "warn",
        label: "Sitemap found but format may be invalid",
        detail: "Expected <urlset> or <sitemapindex> XML structure.",
      });
    }
  }

  return { category: "Indexing", results };
}
