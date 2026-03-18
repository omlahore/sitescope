import { writeFile } from "node:fs/promises";
import { getGrade, statusEmoji, statusOrder } from "../utils/grading.js";

export async function generateHTMLReport(auditResult, outputPath) {
  const { url, categories, overallScore, timestamp } = auditResult;
  const gradeInfo = getGrade(overallScore);

  const categoryHTML = categories
    .map(
      (cat) => {
        const cg = getGrade(cat.score);
        const items = cat.results
          .sort((a, b) => statusOrder(a.status) - statusOrder(b.status))
          .map(
            (r) => `
            <div class="check-item check-${r.status}">
              <span class="check-icon">${statusEmoji(r.status)}</span>
              <div class="check-content">
                <span class="check-label">${escapeHtml(r.label)}</span>
                ${r.detail ? `<span class="check-detail">${escapeHtml(r.detail)}</span>` : ""}
              </div>
            </div>`
          )
          .join("\n");

        return `
          <div class="category">
            <div class="category-header">
              <h2>${escapeHtml(cat.category)}</h2>
              <div class="category-grade grade-${cg.letter.toLowerCase()}">${cg.letter}</div>
              <span class="category-score">${cat.score}/100</span>
            </div>
            <div class="checks">${items}</div>
          </div>`;
      }
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SiteScope Report — ${escapeHtml(url)}</title>
  <style>
    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --surface2: #1a1a26;
      --border: #2a2a3a;
      --text: #e8e8f0;
      --text-dim: #8888a0;
      --green: #4ade80;
      --yellow: #facc15;
      --red: #f87171;
      --cyan: #22d3ee;
      --font: 'Segoe UI', system-ui, -apple-system, sans-serif;
      --mono: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem;
      max-width: 860px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      padding: 3rem 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }

    .header .brand {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--cyan);
      margin-bottom: 0.5rem;
    }

    .header h1 {
      font-size: 1.1rem;
      font-weight: 400;
      color: var(--text-dim);
      word-break: break-all;
    }

    .grade-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      margin: 2rem auto 1rem;
      border: 3px solid;
    }

    .grade-circle.grade-a, .grade-circle.grade-b { border-color: var(--green); color: var(--green); }
    .grade-circle.grade-c { border-color: var(--yellow); color: var(--yellow); }
    .grade-circle.grade-d, .grade-circle.grade-f { border-color: var(--red); color: var(--red); }

    .overall-score { color: var(--text-dim); font-size: 0.9rem; }

    .category {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface2);
    }

    .category-header h2 { font-size: 1rem; font-weight: 600; flex: 1; }

    .category-grade {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .category-grade.grade-a, .category-grade.grade-b { background: #4ade8020; color: var(--green); }
    .category-grade.grade-c { background: #facc1520; color: var(--yellow); }
    .category-grade.grade-d, .category-grade.grade-f { background: #f8717120; color: var(--red); }

    .category-score { color: var(--text-dim); font-size: 0.85rem; font-family: var(--mono); }

    .checks { padding: 0.5rem; }

    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.65rem 1rem;
      border-radius: 8px;
    }

    .check-item:hover { background: var(--surface2); }

    .check-icon { font-size: 0.9rem; flex-shrink: 0; padding-top: 2px; }

    .check-content { display: flex; flex-direction: column; }

    .check-label { font-size: 0.9rem; }

    .check-detail {
      font-size: 0.8rem;
      color: var(--text-dim);
      font-family: var(--mono);
      white-space: pre-wrap;
    }

    .check-fail .check-label { color: var(--red); }
    .check-warn .check-label { color: var(--yellow); }
    .check-pass .check-label { color: var(--text); }

    .footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-dim);
      font-size: 0.8rem;
      border-top: 1px solid var(--border);
      margin-top: 2rem;
    }

    .footer a { color: var(--cyan); text-decoration: none; }
    .footer a:hover { text-decoration: underline; }

    .summary-bar {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 1.5rem 0;
      font-family: var(--mono);
      font-size: 0.85rem;
    }

    .summary-bar .passed { color: var(--green); }
    .summary-bar .warnings { color: var(--yellow); }
    .summary-bar .failed { color: var(--red); }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">◉ SiteScope</div>
    <h1>${escapeHtml(url)}</h1>
    <div class="grade-circle grade-${gradeInfo.letter.toLowerCase()}">${gradeInfo.letter}</div>
    <div class="overall-score">${overallScore} / 100</div>
    <div class="summary-bar">
      <span class="passed">✔ ${countByStatus(categories, "pass")} passed</span>
      <span class="warnings">⚠ ${countByStatus(categories, "warn")} warnings</span>
      <span class="failed">✖ ${countByStatus(categories, "fail")} failed</span>
    </div>
  </div>

  ${categoryHTML}

  <div class="footer">
    Generated by <a href="https://github.com/omlahore/sitescope">sitescope</a> on ${new Date(timestamp).toLocaleString()}
  </div>
</body>
</html>`;

  await writeFile(outputPath, html, "utf-8");
}

function countByStatus(categories, status) {
  return categories.reduce(
    (acc, cat) => acc + cat.results.filter((r) => r.status === status).length,
    0
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
