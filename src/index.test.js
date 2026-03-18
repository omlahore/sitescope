import test from "node:test";
import assert from "node:assert";
import { scoreCategory } from "./index.js";

test("scoreCategory returns 100 for empty results", () => {
  const result = scoreCategory({ category: "SEO", results: [] });
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.category, "SEO");
});

test("scoreCategory calculates pass correctly", () => {
  const result = scoreCategory({
    category: "Test",
    results: [
      { status: "pass" },
      { status: "pass" },
    ],
  });
  assert.strictEqual(result.score, 100);
});

test("scoreCategory calculates warn as half point", () => {
  const result = scoreCategory({
    category: "Test",
    results: [
      { status: "pass" },
      { status: "warn" },
    ],
  });
  assert.strictEqual(result.score, 75);
});

test("scoreCategory calculates fail as zero", () => {
  const result = scoreCategory({
    category: "Test",
    results: [
      { status: "pass" },
      { status: "fail" },
    ],
  });
  assert.strictEqual(result.score, 50);
});

test("scoreCategory handles mixed results", () => {
  const result = scoreCategory({
    category: "Test",
    results: [
      { status: "pass" },
      { status: "pass" },
      { status: "warn" },
      { status: "fail" },
    ],
  });
  // 2 + 0.5 + 0 = 2.5, 2.5/4 * 100 = 62.5 -> 63
  assert.strictEqual(result.score, 63);
});
