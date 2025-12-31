---
name: seo
description: Run comprehensive SEO audit and fix issues
argument-hint: "[category1,category2,...]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash
  - AskUserQuestion
  - TodoWrite
---

# SEO Audit Command

Perform a comprehensive SEO audit of the current project and provide actionable improvements.

## Arguments

- No arguments: Full audit of all SEO categories
- Category names (comma-separated): Audit specific categories only

**Categories:** `meta`, `opengraph`, `structured-data`, `technical`, `images`, `urls`, `content`, `links`, `performance`, `mobile`, `accessibility`, `i18n`, `indexing`

**Examples:**
- `/seo` - Full audit
- `/seo meta` - Meta tags only
- `/seo meta,images` - Meta tags and images
- `/seo structured-data` - Structured data only

## Execution Steps

### Step 0: Ask About Scope

**IMPORTANT: Always start by asking the user about the scope of analysis.**

Use AskUserQuestion with these options:

**Question 1: "What would you like to analyze?"**
- **Entire project** - Scan all files in src/, app/, pages/, components/
- **Specific folder** - Analyze only a specific directory (e.g., src/app/products/)
- **Single page** - Analyze one specific page file
- **Custom** - Let user specify exactly what to analyze

**Question 2: "Which SEO categories to check?"**
- **All categories (Recommended)** - Full comprehensive audit
- **Only critical** - Meta tags, canonical, sitemap, robots
- **Specific categories** - Let user choose from the list

If user selects "Specific folder", "Single page", or "Custom" - ask follow-up:
- "Enter the path to analyze (e.g., src/app/products/ or src/app/page.tsx):"

Store the scope in a variable and use it to limit file searches in subsequent steps.

**Example interaction:**
```
🔍 SEO Audit Setup

What would you like to analyze?
○ Entire project (Recommended)
○ Specific folder
○ Single page
○ Custom path

Which SEO categories?
○ All categories (Recommended)
○ Only critical (meta, canonical, sitemap)
○ Let me choose specific categories
```

### Step 1: Detect Framework

Search for framework indicators in package.json:

| Package | Framework |
|---------|-----------|
| `next` | Next.js |
| `nuxt` | Nuxt 3 |
| `@sveltejs/kit` | SvelteKit |
| `@remix-run/*` | Remix |
| `astro` | Astro |
| `react` (only) | Plain React |

Report detected framework to user.

### Step 2: Scan Codebase

**Use the scope from Step 0 to limit file searches.**

- If **Entire project**: Search in `src/`, `app/`, `pages/`, `components/`
- If **Specific folder**: Search only in the user-specified path
- If **Single page**: Analyze only that specific file
- If **Custom**: Use the user-provided path pattern

For each requested category, scan relevant files within the scope:

| Category | File Patterns | Search Path |
|----------|---------------|-------------|
| meta | `**/page.tsx`, `**/layout.tsx`, `**/*.vue` | `{scope}` |
| opengraph | Same as meta + look for og: properties | `{scope}` |
| structured-data | Search for `application/ld+json` | `{scope}` |
| technical | `robots.txt`, `sitemap.xml`, `sitemap.ts` | Project root |
| images | `**/*.tsx`, `**/*.vue`, search for `<img` | `{scope}` |
| urls | Route structure, dynamic routes | `{scope}` |
| content | Search for `<h1`, `<h2`, heading patterns | `{scope}` |
| links | Search for `<a`, `<Link`, href patterns | `{scope}` |
| performance | Check for lazy loading, preload patterns | `{scope}` |
| mobile | Check viewport meta, responsive patterns | `{scope}` |
| accessibility | Check for aria-*, semantic HTML | `{scope}` |
| i18n | Check for hreflang, i18n config | `{scope}` |
| indexing | Check robots meta, noindex patterns | `{scope}` |

**Note:** Technical SEO (sitemap, robots.txt) is always checked at project root regardless of scope.

### Step 3: Classify Findings

For each finding, assign severity:

- 🔴 **Critical**: Major issues (missing title, no canonical, blocked pages)
- 🟡 **Warning**: Recommended fixes (missing OG tags, no structured data)
- 🟢 **Opportunity**: Enhancements (add FAQ schema, breadcrumbs)

### Step 4: Present Findings

Output findings grouped by severity, then by category:

```markdown
## SEO Audit Results for [Project Name]

**Framework:** Next.js (App Router)
**Pages scanned:** 15
**Total findings:** 23

---

### 🔴 Critical Issues (5)

#### Meta Tags
- [ ] Missing title tag in `app/products/[id]/page.tsx:1`
- [ ] No canonical URL on product pages

#### Images
- [ ] 12 images missing alt text in `components/ProductGallery.tsx`

---

### 🟡 Warnings (10)

#### OpenGraph
- [ ] Missing OG image on 8 pages
- [ ] OG description missing on blog posts

#### Structured Data
- [ ] No Product schema on product pages
- [ ] No BreadcrumbList navigation

---

### 🟢 Opportunities (8)

#### Structured Data
- [ ] Add FAQPage schema to `/faq` page
- [ ] Add HowTo schema to tutorial pages

#### i18n
- [ ] Implement hreflang for Polish/English versions
```

### Step 5: User Selection

Use AskUserQuestion to let user select what to fix:

**First level:** Select categories to fix
```
Which categories would you like to fix?
[ ] Meta Tags (2 critical, 1 warning)
[ ] Images (1 critical, 2 warnings)
[ ] OpenGraph (3 warnings)
[ ] Structured Data (4 opportunities)
...
```

**Second level (optional):** If user selects a category, offer to drill into specific items.

### Step 6: Implement Fixes

For each selected item:

1. Show what will be changed
2. Make the change using Edit or Write
3. Confirm completion
4. Move to next item

Use TodoWrite to track progress through fixes.

### Framework-Specific Implementations

**Next.js (App Router):**
- Use Metadata API for meta tags
- Use generateMetadata for dynamic pages
- Create sitemap.ts and robots.ts

**Nuxt 3:**
- Use useSeoMeta composable
- Use useHead for additional tags
- Configure in nuxt.config.ts

**SvelteKit:**
- Use svelte:head for meta tags
- Create hooks for dynamic pages

## Tips

- Start with Critical issues - they have the most impact
- Product/category pages often need Product schema
- FAQ pages benefit from FAQPage schema
- Always add alt text to product images
- Use canonical URLs to prevent duplicate content
- Test with Google Rich Results Test after adding structured data

## Related Skill

Load the `seo-best-practices` skill for detailed reference on each category.
