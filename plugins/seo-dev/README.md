# SEO Dev Plugin

Comprehensive SEO analysis and optimization plugin for Claude Code. Helps developers identify, prioritize, and fix SEO issues in their web applications.

## Features

- **Full SEO Audit**: Analyzes 15+ SEO categories including meta tags, structured data, images, URLs, and more
- **Severity Levels**: Issues marked as 🔴 Critical, 🟡 Warning, or 🟢 Opportunity
- **Interactive Fixes**: Choose categories or individual items to fix via multiselect
- **Framework Detection**: Auto-detects Next.js, Nuxt, SvelteKit, and other frameworks
- **Proactive Suggestions**: Reminds about SEO after creating new pages

## Installation

The plugin is installed at `~/.claude/plugins/seo-dev`.

To use in a specific project, create a symlink:
```bash
ln -s ~/.claude/plugins/seo-dev /path/to/your/project/.claude-plugin
```

Or run Claude Code with:
```bash
claude --plugin-dir ~/.claude/plugins/seo-dev
```

## Usage

### Command: `/seo`

Run a full SEO audit:
```
/seo
```

Audit specific categories:
```
/seo meta
/seo images,urls
/seo structured-data
```

### Available Categories

| Category | What it checks |
|----------|----------------|
| `meta` | Title, description, canonical, viewport, charset, language |
| `opengraph` | OG tags, Twitter cards, social images |
| `structured-data` | JSON-LD, Schema.org markup, rich snippets |
| `technical` | Sitemap.xml, robots.txt, HTTPS, redirects |
| `images` | Alt texts, lazy loading, WebP, sizing, srcset |
| `urls` | Structure, slugs, hierarchy, trailing slashes |
| `content` | Headings (H1-H6), keywords, readability, length |
| `links` | Internal linking, broken links, anchor text |
| `performance` | Core Web Vitals hints, render blocking |
| `mobile` | Responsive design, touch targets, viewport |
| `accessibility` | ARIA, semantic HTML |
| `i18n` | hreflang tags, language alternates |
| `indexing` | Noindex pages, crawl budget, duplicates |

## Configuration

Create `.claude/seo-dev.local.md` in your project:

```yaml
---
# Default scopes to check (comma-separated)
default_scopes: meta,opengraph,structured-data,images

# Framework override (auto-detected if not set)
framework: nextjs

# Paths to ignore
ignore:
  - node_modules
  - .next
  - dist
  - "*.test.*"

# Minimum severity to report (critical, warning, opportunity)
min_severity: warning
---

# Project-specific SEO notes

Add any project-specific SEO requirements here.
```

## Components

- **Skill**: `seo-best-practices` - Comprehensive SEO knowledge
- **Command**: `/seo` - Main analysis and fix command
- **Agent**: `seo-analyzer` - Deep analysis agent
- **Hook**: Page creation SEO reminder

## License

MIT
