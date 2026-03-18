// Lightweight HTML parser — no dependencies
// Not a full DOM parser, but sufficient for SEO/meta audits

export function parseHTML(html) {
  return {
    title: extractTag(html, "title"),
    metaDescription: extractMeta(html, "description"),
    metaViewport: extractMeta(html, "viewport"),
    metaRobots: extractMeta(html, "robots"),
    canonical: extractCanonical(html),
    h1s: extractAllTags(html, "h1"),
    h2s: extractAllTags(html, "h2"),
    images: extractImages(html),
    links: extractLinks(html),
    scripts: extractScripts(html),
    stylesheets: extractStylesheets(html),
    lang: extractLang(html),
    openGraph: extractOpenGraph(html),
    twitterCard: extractTwitterCard(html),
    structuredData: extractStructuredData(html),
    favicon: extractFavicon(html),
    charset: extractCharset(html),
    hasDoctype: /^<!doctype\s+html/i.test(html.trim()),
  };
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : null;
}

function extractMeta(html, name) {
  const pattern = new RegExp(
    `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`,
    "i"
  );
  const match = html.match(pattern);
  return match ? (match[1] || match[2] || "").trim() : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? match[1].trim() : null;
}

function extractAllTags(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const results = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1].replace(/<[^>]*>/g, "").trim());
  }
  return results;
}

function extractImages(html) {
  const regex = /<img[^>]*>/gi;
  const images = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']*)["']/i)?.[1] || "";
    const alt = tag.match(/alt=["']([^"']*)["']/i)?.[1] ?? null;
    const loading = tag.match(/loading=["']([^"']*)["']/i)?.[1] || null;
    const width = tag.match(/width=["']([^"']*)["']/i)?.[1] || null;
    const height = tag.match(/height=["']([^"']*)["']/i)?.[1] || null;
    images.push({ src, alt, loading, width, height });
  }
  return images;
}

function extractLinks(html) {
  const regex = /<a[^>]*>/gi;
  const links = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    const href = tag.match(/href=["']([^"']*)["']/i)?.[1] || "";
    const rel = tag.match(/rel=["']([^"']*)["']/i)?.[1] || "";
    links.push({ href, rel });
  }
  return links;
}

function extractScripts(html) {
  const regex = /<script[^>]*>/gi;
  const scripts = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']*)["']/i)?.[1] || null;
    const async = /\basync\b/i.test(tag);
    const defer = /\bdefer\b/i.test(tag);
    scripts.push({ src, async, defer });
  }
  return scripts;
}

function extractStylesheets(html) {
  const regex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const sheets = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[0].match(/href=["']([^"']*)["']/i)?.[1] || "";
    sheets.push({ href });
  }
  return sheets;
}

function extractLang(html) {
  const match = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  return match ? match[1].trim() : null;
}

function extractOpenGraph(html) {
  const props = {};
  const regex = /<meta[^>]*property=["']og:([^"']*)["'][^>]*content=["']([^"']*)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    props[match[1]] = match[2];
  }
  return Object.keys(props).length > 0 ? props : null;
}

function extractTwitterCard(html) {
  const props = {};
  const regex = /<meta[^>]*name=["']twitter:([^"']*)["'][^>]*content=["']([^"']*)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    props[match[1]] = match[2];
  }
  return Object.keys(props).length > 0 ? props : null;
}

function extractStructuredData(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const data = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      data.push(JSON.parse(match[1].trim()));
    } catch {
      // invalid JSON, skip
    }
  }
  return data.length > 0 ? data : null;
}

function extractFavicon(html) {
  const match = html.match(
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i
  );
  return match ? match[1].trim() : null;
}

function extractCharset(html) {
  const match =
    html.match(/<meta[^>]*charset=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*charset=([^\s>]+)/i);
  return match ? match[1].trim() : null;
}
