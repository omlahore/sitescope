export function checkSecurity(headers, fetchResult) {
  const results = [];
  const h = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  // HTTPS
  if (fetchResult.url.startsWith("https://")) {
    results.push({ id: "https", status: "pass", label: "HTTPS enabled", detail: null });
  } else {
    results.push({ id: "https", status: "fail", label: "Not using HTTPS", detail: "Serve your site over HTTPS for security and SEO." });
  }

  // Strict-Transport-Security (HSTS)
  if (h["strict-transport-security"]) {
    results.push({ id: "hsts", status: "pass", label: "HSTS header present", detail: h["strict-transport-security"] });
  } else {
    results.push({ id: "hsts", status: "warn", label: "No HSTS header", detail: "Add Strict-Transport-Security to enforce HTTPS." });
  }

  // Content-Security-Policy
  if (h["content-security-policy"]) {
    results.push({ id: "csp", status: "pass", label: "Content-Security-Policy set", detail: null });
  } else {
    results.push({ id: "csp", status: "warn", label: "No Content-Security-Policy", detail: "CSP helps prevent XSS and data injection attacks." });
  }

  // X-Content-Type-Options
  if (h["x-content-type-options"]?.toLowerCase() === "nosniff") {
    results.push({ id: "xcto", status: "pass", label: "X-Content-Type-Options: nosniff", detail: null });
  } else {
    results.push({ id: "xcto", status: "warn", label: "Missing X-Content-Type-Options", detail: 'Add "nosniff" to prevent MIME-type sniffing.' });
  }

  // X-Frame-Options
  if (h["x-frame-options"]) {
    results.push({ id: "xfo", status: "pass", label: "X-Frame-Options set", detail: h["x-frame-options"] });
  } else {
    results.push({ id: "xfo", status: "warn", label: "No X-Frame-Options", detail: "Protects against clickjacking. Use DENY or SAMEORIGIN." });
  }

  // Referrer-Policy
  if (h["referrer-policy"]) {
    results.push({ id: "referrer", status: "pass", label: "Referrer-Policy set", detail: h["referrer-policy"] });
  } else {
    results.push({ id: "referrer", status: "warn", label: "No Referrer-Policy", detail: "Controls how much referrer info is shared." });
  }

  // Permissions-Policy
  if (h["permissions-policy"]) {
    results.push({ id: "perms", status: "pass", label: "Permissions-Policy set", detail: null });
  } else {
    results.push({ id: "perms", status: "warn", label: "No Permissions-Policy", detail: "Restrict browser features like camera, microphone, geolocation." });
  }

  // Server header leakage
  if (h["server"]) {
    results.push({ id: "server-header", status: "warn", label: `Server header exposed: ${h["server"]}`, detail: "Consider hiding server version info." });
  } else {
    results.push({ id: "server-header", status: "pass", label: "Server header hidden", detail: null });
  }

  // X-Powered-By leakage
  if (h["x-powered-by"]) {
    results.push({ id: "powered-by", status: "warn", label: `X-Powered-By exposed: ${h["x-powered-by"]}`, detail: "Remove this header to avoid exposing your tech stack." });
  } else {
    results.push({ id: "powered-by", status: "pass", label: "X-Powered-By hidden", detail: null });
  }

  return { category: "Security", results };
}
