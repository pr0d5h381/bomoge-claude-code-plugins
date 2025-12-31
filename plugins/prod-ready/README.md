# prod-ready

Comprehensive production readiness checker for Claude Code. Analyzes applications across 9 critical categories before public release.

## Features

- **9 Category Analysis**: Security, Code Quality, UI/UX, Functionality, Performance, SEO & Legal, Infrastructure, Responsiveness, Accessibility
- **Severity Classification**: Critical, Warning, Info levels
- **Scoring System**: Percentage scores per category and overall
- **Actionable Reports**: Specific file locations, line numbers, and fix instructions
- **Framework Detection**: Auto-detects tech stack (Next.js, React, Vue, Django, etc.)
- **Fix Assistance**: Offers to fix found issues after presenting report

## Installation

### From Marketplace
```bash
claude plugin install bomoge-claude-code-plugins/prod-ready
```

### Manual Installation
Copy to your plugins directory:
```bash
cp -r prod-ready ~/.claude/plugins/
```

## Usage

### Command
```bash
/prod-ready
```

The command will:
1. Ask about analysis scope (full app, specific path, or categories)
2. Detect your framework
3. Analyze selected categories
4. Generate comprehensive report
5. Offer to fix found issues

### Agent
The `prod-ready-checker` agent activates automatically when you ask:
- "Is my app ready for production?"
- "Can you check if everything is ok before I deploy?"
- "Audit my app before release"
- "What am I missing before launch?"

## Categories

| Category | What it checks |
|----------|----------------|
| Security | Hardcoded secrets, XSS, SQL injection, auth issues |
| Code Quality | Build errors, console.logs, TODO comments, types |
| UI/UX | Loading states, error states, empty states, 404 pages |
| Functionality | Broken links, API endpoints, form submissions |
| Performance | Bundle size, images, code splitting, caching |
| SEO & Legal | robots.txt, meta tags, privacy policy, terms |
| Infrastructure | Env vars, CORS, logging, CI/CD |
| Responsiveness | Viewport, breakpoints, touch targets |
| Accessibility | ARIA, keyboard nav, contrast, alt text |

## Scoring

- **100-90%**: READY - Good to launch
- **89-70%**: NEEDS WORK - Fix critical issues first
- **69-0%**: NOT READY - Significant work required

Deductions:
- Critical issue: -20%
- Warning: -5%
- Info: -1%

## Report Format

```
═══════════════════════════════════════════════════════════════
                 PRODUCTION READINESS REPORT
═══════════════════════════════════════════════════════════════
Project: my-app
Framework: nextjs, react, typescript
Analyzed: 2024-12-31
───────────────────────────────────────────────────────────────
                      OVERALL SCORE: 78%
                        NEEDS WORK
───────────────────────────────────────────────────────────────

[Category breakdown table]
[Critical issues with locations]
[Warnings with locations]
[Info/suggestions]
[Checklist summary]
[Recommendations]
```

## Author

Bomoge ([@pr0d5h381](https://github.com/pr0d5h381))

## License

MIT
