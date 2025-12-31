---
name: prod-ready
description: Comprehensive production readiness check - analyzes security, code quality, UI/UX, functionality, performance, SEO, infrastructure, responsiveness, and accessibility
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - TodoWrite
argument-hint: "[scope: all | path | category]"
---

# Production Readiness Check

You are performing a comprehensive production readiness audit. Your goal is to analyze the application and generate a detailed report with actionable findings.

## Step 0: Scope Selection

First, ask the user about the analysis scope using AskUserQuestion:

```
Question: "Jaki zakres analizy production readiness?"
Header: "Scope"
Options:
1. "Cala aplikacja" - Full project analysis
2. "Konkretna sciezka" - Specific directory/path
3. "Wybrane kategorie" - Select specific categories
4. "Wlasna sciezka" - Custom path input
```

If user selects specific path options, ask for the path.

If user selects "Wybrane kategorie", show category selection:
```
Question: "Ktore kategorie przeanalizowac?"
Header: "Categories"
MultiSelect: true
Options:
1. "Security" - Bezpieczenstwo
2. "Code Quality" - Jakosc kodu
3. "UI/UX" - Kompletnosc interfejsu
4. "Functionality" - Funkcjonalnosc
5. "Performance" - Wydajnosc
6. "SEO & Legal" - SEO i strony prawne
7. "Infrastructure" - Infrastruktura
8. "Responsiveness" - Responsywnosc
9. "Accessibility" - Dostepnosc
```

## Step 1: Framework Detection

Detect the project's technology stack:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/detect-framework.sh .
```

Also check:
- `package.json` for dependencies
- Configuration files (next.config.js, vite.config.ts, etc.)
- Project structure

## Step 2: Analysis by Category

For each selected category, perform thorough analysis:

### Security Analysis
Search for:
- Hardcoded secrets: `grep -rn "password\|api[_-]?key\|secret\|token" --include="*.{ts,tsx,js,jsx}"`
- Exposed env vars in client code
- SQL injection patterns
- XSS vulnerabilities (innerHTML, unsafe HTML rendering)
- Missing authentication on routes
- Insecure cookie settings

### Code Quality Analysis
Check for:
- Build errors: `npm run build` or `tsc --noEmit`
- Console.log statements: `grep -rn "console\.log" --include="*.{ts,tsx,js,jsx}" src/`
- TODO/FIXME comments: `grep -rn "TODO\|FIXME\|HACK" --include="*.{ts,tsx,js,jsx}" src/`
- Unused imports and variables
- Empty catch blocks
- Type errors

### UI/UX Completeness
Look for:
- Loading states in components (isLoading, loading, Skeleton)
- Error handling (error boundaries, error states)
- Empty states for lists
- 404 and error pages
- Form validation feedback
- Confirmation dialogs for destructive actions

### Functionality
Check:
- All routes are accessible
- API endpoints respond correctly
- Forms submit properly
- Links are not broken
- Feature flags cleaned up

### Performance
Analyze:
- Bundle size (check build output)
- Image optimization (WebP, lazy loading)
- Code splitting implementation
- Heavy dependencies
- Caching headers

### SEO & Legal
Verify:
- robots.txt exists and is correct
- sitemap.xml exists
- Meta tags on all pages (title, description, OG)
- Legal pages exist (privacy, terms, cookies)
- Canonical URLs set
- Structured data (JSON-LD)

### Infrastructure
Check:
- Environment variables documented
- CORS configuration
- Error logging setup
- Production config ready
- CI/CD pipeline

### Responsiveness
Look for:
- Viewport meta tag
- Responsive utilities usage
- Mobile breakpoints
- Touch-friendly targets

### Accessibility
Verify:
- Alt text on images
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast
- Focus indicators

## Step 3: Score Calculation

For each category, calculate a score:
- Start at 100%
- Critical issue: -20%
- Warning: -5%
- Info: -1%
- Minimum: 0%

Overall score = Average of all category scores

## Step 4: Report Generation

Generate a formatted report with sections:
1. Header with project info, framework, date
2. Overall score with status (READY / NEEDS WORK / NOT READY)
3. Category breakdown table with scores
4. Critical issues list with locations and fixes
5. Warnings list with locations and fixes
6. Info/suggestions list
7. Checklist summary per category
8. Recommendations for fix priority

## Step 5: Fix Offer

After presenting the report, ask if user wants to fix issues:

```
Question: "Czy chcesz naprawic znalezione problemy?"
Header: "Fix"
Options:
1. "Wszystkie krytyczne" - Fix all critical issues
2. "Wszystkie" - Fix everything
3. "Wybrane kategorie" - Select categories to fix
4. "Nie, tylko raport" - Report only
```

If fixing, use TodoWrite to track progress and fix issues systematically.

## Important Guidelines

1. Be thorough - check every file in the scope
2. Be specific - provide exact file paths and line numbers
3. Be actionable - give clear fix instructions
4. Be fair - calculate scores objectively
5. Don't fix without asking - present report first, then offer to fix
