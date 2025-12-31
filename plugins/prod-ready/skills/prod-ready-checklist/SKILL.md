# Production Readiness Checklist

This skill provides comprehensive knowledge for analyzing application readiness for production release. It covers 9 critical categories with severity-based issue classification.

## When to Use

This skill should be used when the user asks to "check production readiness", "verify app is ready for launch", "audit before release", "production checklist", "launch readiness", "pre-release check", "is my app ready for production", or needs guidance on what to verify before deploying to production.

## Analysis Categories

Production readiness analysis covers 9 categories, each with specific checks:

### 1. Security (references/security.md)
- Hardcoded secrets, API keys, passwords in code
- SQL injection, XSS, CSRF vulnerabilities
- Authentication and authorization implementation
- HTTPS enforcement, secure cookies
- Input validation and sanitization
- Dependency vulnerabilities (npm audit, etc.)

### 2. Code Quality (references/code-quality.md)
- TypeScript/build errors and warnings
- Console.log/debug statements left in code
- TODO/FIXME/HACK comments
- Unused imports, variables, functions
- Error handling completeness
- Code duplication

### 3. UI/UX Completeness (references/ui-ux.md)
- Loading states for async operations
- Error states and error boundaries
- Empty states for lists/data
- 404 and error pages
- Form validation feedback
- Confirmation dialogs for destructive actions

### 4. Functionality (references/functionality.md)
- Broken links and routes
- Form submissions working
- API endpoints responding
- Edge cases handled
- User flows complete
- Feature flags cleaned up

### 5. Performance (references/performance.md)
- Bundle size optimization
- Image optimization (WebP, lazy loading)
- Code splitting and lazy loading
- Caching strategies
- Database query optimization
- Third-party script loading

### 6. SEO & Legal (references/seo-legal.md)
- Meta tags (title, description, OG, Twitter)
- robots.txt and sitemap.xml
- Canonical URLs
- Legal pages (Privacy Policy, Terms, Cookies)
- Structured data (JSON-LD)
- Accessibility for crawlers

### 7. Infrastructure (references/infrastructure.md)
- Environment variables documented
- Production env vars set
- CORS configuration
- Rate limiting
- Error logging/monitoring setup
- Backup and recovery plan
- CI/CD pipeline

### 8. Responsiveness (references/responsiveness.md)
- Mobile breakpoints (< 640px)
- Tablet breakpoints (640px - 1024px)
- Desktop layouts
- Touch-friendly interactions
- Viewport meta tag
- Responsive images

### 9. Accessibility (references/accessibility.md)
- ARIA labels and roles
- Keyboard navigation
- Color contrast (WCAG AA)
- Alt text for images
- Focus indicators
- Screen reader compatibility

## Severity Classification

### Critical (Must Fix Before Launch)
- Security vulnerabilities (XSS, SQL injection, exposed secrets)
- Build/compilation errors
- Missing legal pages (privacy policy, terms)
- Broken core functionality
- Missing robots.txt (for crawlability)
- Authentication bypass

### Warning (Should Fix)
- Missing loading/error states
- Console.log statements
- TODO comments in production code
- Missing meta tags
- Poor accessibility
- Performance issues
- Missing error boundaries

### Info (Nice to Have)
- Code style improvements
- Additional optimizations
- Enhanced UX patterns
- Documentation gaps
- Test coverage

## Output Format

Generate a comprehensive report with:

```
═══════════════════════════════════════════════════════════════
                 PRODUCTION READINESS REPORT
═══════════════════════════════════════════════════════════════
Project: [name]
Framework: [detected]
Analyzed: [timestamp]
───────────────────────────────────────────────────────────────
                      OVERALL SCORE: XX%
              [READY / NEEDS WORK / NOT READY]
───────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                    CATEGORY BREAKDOWN                        │
├─────────────────────────┬────────┬─────────────────────────-─┤
│ Category                │ Score  │ Status                    │
├─────────────────────────┼────────┼──────────────────────────-┤
│ Security                │  XX%   │ X critical, X warnings    │
│ Code Quality            │  XX%   │ X warnings                │
│ UI/UX Completeness      │  XX%   │ X warnings                │
│ Functionality           │  XX%   │ X warnings                │
│ Performance             │  XX%   │ X warnings                │
│ SEO & Legal             │  XX%   │ X critical, X warnings    │
│ Infrastructure          │  XX%   │ X warnings                │
│ Responsiveness          │  XX%   │ X warnings                │
│ Accessibility           │  XX%   │ X warnings                │
└─────────────────────────┴────────┴──────────────────────────-┘

═══════════════════════════════════════════════════════════════
                     CRITICAL ISSUES (X)
═══════════════════════════════════════════════════════════════
[CATEGORY] Issue description
  Location: file:line
  Fix: Recommended action

═══════════════════════════════════════════════════════════════
                       WARNINGS (X)
═══════════════════════════════════════════════════════════════
[CATEGORY] Issue description
  Location: file:line
  Fix: Recommended action

═══════════════════════════════════════════════════════════════
                    CHECKLIST SUMMARY
═══════════════════════════════════════════════════════════════
Security:
  [x] No hardcoded secrets
  [ ] HTTPS enforced
  ...

Code Quality:
  [x] Build passes
  [ ] No console.logs
  ...
```

## Analysis Process

1. **Detect Framework**: Run detect-framework.sh to identify tech stack
2. **Scope Selection**: Ask user for analysis scope (full, specific path, category)
3. **Static Analysis**: Analyze files without running the application
4. **Issue Collection**: Gather all issues with severity classification
5. **Score Calculation**: Calculate percentage for each category
6. **Report Generation**: Generate formatted report
7. **Fix Suggestions**: Offer to fix issues with user selection

## Score Calculation

Per category:
- Start at 100%
- Critical issue: -20% each
- Warning: -5% each
- Info: -1% each
- Minimum: 0%

Overall score: Average of all 9 categories

**Thresholds:**
- 90-100%: READY - Good to launch
- 70-89%: NEEDS WORK - Fix critical issues first
- 0-69%: NOT READY - Significant work required

## Framework-Specific Checks

Adapt checks based on detected framework:
- **Next.js**: Check next.config.js, API routes, SSR/SSG patterns
- **React**: Check component patterns, hooks usage, state management
- **Vue/Nuxt**: Check nuxt.config, composables, Vuex/Pinia
- **Express/Node**: Check middleware, routes, error handling
- **Django/Flask**: Check views, templates, security middleware
- **General**: Apply universal checks for all projects

See references/ directory for detailed checklists per category.
