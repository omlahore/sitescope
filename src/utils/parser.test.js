import test from "node:test";
import assert from "node:assert";
import { parseHTML } from "./parser.js";

test("parseHTML extracts title", () => {
  const html = "<html><head><title>My Page</title></head><body></body></html>";
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.title, "My Page");
});

test("parseHTML extracts meta description", () => {
  const html = '<html><head><meta name="description" content="A test page"></head><body></body></html>';
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.metaDescription, "A test page");
});

test("parseHTML extracts meta description with reversed attribute order", () => {
  const html = '<html><head><meta content="Reversed order" name="description"></head><body></body></html>';
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.metaDescription, "Reversed order");
});

test("parseHTML extracts H1 tags", () => {
  const html = "<html><body><h1>Main Heading</h1><p>Content</p></body></html>";
  const parsed = parseHTML(html);
  assert.deepStrictEqual(parsed.h1s, ["Main Heading"]);
});

test("parseHTML extracts multiple H2s", () => {
  const html = "<html><body><h2>First</h2><h2>Second</h2></body></html>";
  const parsed = parseHTML(html);
  assert.deepStrictEqual(parsed.h2s, ["First", "Second"]);
});

test("parseHTML extracts images with alt", () => {
  const html = '<html><body><img src="/pic.jpg" alt="A picture"></body></html>';
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.images.length, 1);
  assert.strictEqual(parsed.images[0].src, "/pic.jpg");
  assert.strictEqual(parsed.images[0].alt, "A picture");
});

test("parseHTML extracts links", () => {
  const html = '<html><body><a href="https://example.com">Link</a></body></html>';
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.links.length, 1);
  assert.strictEqual(parsed.links[0].href, "https://example.com");
});

test("parseHTML detects doctype", () => {
  const html = "<!DOCTYPE html><html><body></body></html>";
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.hasDoctype, true);
});

test("parseHTML returns null for missing elements", () => {
  const html = "<html><body></body></html>";
  const parsed = parseHTML(html);
  assert.strictEqual(parsed.title, null);
  assert.strictEqual(parsed.metaDescription, null);
  assert.deepStrictEqual(parsed.h1s, []);
});
