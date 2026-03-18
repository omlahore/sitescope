export function checkAccessibility(parsed) {
  const results = [];

  // Lang attribute
  if (parsed.lang) {
    results.push({ id: "a11y-lang", status: "pass", label: "Language attribute set", detail: `lang="${parsed.lang}"` });
  } else {
    results.push({ id: "a11y-lang", status: "fail", label: "No lang attribute on <html>", detail: "Screen readers need this to choose the right pronunciation." });
  }

  // Viewport meta
  if (parsed.metaViewport) {
    results.push({ id: "a11y-viewport", status: "pass", label: "Viewport meta tag present", detail: null });
  } else {
    results.push({ id: "a11y-viewport", status: "fail", label: "No viewport meta tag", detail: "Required for responsive design and mobile accessibility." });
  }

  // Doctype
  if (parsed.hasDoctype) {
    results.push({ id: "a11y-doctype", status: "pass", label: "DOCTYPE declared", detail: null });
  } else {
    results.push({ id: "a11y-doctype", status: "warn", label: "No DOCTYPE declaration", detail: "Pages without DOCTYPE render in quirks mode." });
  }

  // Charset
  if (parsed.charset) {
    results.push({ id: "a11y-charset", status: "pass", label: `Charset: ${parsed.charset}`, detail: null });
  } else {
    results.push({ id: "a11y-charset", status: "warn", label: "No charset declared", detail: 'Add <meta charset="utf-8"> to prevent encoding issues.' });
  }

  // Images without alt
  const missingAlt = parsed.images.filter((img) => img.alt === null && !img.src.startsWith("data:"));
  if (missingAlt.length > 0) {
    results.push({ id: "a11y-img-alt", status: "fail", label: `${missingAlt.length} image(s) missing alt attribute`, detail: "All images need alt text for screen readers." });
  } else if (parsed.images.length > 0) {
    results.push({ id: "a11y-img-alt", status: "pass", label: "All images have alt attributes", detail: null });
  }

  // Empty alt vs missing alt (decorative images)
  const emptyAlt = parsed.images.filter((img) => img.alt === "");
  if (emptyAlt.length > 0) {
    results.push({ id: "a11y-img-empty-alt", status: "pass", label: `${emptyAlt.length} decorative image(s) with alt=""`, detail: "Empty alt is correct for decorative images." });
  }

  // Heading hierarchy
  if (parsed.h1s.length === 0) {
    results.push({ id: "a11y-h1", status: "fail", label: "No H1 heading", detail: "Pages should have a main heading for document structure." });
  } else {
    results.push({ id: "a11y-h1", status: "pass", label: "H1 heading present", detail: null });
  }

  // Favicon
  if (parsed.favicon) {
    results.push({ id: "a11y-favicon", status: "pass", label: "Favicon found", detail: null });
  } else {
    results.push({ id: "a11y-favicon", status: "warn", label: "No favicon found", detail: "Add a favicon for browser tabs and bookmarks." });
  }

  return { category: "Accessibility", results };
}
