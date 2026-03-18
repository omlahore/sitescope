#!/usr/bin/env node

import { parseArgs } from "node:util";
import path from "node:path";
import { runAudit } from "../src/index.js";
import { printBanner, printUsage, printError } from "../src/utils/terminal.js";

const options = {
  help: { type: "boolean", short: "h", default: false },
  output: { type: "string", short: "o", default: "" },
  json: { type: "boolean", short: "j", default: false },
  verbose: { type: "boolean", short: "v", default: false },
  checks: { type: "string", short: "c", default: "all" },
  ci: { type: "boolean", default: false },
  "min-score": { type: "string", default: "80" },
};

let parsed;
try {
  parsed = parseArgs({ options, allowPositionals: true, strict: true });
} catch (err) {
  printError(`Invalid option: ${err.message}`);
  printUsage();
  process.exit(1);
}

const { values, positionals } = parsed;

if (values.help) {
  printBanner();
  printUsage();
  process.exit(0);
}

const url = positionals[0];

if (!url) {
  printBanner();
  printError("Please provide a URL to audit.");
  console.log(`\n  Example: ${"\x1b[36m"}npx sitescope https://example.com${"\x1b[0m"}\n`);
  printUsage();
  process.exit(1);
}

// Normalize URL
let targetUrl = url;
if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
  targetUrl = `https://${targetUrl}`;
}

try {
  new URL(targetUrl);
} catch {
  printError(`Invalid URL: "${url}"`);
  process.exit(1);
}

// Validate output path to prevent path traversal
if (values.output) {
  const outputPath = values.output.endsWith(".html")
    ? values.output
    : `${values.output}.html`;
  const resolved = path.resolve(outputPath);
  const base = path.resolve(process.cwd());
  const relative = path.relative(base, resolved);
  if (relative.startsWith("..")) {
    printError("Output path cannot be outside current directory.");
    process.exit(1);
  }
}

try {
  const auditResult = await runAudit(targetUrl, {
    output: values.output,
    json: values.json,
    verbose: values.verbose,
    checks: values.checks,
  });

  if (values.ci) {
    const minScore = Math.min(100, Math.max(0, parseInt(values["min-score"], 10) || 80));
    if (auditResult.overallScore < minScore) {
      printError(`Score ${auditResult.overallScore}/100 is below minimum ${minScore}.`);
      process.exit(1);
    }
  }
} catch (err) {
  if (err.code === "FETCH_FAILED") {
    process.exit(1);
  }
  printError(err.message || "An unexpected error occurred.");
  process.exit(1);
}
