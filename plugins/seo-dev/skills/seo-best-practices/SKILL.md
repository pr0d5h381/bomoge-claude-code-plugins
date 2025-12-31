---
name: SEO Best Practices
description: This skill should be used when the user asks to "analyze SEO", "check SEO", "improve SEO", "audit SEO", "fix SEO issues", "add meta tags", "optimize for search engines", "improve search ranking", "add structured data", "check OpenGraph tags", "optimize images for SEO", "improve page speed", "check sitemap", "analyze robots.txt", or mentions SEO, search engine optimization, meta descriptions, or rich snippets.
version: 1.0.0
---

# SEO Best Practices

Comprehensive SEO analysis and optimization guidance for web applications. This skill enables thorough SEO audits across 15+ categories with actionable recommendations.

## Overview

SEO (Search Engine Optimization) improves website visibility in search engine results. Modern SEO encompasses technical optimization, content quality, user experience, and structured data. This skill provides framework-aware analysis for Next.js, Nuxt, SvelteKit, and other modern web frameworks.

## Framework Detection

Before analysis, detect the framework from package.json:

| Framework | Detection | SEO Patterns |
|-----------|-----------|--------------|
| **Next.js** | `next` in dependencies | App Router metadata API, generateMetadata, head.js |
| **Nuxt** | `nuxt` in dependencies | useHead, useSeoMeta, nuxt.config.ts |
| **SvelteKit** | `@sveltejs/kit` | +page.js load, svelte:head |
| **Remix** | `@remix-run/*` | meta export, MetaFunction |
| **Astro** | `astro` | frontmatter, Astro.props |
| **Plain React** | `react` only | react-helmet, react-helmet-async |

## SEO Categories

### Severity Levels

- 🔴 **Critical**: Major SEO issues that significantly harm rankings
- 🟡 **Warning**: Recommended improvements for better SEO
- 🟢 **Opportunity**: Nice-to-have enhancements for competitive advantage

### Category Overview

| Category | Key Checks | Reference |
|----------|------------|-----------|
| Meta & Head | Title, description, canonical, viewport | `references/meta-tags.md` |
| OpenGraph | OG tags, Twitter cards, social images | `references/social-meta.md` |
| Structured Data | JSON-LD, Schema.org, rich snippets | `references/structured-data.md` |
| Technical SEO | Sitemap, robots.txt, HTTPS | `references/technical-seo.md` |
| Images | Alt texts, lazy loading, formats | `references/images-seo.md` |
| URLs | Structure, slugs, trailing slashes | `references/urls-seo.md` |
| Content | Headings, keywords, readability | `references/content-seo.md` |
| Links | Internal linking, anchors, broken links | `references/links-seo.md` |
| Performance | Core Web Vitals, render blocking | `references/performance-seo.md` |
| Mobile | Responsive, touch targets, viewport | `references/mobile-seo.md` |
| Accessibility | ARIA, semantic HTML | `references/accessibility-seo.md` |
| i18n | hreflang, language alternates | `references/i18n-seo.md` |
| Indexing | Noindex, crawl budget, duplicates | `references/indexing-seo.md` |

## Analysis Workflow

### Step 1: Gather Context

1. Detect framework from package.json
2. Identify page/route structure
3. Find existing SEO implementations
4. Check for SEO-related packages (next-seo, nuxt-seo, etc.)

### Step 2: Scan All Categories

For each category, search for:
- Existing implementations (what's done well)
- Missing elements (what's absent)
- Incorrect implementations (what needs fixing)
- Enhancement opportunities (what could be better)

### Step 3: Classify Findings

Assign severity to each finding:

**🔴 Critical Examples:**
- Missing title tags
- No meta description
- Missing canonical URLs
- No alt text on key images
- Blocked by robots.txt incorrectly
- Missing sitemap.xml
- Duplicate content without canonicals

**🟡 Warning Examples:**
- Title too long (>60 chars) or short (<30 chars)
- Description too long (>160 chars) or short (<70 chars)
- Missing OpenGraph tags
- Images without lazy loading
- No structured data
- Poor heading hierarchy

**🟢 Opportunity Examples:**
- Add FAQ schema for FAQ pages
- Add breadcrumb schema
- Implement hreflang for i18n
- Add Twitter card images
- Optimize image formats to WebP
- Add internal linking strategy

### Step 4: Present Findings

Group findings by category and present with:
1. Category name and finding count
2. Severity breakdown per category
3. Specific issues with file locations
4. Recommended fixes

### Step 5: User Selection

Present multiselect interface:
1. First level: Select categories to fix
2. Second level: Optionally drill into individual items
3. Confirm selections before implementing

### Step 6: Implement Fixes

For each selected fix:
1. Show the change being made
2. Implement using appropriate framework patterns
3. Verify the fix doesn't break existing code
4. Move to next fix

## Quick Reference: Essential Checks

### Meta Tags (Every Page)

```html
<title>Page Title (50-60 chars) | Brand</title>
<meta name="description" content="150-160 char description">
<link rel="canonical" href="https://example.com/page">
<meta name="viewport" content="width=device-width, initial-scale=1">
<html lang="en">
```

### OpenGraph (Social Sharing)

```html
<meta property="og:title" content="Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### Structured Data (Rich Snippets)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Description"
}
</script>
```

### Images

```html
<img
  src="image.webp"
  alt="Descriptive alt text"
  loading="lazy"
  width="800"
  height="600"
>
```

## Framework-Specific Patterns

### Next.js (App Router)

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
  },
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `Product: ${params.slug}` };
}
```

### Nuxt 3

```typescript
// pages/index.vue
useSeoMeta({
  title: 'Page Title',
  description: 'Description',
  ogTitle: 'OG Title',
  ogDescription: 'OG Description',
  ogImage: '/og-image.jpg',
});
```

### SvelteKit

```svelte
<script>
  export const prerender = true;
</script>

<svelte:head>
  <title>Page Title</title>
  <meta name="description" content="Description">
</svelte:head>
```

## Common Issues & Fixes

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing title | 🔴 | Add title tag or metadata export |
| Missing description | 🔴 | Add meta description |
| No canonical | 🔴 | Add canonical URL |
| Missing alt text | 🔴 | Add descriptive alt to images |
| No OG tags | 🟡 | Add OpenGraph meta tags |
| No structured data | 🟡 | Add JSON-LD schema |
| Images not lazy | 🟡 | Add loading="lazy" |
| No sitemap | 🟡 | Generate sitemap.xml |
| Title too long | 🟡 | Shorten to <60 chars |
| No hreflang | 🟢 | Add language alternates |
| No breadcrumbs | 🟢 | Add BreadcrumbList schema |

## Leveraging Existing Strengths

When analyzing, identify what the project does well and suggest amplification:

- **Strong content?** → Add FAQ schema, optimize headings
- **Good images?** → Add alt texts, implement WebP, add image sitemaps
- **Clean URLs?** → Add canonical tags, implement breadcrumbs
- **Fast loading?** → Highlight in structured data, add performance hints
- **Multilingual?** → Implement proper hreflang tags

## Additional Resources

### Reference Files

For detailed patterns and requirements, consult:

- **`references/meta-tags.md`** - Complete meta tag reference
- **`references/social-meta.md`** - OpenGraph and Twitter cards
- **`references/structured-data.md`** - JSON-LD schemas
- **`references/technical-seo.md`** - Sitemap, robots.txt, HTTPS
- **`references/images-seo.md`** - Image optimization
- **`references/urls-seo.md`** - URL structure best practices
- **`references/content-seo.md`** - Content optimization
- **`references/links-seo.md`** - Internal linking strategy
- **`references/performance-seo.md`** - Core Web Vitals
- **`references/mobile-seo.md`** - Mobile optimization
- **`references/accessibility-seo.md`** - Accessibility for SEO
- **`references/i18n-seo.md`** - Internationalization
- **`references/indexing-seo.md`** - Crawling and indexing

### Scripts

- **`scripts/detect-framework.sh`** - Detect web framework
- **`scripts/scan-meta-tags.sh`** - Scan for meta tags in codebase

## Output Format

Present findings as actionable todo list:

```
## SEO Audit Results

### 🔴 Critical (3 issues)
- [ ] **Meta**: Missing title tag in `app/products/[id]/page.tsx`
- [ ] **Meta**: No canonical URL on product pages
- [ ] **Images**: 12 images missing alt text in `components/`

### 🟡 Warning (5 issues)
- [ ] **OpenGraph**: Missing OG tags on 8 pages
- [ ] **Structured Data**: No Product schema on product pages
- [ ] **Technical**: No sitemap.xml found
- [ ] **Images**: Images not using lazy loading
- [ ] **Content**: H1 missing on homepage

### 🟢 Opportunity (4 suggestions)
- [ ] **Structured Data**: Add FAQ schema to FAQ page
- [ ] **Structured Data**: Add BreadcrumbList for navigation
- [ ] **i18n**: Implement hreflang for Polish/English
- [ ] **Performance**: Convert images to WebP format

---
Select categories or individual items to fix:
```

This format enables users to select what to improve and track progress.
