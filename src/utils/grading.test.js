import test from "node:test";
import assert from "node:assert";
import { getGrade, statusIcon, statusEmoji, statusOrder } from "./grading.js";

test("getGrade returns correct letter for score thresholds", () => {
  assert.strictEqual(getGrade(95).letter, "A");
  assert.strictEqual(getGrade(90).letter, "A");
  assert.strictEqual(getGrade(89).letter, "B");
  assert.strictEqual(getGrade(80).letter, "B");
  assert.strictEqual(getGrade(79).letter, "C");
  assert.strictEqual(getGrade(70).letter, "C");
  assert.strictEqual(getGrade(69).letter, "D");
  assert.strictEqual(getGrade(50).letter, "D");
  assert.strictEqual(getGrade(49).letter, "F");
  assert.strictEqual(getGrade(0).letter, "F");
});

test("getGrade returns color for terminal use", () => {
  const gradeA = getGrade(95);
  assert.ok(gradeA.color);
  assert.strictEqual(typeof gradeA.color, "string");
});

test("statusIcon returns ANSI-wrapped icons", () => {
  assert.ok(statusIcon("pass").includes("✔"));
  assert.ok(statusIcon("warn").includes("⚠"));
  assert.ok(statusIcon("fail").includes("✖"));
  assert.ok(statusIcon("unknown").includes("○"));
});

test("statusEmoji returns correct emoji", () => {
  assert.strictEqual(statusEmoji("pass"), "✅");
  assert.strictEqual(statusEmoji("warn"), "⚠️");
  assert.strictEqual(statusEmoji("fail"), "❌");
  assert.strictEqual(statusEmoji("other"), "○");
});

test("statusOrder returns correct sort order", () => {
  assert.strictEqual(statusOrder("fail"), 0);
  assert.strictEqual(statusOrder("warn"), 1);
  assert.strictEqual(statusOrder("pass"), 2);
});
