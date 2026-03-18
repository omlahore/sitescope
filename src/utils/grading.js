// Shared grading and status logic for terminal and HTML reporters

import { c } from "./colors.js";

/**
 * Convert a numeric score (0-100) to a letter grade.
 * @param {number} score
 * @returns {{ letter: string, color?: string }} Letter grade; color only for terminal use
 */
export function getGrade(score) {
  if (score >= 90) return { letter: "A", color: c.green };
  if (score >= 80) return { letter: "B", color: c.green };
  if (score >= 70) return { letter: "C", color: c.yellow };
  if (score >= 50) return { letter: "D", color: c.yellow };
  return { letter: "F", color: c.red };
}

/**
 * Get terminal status icon for a check result.
 * @param {string} status - "pass" | "warn" | "fail"
 */
export function statusIcon(status) {
  if (status === "pass") return `${c.green}✔${c.reset}`;
  if (status === "warn") return `${c.yellow}⚠${c.reset}`;
  if (status === "fail") return `${c.red}✖${c.reset}`;
  return `${c.gray}○${c.reset}`;
}

/**
 * Get emoji for status (for HTML report).
 * @param {string} status - "pass" | "warn" | "fail"
 */
export function statusEmoji(status) {
  if (status === "pass") return "✅";
  if (status === "warn") return "⚠️";
  if (status === "fail") return "❌";
  return "○";
}

/**
 * Sort order for status display (fail first, then warn, then pass).
 * @param {string} status
 * @returns {number}
 */
export function statusOrder(status) {
  if (status === "fail") return 0;
  if (status === "warn") return 1;
  return 2;
}
