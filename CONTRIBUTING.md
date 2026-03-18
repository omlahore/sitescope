# Contributing to sitescope

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/omlahore/sitescope.git
cd sitescope
node bin/cli.js https://example.com
```

No `npm install` needed — the project has zero dependencies.

## Project Structure

```
sitescope/
├── bin/cli.js              # CLI entry point
├── src/
│   ├── index.js            # Main orchestrator
│   ├── checks/
│   │   ├── seo.js          # SEO audit checks
│   │   ├── performance.js  # Performance checks
│   │   ├── security.js     # Security header checks
│   │   ├── accessibility.js # Accessibility checks
│   │   └── links.js        # Broken link checker
│   ├── reporters/
│   │   ├── terminal.js     # Terminal output
│   │   └── html.js         # HTML report generator
│   └── utils/
│       ├── fetcher.js      # HTTP client (Node built-in fetch)
│       ├── parser.js       # HTML parser (regex-based, no deps)
│       └── terminal.js     # Colors, spinner, formatting
├── package.json
├── README.md
└── LICENSE
```

## Adding a New Check

1. Create or edit a file in `src/checks/`
2. Each check function returns `{ category: string, results: Array }`
3. Each result has `{ id, status, label, detail }`
   - `status`: `"pass"`, `"warn"`, or `"fail"`
   - `detail`: optional explanation string
4. Register the check in `src/index.js`

## Rules

- **Zero dependencies.** Use only Node.js built-in modules. This is a hard rule.
- **Node 18+.** We use `fetch`, `parseArgs`, and ES modules.
- **Keep it fast.** Audits should complete in under 10 seconds for most sites.
- **Be opinionated.** Don't add checks that are rarely useful. Every check should matter.

## Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Test: `node bin/cli.js https://example.com`
5. Submit a PR with a clear description

## Ideas for Contributions

- New checks (web vitals, robots.txt, sitemap.xml, mixed content)
- Better HTML parsing edge cases
- PDF report export
- GitHub Action wrapper
- Badge/shield generation
- Multi-page crawl support
