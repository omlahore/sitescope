import { headRequest } from "../utils/fetcher.js";
import { FETCH, LINKS } from "../config.js";

export async function checkLinks(parsed, baseUrl, options = {}) {
  const results = [];
  const maxLinksToCheck = options.verbose ? LINKS.MAX_LINKS_VERBOSE : LINKS.MAX_LINKS_DEFAULT;

  // Filter internal links
  const base = new URL(baseUrl);
  const internalLinks = [];
  const externalLinks = [];

  for (const link of parsed.links) {
    if (!link.href || link.href.startsWith("#") || link.href.startsWith("mailto:") || link.href.startsWith("tel:") || link.href.startsWith("javascript:")) continue;

    try {
      const resolved = new URL(link.href, baseUrl);
      if (resolved.hostname === base.hostname) {
        internalLinks.push(resolved.href);
      } else {
        externalLinks.push(resolved.href);
      }
    } catch {
      // malformed URL
    }
  }

  results.push({
    id: "links-internal",
    status: "pass",
    label: `${internalLinks.length} internal link(s)`,
    detail: null,
  });

  results.push({
    id: "links-external",
    status: "pass",
    label: `${externalLinks.length} external link(s)`,
    detail: null,
  });

  // Check a sample of links for broken ones
  const linksToCheck = [...new Set([...internalLinks, ...externalLinks])].slice(
    0,
    maxLinksToCheck
  );

  if (linksToCheck.length > 0) {
    const broken = [];
    const checkPromises = linksToCheck.map(async (url) => {
      const result = await headRequest(url, { timeout: FETCH.LINK_CHECK_TIMEOUT_MS });
      if (!result.ok || (result.status && result.status >= 400)) {
        broken.push({ url, status: result.status || "timeout" });
      }
    });

    await Promise.all(checkPromises);

    if (broken.length > 0) {
      results.push({
        id: "links-broken",
        status: "fail",
        label: `${broken.length} broken link(s) found`,
        detail: broken.map((b) => `${b.status}: ${b.url}`).join("\n          "),
      });
    } else {
      results.push({
        id: "links-ok",
        status: "pass",
        label: `All ${linksToCheck.length} checked links are valid`,
        detail: null,
      });
    }
  }

  // Nofollow/noopener checks on external links
  const externalWithoutRel = parsed.links.filter((l) => {
    if (!l.href) return false;
    try {
      const u = new URL(l.href, baseUrl);
      return u.hostname !== base.hostname && !l.rel.includes("noopener");
    } catch {
      return false;
    }
  });

  if (externalWithoutRel.length > 0) {
    results.push({
      id: "links-noopener",
      status: "warn",
      label: `${externalWithoutRel.length} external link(s) without rel="noopener"`,
      detail: "Add rel=\"noopener\" to external links for security.",
    });
  }

  return { category: "Links", results };
}
