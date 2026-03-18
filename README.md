<p align="center"><img src="public/logo.svg" width="80"></p>
<h1 align="center">sitescope</h1>
<p align="center">
  <strong>One-command website health report.</strong><br>
  Performance, SEO, security, accessibility, and broken links — zero config, zero dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sitescope"><img src="https://img.shields.io/npm/v/sitescope?color=22d3ee&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/sitescope"><img src="https://img.shields.io/npm/dm/sitescope?color=6366f1" alt="npm downloads"></a>
  <img src="https://img.shields.io/github/stars/omlahore/sitescope?style=social" alt="GitHub Stars">
  <a href="https://github.com/omlahore/sitescope/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/node-%3E%3D18-blue" alt="Node 18+">
</p>

<details>
<summary>Preview output</summary>

```
  sitescope
  -------------------------------------------------------
  Report for https://example.com
  -------------------------------------------------------
  Overall Grade:  A  (92/100)
  -------------------------------------------------------
  Category          Score   Grade
  -------------------------------------------------------
  SEO               92      A
  Performance       88      A
  Security          75      C
  Accessibility     95      A
  Links            100      A
  Indexing         100      A
  -------------------------------------------------------
```

</details>

```bash
npx sitescope https://yoursite.com
```

That's it. No install. No config. No API keys.

---

## Table of Contents

- [Why sitescope?](#-why-sitescope)
- [Quick Start](#-quick-start)
- [What It Checks](#-what-it-checks)
- [Usage & Options](#-usage--options)
- [HTML Report](#-html-report)
- [CI/CD Integration](#-cicd-integration)
- [Programmatic API](#-programmatic-api)
- [Comparison](#-comparison-with-alternatives)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [Star History](#-star-history)
- [License](#-license)

---

## ✨ Why sitescope?

Every existing website audit tool requires Docker, Playwright, browser downloads, API keys, or a PhD in YAML. We built the opposite.

| Feature | sitescope | Lighthouse CLI | seo-audit-skill | site-audit-seo |
| :--- | :---: | :---: | :---: | :---: |
| **Zero dependencies** | ✅ | ❌ | ❌ | ❌ |
| **Works with `npx`** | ✅ | ❌ | ❌ | ❌ |
| **No browser/Playwright needed** | ✅ | ❌ | ❌ | ❌ |
| **No API keys** | ✅ | ✅ | ❌ | ✅ |
| **HTML report export** | ✅ | ✅ | ✅ | ✅ |
| **JSON output for CI** | ✅ | ✅ | ✅ | ✅ |
| **Security header checks** | ✅ | ❌ | ✅ | ❌ |
| **Broken link detection** | ✅ | ❌ | ✅ | ✅ |
| **robots.txt / sitemap checks** | ✅ | ❌ | ❌ | ❌ |
| **Runs in < 5 seconds** | ✅ | ❌ | ❌ | ❌ |

> **Philosophy:** Most audit tools try to be everything. They end up slow, complex, and full of checks nobody cares about. sitescope checks what actually matters for 90% of websites and gives you a clear letter grade in seconds.

---

## 🚀 Quick Start

```bash
# Audit any website — no install needed
npx sitescope https://yoursite.com
```

Or install globally:

```bash
npm install -g sitescope
sitescope https://yoursite.com
```

---

## 🔍 What It Checks

sitescope runs **37+ checks** across 6 categories and grades each A through F.

### SEO

| Check | What it looks for |
| :--- | :--- |
| **Title tag** | Exists, 30–60 characters |
| **Meta description** | Exists, 120–160 characters |
| **H1 tag** | Exactly one per page |
| **Canonical URL** | Prevents duplicate content |
| **Open Graph** | og:title, og:description, og:image |
| **Image alt text** | All images have descriptive alt attributes |
| **Structured data** | JSON-LD blocks present |
| **Language** | `lang` attribute on `<html>` |
| **Robots** | Page is indexable (no noindex) |

### Performance

| Check | What it looks for |
| :--- | :--- |
| **Response time** | TTFB under 500ms |
| **Page size** | HTML payload under 100 KB |
| **Render-blocking scripts** | All scripts use `async` or `defer` |
| **Script count** | Not overloaded with external scripts |
| **Stylesheet count** | CSS files within reasonable limits |
| **Lazy loading** | Images use `loading="lazy"` |
| **Image dimensions** | Width/height set to prevent CLS |

### Security

| Check | What it looks for |
| :--- | :--- |
| **HTTPS** | Site served over TLS |
| **HSTS** | Strict-Transport-Security header |
| **CSP** | Content-Security-Policy present |
| **X-Content-Type-Options** | `nosniff` to prevent MIME sniffing |
| **X-Frame-Options** | Clickjacking protection |
| **Referrer-Policy** | Controls referrer info leakage |
| **Permissions-Policy** | Restricts browser APIs |
| **Server header** | Version info not exposed |
| **X-Powered-By** | Tech stack not exposed |

### Accessibility

| Check | What it looks for |
| :--- | :--- |
| **Language attribute** | `lang` on `<html>` for screen readers |
| **Viewport meta** | Responsive design enabled |
| **DOCTYPE** | Standards mode rendering |
| **Charset** | `utf-8` declared |
| **Image alt attributes** | Screen reader support |
| **Heading structure** | H1 present for document hierarchy |
| **Favicon** | Browser tab and bookmark icon |

### Links

| Check | What it looks for |
| :--- | :--- |
| **Broken links** | Sample of internal/external links validated |
| **Link counts** | Internal and external link inventory |
| **`rel="noopener"`** | Security on external links |

### Indexing

| Check | What it looks for |
| :--- | :--- |
| **robots.txt** | Present at site root with User-agent rules |
| **sitemap.xml** | Present (from robots.txt or /sitemap.xml) |

---

## 📖 Usage & Options

```bash
# Basic audit
npx sitescope example.com

# Save HTML report
npx sitescope https://mysite.com --output report.html

# JSON output (for CI/CD pipelines)
npx sitescope mysite.com --json

# Run specific categories only
npx sitescope mysite.com --checks seo,security,indexing

# Verbose mode (checks more links)
npx sitescope mysite.com --verbose

# CI mode — exit code 1 if score below threshold
npx sitescope mysite.com --ci --min-score 80
```

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--output <file>` | `-o` | Save a standalone HTML report |
| `--json` | `-j` | Output raw JSON results |
| `--verbose` | `-v` | Check more links, show more detail |
| `--checks <list>` | `-c` | Run specific checks: `seo,perf,security,accessibility,links,indexing` |
| `--ci` | | CI mode — exit with code 1 on failure |
| `--min-score <n>` | | Minimum passing score for `--ci` (default: 80) |
| `--help` | `-h` | Show help |

---

## 📊 HTML Report

Generate a beautiful, standalone dark-theme HTML report:

```bash
npx sitescope https://mysite.com --output report.html
```

The report includes:
- Overall letter grade with score
- Category breakdown with individual grades
- Every check with pass/warn/fail status
- Actionable fix suggestions
- Shareable — single HTML file, no external assets

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Website Audit
on:
  push:
    branches: [main]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Run sitescope
        run: npx sitescope https://staging.yoursite.com --ci --min-score 80

      - name: Generate report
        if: always()
        run: npx sitescope https://staging.yoursite.com --output audit-report.html

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: audit-report
          path: audit-report.html
```

### GitLab CI

```yaml
audit:
  image: node:20
  script:
    - npx sitescope https://staging.yoursite.com --ci --min-score 80 --output audit-report.html
  artifacts:
    paths:
      - audit-report.html
    when: always
```

### JSON Processing

```bash
# Get the overall score programmatically
SCORE=$(npx sitescope mysite.com --json | node -e "
  let d='';process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>console.log(JSON.parse(d).overallScore))
")
echo "Score: $SCORE"
```

---

## 💻 Programmatic API

Use sitescope as a library in your Node.js projects:

```javascript
import { runAudit } from "sitescope";

const result = await runAudit("https://example.com", {
  checks: "seo,security",
  json: true,
});

console.log(result.overallScore); // 85
console.log(result.categories);   // [{ category: "SEO", score: 89, results: [...] }, ...]
```

---

## 📋 Comparison with Alternatives

| Tool | Approach | Dependencies | Speed | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **sitescope** | HTTP fetch + HTML parsing | 0 | ~3s | SEO, perf, security, a11y, links, indexing |
| **Lighthouse** | Full browser rendering | Chrome/Puppeteer | ~30s | Performance-focused |
| **seo-audit-skill** | Browser + Playwright | Playwright + SQLite | ~60s | SEO deep-dive (108 rules) |
| **site-audit-seo** | Full crawl + Lighthouse | Puppeteer + Docker | Minutes | Multi-page crawl |
| **webhint** | Browser analysis | Puppeteer | ~20s | Web standards |

**When to use sitescope:** You want a fast health check with zero setup. Perfect for CI pipelines, quick audits, and portfolio sites.

**When NOT to use sitescope:** You need full browser rendering metrics (LCP, CLS measured in-browser), multi-page crawls, or deep JavaScript-rendered content analysis. Use Lighthouse or Playwright-based tools for that.

---

## 🗺️ Roadmap

### Planned

- [ ] Custom rules config (`.sitescoperc`)
- [ ] Multi-page crawl
- [ ] Lighthouse integration (optional, opt-in)
- [ ] Watch mode for local development
- [ ] GitHub Action (`uses: omlahore/sitescope-action@v1`)
- [ ] Badge generation (`![Score](https://sitescope.dev/badge/...)`)
- [ ] PDF report export

### Completed

- [x] SEO checks (title, meta, H1, canonical, OG, alt text, structured data)
- [x] Performance checks (TTFB, page size, render-blocking scripts, lazy loading)
- [x] Security header checks (HTTPS, HSTS, CSP, XFO, XCTO, Referrer-Policy, Permissions-Policy)
- [x] Accessibility checks (lang, viewport, charset, headings, favicon)
- [x] Broken link detection
- [x] robots.txt and sitemap.xml checks
- [x] `--ci --min-score <n>` flag for CI/CD gating
- [x] Beautiful terminal output with letter grades
- [x] Standalone HTML report export
- [x] JSON output for CI/CD
- [x] Zero dependencies — Node.js built-ins only

Contributions and feature requests welcome! [Open an issue](https://github.com/omlahore/sitescope/issues) to discuss.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and create your branch from `main`.
2. **Clone and run** — no `npm install` needed for the core tool:
   ```bash
   git clone https://github.com/omlahore/sitescope.git
   cd sitescope
   node bin/cli.js https://example.com
   ```
3. Make your changes and add tests.
4. **Open a Pull Request** with a clear description.

### Project Structure

```
sitescope/
├── bin/cli.js              # CLI entry point
├── public/
│   ├── logo.svg            # Project logo
│   └── screenshot.svg      # Terminal output preview
├── src/
│   ├── index.js            # Main orchestrator
│   ├── config.js           # Thresholds and constants
│   ├── checks/
│   │   ├── seo.js          # SEO audit checks
│   │   ├── performance.js  # Performance checks
│   │   ├── security.js     # Security header checks
│   │   ├── accessibility.js # Accessibility checks
│   │   ├── links.js        # Broken link checker
│   │   └── indexing.js     # robots.txt & sitemap checks
│   ├── reporters/
│   │   ├── terminal.js     # Terminal output
│   │   └── html.js         # HTML report generator
│   └── utils/
│       ├── colors.js       # ANSI color constants
│       ├── grading.js      # Shared grade/score logic
│       ├── fetcher.js      # HTTP client (Node built-in fetch)
│       ├── parser.js       # HTML parser (regex-based)
│       └── terminal.js     # Spinner, formatting helpers
├── package.json
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

### Adding a New Check

1. Create or edit a file in `src/checks/`
2. Return `{ category: string, results: Array<{ id, status, label, detail }> }`
3. `status` must be `"pass"`, `"warn"`, or `"fail"`
4. Register in `src/index.js`

### Rules

- **Zero runtime dependencies.** This is a hard rule. Node.js 18+ built-ins only.
- **Keep it fast.** Audits complete in under 10 seconds for most sites.
- **Be opinionated.** Every check should matter. Don't add noise.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## ⭐ Star History

If you find sitescope useful, consider giving it a star — it helps others discover the project!

[![Star History Chart](https://api.star-history.com/svg?repos=omlahore/sitescope&type=Date)](https://star-history.com/#omlahore/sitescope&Date)

---

## 📜 License

MIT © [Om Lahorey](https://omlahore.com)

