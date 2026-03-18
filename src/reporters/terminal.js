import { c, grade, statusIcon } from "../utils/terminal.js";

export function printReport(auditResult) {
  const { url, categories, overallScore, timestamp, responseTime } = auditResult;

  const g = grade(overallScore);

  // Header
  console.log(`\n  ${c.dim}───────────────────────────────────────────${c.reset}`);
  console.log(`  ${c.bold}${c.white}Report for${c.reset} ${c.cyan}${c.bold}${url}${c.reset}`);
  console.log(`  ${c.dim}${new Date(timestamp).toLocaleString()}${c.reset}`);
  console.log(`  ${c.dim}───────────────────────────────────────────${c.reset}\n`);

  // Overall grade
  console.log(`  ${c.bold}  Overall Grade:  ${g.color}${c.bold}  ${g.letter}  ${c.reset}  ${c.dim}(${overallScore}/100)${c.reset}\n`);

  // Category summary bar
  console.log(`  ${c.dim}┌──────────────────┬───────┬───────────────┐${c.reset}`);
  console.log(`  ${c.dim}│${c.reset} ${c.bold}Category${c.reset}          ${c.dim}│${c.reset} ${c.bold}Score${c.reset} ${c.dim}│${c.reset} ${c.bold}Grade${c.reset}         ${c.dim}│${c.reset}`);
  console.log(`  ${c.dim}├──────────────────┼───────┼───────────────┤${c.reset}`);

  for (const cat of categories) {
    const cg = grade(cat.score);
    const name = cat.category.padEnd(16);
    const score = String(cat.score).padStart(3);
    const letter = cg.letter.padEnd(1);
    console.log(
      `  ${c.dim}│${c.reset} ${name} ${c.dim}│${c.reset}  ${cg.color}${score}${c.reset}  ${c.dim}│${c.reset}  ${cg.color}${c.bold}${letter}${c.reset}            ${c.dim}│${c.reset}`
    );
  }

  console.log(`  ${c.dim}└──────────────────┴───────┴───────────────┘${c.reset}\n`);

  // Detailed results per category
  for (const cat of categories) {
    const cg = grade(cat.score);
    console.log(
      `  ${cg.color}${c.bold}${cat.category}${c.reset} ${c.dim}(${cat.score}/100)${c.reset}`
    );

    const fails = cat.results.filter((r) => r.status === "fail");
    const warns = cat.results.filter((r) => r.status === "warn");
    const passes = cat.results.filter((r) => r.status === "pass");

    // Show fails first, then warns, then passes
    for (const r of [...fails, ...warns, ...passes]) {
      const icon = statusIcon(r.status);
      console.log(`    ${icon} ${r.label}`);
      if (r.detail) {
        const detailLines = r.detail.split("\n");
        for (const line of detailLines) {
          console.log(`      ${c.dim}${line}${c.reset}`);
        }
      }
    }
    console.log();
  }

  // Quick stats
  const totalChecks = categories.reduce((acc, cat) => acc + cat.results.length, 0);
  const totalFails = categories.reduce(
    (acc, cat) => acc + cat.results.filter((r) => r.status === "fail").length, 0
  );
  const totalWarns = categories.reduce(
    (acc, cat) => acc + cat.results.filter((r) => r.status === "warn").length, 0
  );
  const totalPasses = categories.reduce(
    (acc, cat) => acc + cat.results.filter((r) => r.status === "pass").length, 0
  );

  console.log(`  ${c.dim}───────────────────────────────────────────${c.reset}`);
  console.log(
    `  ${c.bold}${totalChecks} checks${c.reset}  ${c.green}${totalPasses} passed${c.reset}  ${c.yellow}${totalWarns} warnings${c.reset}  ${c.red}${totalFails} failed${c.reset}`
  );
  console.log(`  ${c.dim}Response: ${responseTime}ms | HTML: ${Math.round(auditResult.htmlSize / 1024)} KB${c.reset}`);
  console.log(`  ${c.dim}───────────────────────────────────────────${c.reset}\n`);
}
