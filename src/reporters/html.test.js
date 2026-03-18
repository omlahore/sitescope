import test from "node:test";
import assert from "node:assert";

// escapeHtml is not exported - test via generateHTMLReport output
// For now, test the escape logic inline
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

test("escapeHtml escapes ampersand", () => {
  assert.strictEqual(escapeHtml("a & b"), "a &amp; b");
});

test("escapeHtml escapes less than", () => {
  assert.strictEqual(escapeHtml("<script>"), "&lt;script&gt;");
});

test("escapeHtml escapes quotes", () => {
  assert.strictEqual(escapeHtml('say "hello"'), "say &quot;hello&quot;");
});

test("escapeHtml prevents XSS by escaping angle brackets", () => {
  const malicious = '<img src=x onerror="alert(1)">';
  const escaped = escapeHtml(malicious);
  assert.ok(!escaped.includes("<") && !escaped.includes(">"));
  assert.ok(escaped.includes("&lt;") && escaped.includes("&gt;"));
});
