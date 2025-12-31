# Meta Tags Reference

Complete reference for HTML meta tags that impact SEO.

## Essential Meta Tags

### Title Tag

The most important on-page SEO element.

**Requirements:**
- Length: 50-60 characters (Google truncates at ~60)
- Unique per page
- Include primary keyword near the beginning
- Include brand name (usually at end)

**Format:** `Primary Keyword - Secondary Info | Brand`

**Examples:**
```html
<!-- Good -->
<title>iPhone 15 Pro Max - 256GB Space Black | Apple Store</title>
<title>Best Running Shoes for Marathon Training 2024 | RunnerWorld</title>

<!-- Bad -->
<title>Home</title>
<title>Apple Store - iPhone - Buy Now - Best Prices - Free Shipping - Apple</title>
```

**Framework Implementations:**

Next.js App Router:
```typescript
export const metadata: Metadata = {
  title: 'Page Title | Brand',
  // Or with template
  title: {
    template: '%s | Brand',
    default: 'Brand - Tagline',
  },
};
```

Nuxt 3:
```typescript
useSeoMeta({
  title: 'Page Title | Brand',
});
// Or in nuxt.config.ts for global template
```

### Meta Description

Appears in search results under the title.

**Requirements:**
- Length: 150-160 characters
- Unique per page
- Include call-to-action
- Include primary keyword naturally
- Compelling and click-worthy

**Examples:**
```html
<!-- Good -->
<meta name="description" content="Shop the new iPhone 15 Pro Max with titanium design and A17 Pro chip. Free delivery, trade-in options available. Order now at Apple Store.">

<!-- Bad -->
<meta name="description" content="iPhone page">
<meta name="description" content="Buy iPhone iPhone 15 iPhone Pro iPhone Max best iPhone cheap iPhone...">
```

### Canonical URL

Tells search engines the preferred version of a page.

**Requirements:**
- Absolute URL (include https://)
- Self-referencing on original pages
- Points to original on duplicate/variant pages
- Include on every page

**Examples:**
```html
<link rel="canonical" href="https://example.com/products/iphone-15">

<!-- For paginated content -->
<link rel="canonical" href="https://example.com/blog"> <!-- All pages point to page 1 -->

<!-- For URL variations -->
<!-- https://example.com/products/iphone?color=black -->
<link rel="canonical" href="https://example.com/products/iphone">
```

### Viewport

Essential for mobile SEO.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Never use:** `maximum-scale=1` or `user-scalable=no` (accessibility issue)

### Language

Declare page language for search engines.

```html
<html lang="en">
<!-- or -->
<html lang="pl">
```

### Character Set

Always first in `<head>`:

```html
<meta charset="UTF-8">
```

## Secondary Meta Tags

### Robots

Control crawler behavior:

```html
<!-- Default (index and follow) -->
<meta name="robots" content="index, follow">

<!-- Don't index but follow links -->
<meta name="robots" content="noindex, follow">

<!-- Don't index or follow -->
<meta name="robots" content="noindex, nofollow">

<!-- Additional directives -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
```

**Common Directives:**
- `index/noindex` - Allow/prevent indexing
- `follow/nofollow` - Follow/ignore links
- `max-snippet:N` - Limit snippet length (-1 = no limit)
- `max-image-preview:large` - Allow large image previews
- `noarchive` - Don't show cached version
- `noimageindex` - Don't index images

### Author

```html
<meta name="author" content="Author Name">
```

### Keywords (Deprecated)

Google ignores this, but some other engines may use it:

```html
<meta name="keywords" content="keyword1, keyword2"> <!-- Not recommended -->
```

## Link Tags for SEO

### Favicon

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Preconnect (Performance)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.example.com">
```

### Alternate Languages

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="pl" href="https://example.com/pl/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

### RSS/Atom Feeds

```html
<link rel="alternate" type="application/rss+xml" title="Blog RSS" href="/feed.xml">
```

## Common Issues

| Issue | Severity | Detection | Fix |
|-------|----------|-----------|-----|
| Missing title | 🔴 | No `<title>` tag | Add title tag |
| Duplicate titles | 🔴 | Same title on multiple pages | Make unique |
| Title too long | 🟡 | >60 characters | Shorten |
| Title too short | 🟡 | <30 characters | Add detail |
| Missing description | 🔴 | No meta description | Add description |
| Description too long | 🟡 | >160 characters | Shorten |
| Description too short | 🟡 | <70 characters | Expand |
| Missing canonical | 🔴 | No canonical tag | Add canonical |
| Wrong canonical | 🔴 | Points to wrong URL | Fix URL |
| Missing viewport | 🔴 | No viewport meta | Add viewport |
| Missing lang | 🟡 | No lang attribute | Add to html tag |

## Next.js Metadata API Reference

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Basic
  title: 'Page Title',
  description: 'Page description',

  // Title template
  title: {
    template: '%s | Brand',
    default: 'Default Title',
    absolute: 'Absolute Title', // Ignores template
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  // Canonical
  alternates: {
    canonical: 'https://example.com/page',
    languages: {
      'en': 'https://example.com/en/page',
      'pl': 'https://example.com/pl/page',
    },
  },

  // Other
  authors: [{ name: 'Author' }],
  generator: 'Next.js',
  keywords: ['keyword1', 'keyword2'],
  creator: 'Creator Name',
  publisher: 'Publisher Name',
};
```

## Nuxt 3 useSeoMeta Reference

```typescript
useSeoMeta({
  title: 'Page Title',
  description: 'Page description',
  robots: 'index, follow',
  author: 'Author Name',

  // Canonical via useHead
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://example.com/page' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});
```
