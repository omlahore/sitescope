// Zero-dependency HTTP fetch using Node built-in fetch (18+)

import { FETCH } from "../config.js";

export async function fetchPage(url, options = {}) {
  const timeout = options.timeout ?? FETCH.PAGE_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SiteScope/1.0; +https://github.com/omlahore/sitescope)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    return {
      ok: true,
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers,
      html,
      responseTime,
      redirected: response.redirected,
      size: new TextEncoder().encode(html).length,
    };
  } catch (err) {
    const endTime = performance.now();
    return {
      ok: false,
      url,
      error: err.name === "AbortError" ? "Request timed out" : err.message,
      responseTime: Math.round(endTime - startTime),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function headRequest(url, options = {}) {
  const timeout = options.timeout ?? FETCH.HEAD_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SiteScope/1.0; +https://github.com/omlahore/sitescope)",
      },
    });
    return { ok: true, status: response.status, url: response.url };
  } catch {
    return { ok: false, url };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchText(url, options = {}) {
  const timeout = options.timeout ?? FETCH.INDEXING_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SiteScope/1.0; +https://github.com/omlahore/sitescope)",
        Accept: "text/plain,application/xml,*/*;q=0.8",
      },
    });

    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      url: response.url,
      text,
    };
  } catch (err) {
    return {
      ok: false,
      url,
      error: err.name === "AbortError" ? "Request timed out" : err.message,
    };
  } finally {
    clearTimeout(timer);
  }
}
