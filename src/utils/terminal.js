import { c } from "./colors.js";
export { c };

export function printBanner() {
  console.log(`
${c.cyan}${c.bold}  ┌─────────────────────────────────────┐
  │         ${c.white}◉  sitescope  v1.0${c.cyan}           │
  │   ${c.dim}${c.white}One-command website health report${c.reset}${c.cyan}${c.bold}  │
  └─────────────────────────────────────┘${c.reset}
`);
}

export function printUsage() {
  console.log(`  ${c.bold}Usage:${c.reset}
    ${c.cyan}npx sitescope${c.reset} ${c.white}<url>${c.reset} ${c.dim}[options]${c.reset}

  ${c.bold}Options:${c.reset}
    ${c.yellow}-o, --output <file>${c.reset}   Save HTML report to file
    ${c.yellow}-j, --json${c.reset}            Output raw JSON results
    ${c.yellow}-v, --verbose${c.reset}         Show detailed check info
    ${c.yellow}-c, --checks <list>${c.reset}   Run specific checks (comma-separated)
                         ${c.dim}seo,perf,security,accessibility,links,indexing${c.reset}
    ${c.yellow}--ci${c.reset}                 Exit with code 1 if score below threshold (for CI)
    ${c.yellow}--min-score <n>${c.reset}      Minimum score when using --ci (default: 80)
    ${c.yellow}-h, --help${c.reset}            Show this help message

  ${c.bold}Examples:${c.reset}
    ${c.dim}$${c.reset} npx sitescope example.com
    ${c.dim}$${c.reset} npx sitescope https://mysite.com -o report.html
    ${c.dim}$${c.reset} npx sitescope mysite.com --ci --min-score 80
`);
}

export function printError(msg) {
  console.error(`  ${c.red}${c.bold}✖${c.reset} ${c.red}${msg}${c.reset}`);
}

export { getGrade as grade, statusIcon } from "./grading.js";

export function spinner(text) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(`\r  ${c.cyan}${frames[i]}${c.reset} ${text}`);
    i = (i + 1) % frames.length;
  }, 80);

  return {
    stop(finalText) {
      clearInterval(id);
      process.stdout.write(`\r  ${c.green}✔${c.reset} ${finalText || text}\n`);
    },
    fail(finalText) {
      clearInterval(id);
      process.stdout.write(`\r  ${c.red}✖${c.reset} ${finalText || text}\n`);
    },
  };
}

export function progressBar(current, total, width = 30) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  return `${c.cyan}${"█".repeat(filled)}${c.gray}${"░".repeat(empty)}${c.reset} ${pct}%`;
}
