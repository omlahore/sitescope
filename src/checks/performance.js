import { PERFORMANCE } from "../config.js";

export function checkPerformance(parsed, fetchResult) {
  const results = [];

  // Response time
  const rt = fetchResult.responseTime;
  if (rt < PERFORMANCE.RESPONSE_FAST_MS) {
    results.push({ id: "response-fast", status: "pass", label: `Response time: ${rt}ms`, detail: "Excellent server response." });
  } else if (rt < PERFORMANCE.RESPONSE_SLOW_MS) {
    results.push({ id: "response-ok", status: "warn", label: `Response time: ${rt}ms`, detail: "Aim for under 500ms TTFB." });
  } else {
    results.push({ id: "response-slow", status: "fail", label: `Response time: ${rt}ms`, detail: "Slow server response. Check hosting, caching, or backend." });
  }

  // Page size
  const sizeKB = Math.round(fetchResult.size / 1024);
  if (sizeKB < PERFORMANCE.SIZE_OK_KB) {
    results.push({ id: "size-ok", status: "pass", label: `HTML size: ${sizeKB} KB`, detail: "Lightweight page." });
  } else if (sizeKB < PERFORMANCE.SIZE_WARN_KB) {
    results.push({ id: "size-warn", status: "warn", label: `HTML size: ${sizeKB} KB`, detail: "Consider reducing HTML payload." });
  } else {
    results.push({ id: "size-fail", status: "fail", label: `HTML size: ${sizeKB} KB`, detail: "Large HTML document. Trim inline styles/scripts and unnecessary markup." });
  }

  // Render-blocking scripts
  const blockingScripts = parsed.scripts.filter(
    (s) => s.src && !s.async && !s.defer
  );
  if (blockingScripts.length === 0) {
    results.push({ id: "scripts-ok", status: "pass", label: "No render-blocking scripts", detail: "All external scripts use async or defer." });
  } else {
    results.push({
      id: "scripts-blocking",
      status: "warn",
      label: `${blockingScripts.length} render-blocking script(s)`,
      detail: "Add async or defer to external scripts to improve load speed.",
    });
  }

  // Total external scripts
  const externalScripts = parsed.scripts.filter((s) => s.src);
  if (externalScripts.length > PERFORMANCE.SCRIPTS_FAIL_COUNT) {
    results.push({ id: "scripts-count", status: "fail", label: `${externalScripts.length} external scripts`, detail: "Too many scripts. Bundle or remove unused ones." });
  } else if (externalScripts.length > PERFORMANCE.SCRIPTS_WARN_COUNT) {
    results.push({ id: "scripts-count", status: "warn", label: `${externalScripts.length} external scripts`, detail: "Consider bundling scripts." });
  } else {
    results.push({ id: "scripts-count", status: "pass", label: `${externalScripts.length} external script(s)`, detail: null });
  }

  // Stylesheets
  if (parsed.stylesheets.length > PERFORMANCE.CSS_WARN_COUNT) {
    results.push({ id: "css-count", status: "warn", label: `${parsed.stylesheets.length} external stylesheets`, detail: "Consider combining CSS files." });
  } else {
    results.push({ id: "css-count", status: "pass", label: `${parsed.stylesheets.length} stylesheet(s)`, detail: null });
  }

  // Image lazy loading
  const nonLazyImages = parsed.images.filter(
    (img) => !img.loading && img.src && !img.src.startsWith("data:")
  );
  if (nonLazyImages.length > PERFORMANCE.IMAGES_LAZY_WARN_COUNT) {
    results.push({
      id: "img-lazy",
      status: "warn",
      label: `${nonLazyImages.length} images without lazy loading`,
      detail: 'Add loading="lazy" to below-the-fold images.',
    });
  } else {
    results.push({ id: "img-lazy", status: "pass", label: "Image lazy loading looks good", detail: null });
  }

  // Image dimensions
  const noDimensionImages = parsed.images.filter(
    (img) => !img.width && !img.height && img.src && !img.src.startsWith("data:")
  );
  if (noDimensionImages.length > PERFORMANCE.IMAGES_DIMENSION_WARN_COUNT) {
    results.push({
      id: "img-dimensions",
      status: "warn",
      label: `${noDimensionImages.length} images without explicit dimensions`,
      detail: "Set width and height to prevent layout shifts (CLS).",
    });
  } else {
    results.push({ id: "img-dimensions", status: "pass", label: "Image dimensions specified", detail: null });
  }

  return { category: "Performance", results };
}
