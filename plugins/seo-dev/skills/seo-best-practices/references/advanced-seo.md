# Advanced SEO Reference

Mobile, Performance, i18n, Accessibility, and Indexing optimization.

## Mobile SEO

### Mobile-First Indexing

Google primarily uses mobile version for indexing. Ensure:

- Same content on mobile and desktop
- Same meta tags on both versions
- Same structured data
- Images and videos accessible on mobile

### Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Never use:** `maximum-scale=1` or `user-scalable=no`

### Mobile Usability Checks

| Check | Requirement |
|-------|-------------|
| Touch targets | Min 48x48px, 8px spacing |
| Font size | Min 16px for body text |
| Content width | Fits viewport without horizontal scroll |
| Tap delay | None (use touch-action: manipulation) |

### Responsive Design

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}
```

## Performance SEO

### Core Web Vitals

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP | ≤2.5s | 2.5-4s | >4s |
| INP | ≤200ms | 200-500ms | >500ms |
| CLS | ≤0.1 | 0.1-0.25 | >0.25 |

### LCP Optimization

- Preload hero images
- Use CDN for static assets
- Optimize server response time
- Remove render-blocking resources

```html
<!-- Preload critical resources -->
<link rel="preload" href="/hero.webp" as="image">
<link rel="preload" href="/font.woff2" as="font" crossorigin>
```

### CLS Prevention

```html
<!-- Always specify dimensions -->
<img src="image.jpg" width="800" height="600" alt="Description">

<!-- Reserve space for dynamic content -->
<div style="min-height: 200px;">
  <!-- Dynamic ad or content -->
</div>
```

### INP Optimization

- Break up long tasks
- Use web workers for heavy computation
- Defer non-critical JavaScript
- Use `requestIdleCallback` for background work

### Quick Performance Wins

```html
<!-- Preconnect to required origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Async/defer scripts -->
<script src="analytics.js" defer></script>
<script src="widget.js" async></script>
```

## Internationalization (i18n)

### hreflang Tags

Tell search engines about language/region variants:

```html
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/page">
<link rel="alternate" hreflang="pl" href="https://example.com/pl/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

### Language Codes

| Code | Language/Region |
|------|-----------------|
| en | English (generic) |
| en-US | English (US) |
| en-GB | English (UK) |
| pl | Polish |
| de | German |
| x-default | Default/fallback |

### Next.js i18n

```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'pl', 'de'],
    defaultLocale: 'en',
  },
};

// In metadata
export const metadata: Metadata = {
  alternates: {
    languages: {
      'en': 'https://example.com/en/page',
      'pl': 'https://example.com/pl/page',
    },
  },
};
```

### Best Practices

- Use x-default for language selector/homepage
- Include self-referencing hreflang
- All versions should link to all others
- Use correct language codes (ISO 639-1)
- Match hreflang to html lang attribute

## Accessibility for SEO

Accessibility improvements often benefit SEO.

### Semantic HTML

```html
<!-- Good -->
<header>...</header>
<nav>...</nav>
<main>
  <article>
    <h1>Title</h1>
    <section>...</section>
  </article>
  <aside>...</aside>
</main>
<footer>...</footer>

<!-- Bad -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="content">...</div>
```

### ARIA Landmarks

```html
<nav aria-label="Main navigation">...</nav>
<main aria-label="Main content">...</main>
<aside aria-label="Related articles">...</aside>
```

### Link Accessibility

```html
<!-- Good -->
<a href="/contact">Contact us</a>
<a href="/pdf" aria-label="Download annual report (PDF, 2MB)">
  Annual Report
</a>

<!-- Bad -->
<a href="/contact">Click here</a>
```

### Form Accessibility

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" required>
```

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Proper heading hierarchy
- [ ] Semantic HTML elements used
- [ ] Sufficient color contrast
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Form fields have labels
- [ ] Skip navigation link present

## Indexing Control

### Meta Robots

```html
<!-- Allow indexing (default) -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing -->
<meta name="robots" content="noindex, follow">

<!-- Prevent indexing and following -->
<meta name="robots" content="noindex, nofollow">
```

### X-Robots-Tag Header

For non-HTML resources:

```
X-Robots-Tag: noindex
```

### When to Use Noindex

- Thank you pages
- Search results pages
- User profile pages (unless public)
- Admin/dashboard pages
- Login/registration pages
- Duplicate content pages
- Low-value pages

### Crawl Budget Optimization

For large sites:

1. Block crawling of low-value pages in robots.txt
2. Use noindex for indexable but low-value pages
3. Fix crawl errors promptly
4. Reduce redirect chains
5. Improve page speed
6. Update sitemap regularly

### Pagination

```html
<!-- For paginated content -->
<!-- On page 1 -->
<link rel="canonical" href="https://example.com/blog">
<link rel="next" href="https://example.com/blog?page=2">

<!-- On page 2 -->
<link rel="canonical" href="https://example.com/blog?page=2">
<link rel="prev" href="https://example.com/blog">
<link rel="next" href="https://example.com/blog?page=3">
```

Or use "View All" page with canonical pointing to it.

## Issue Summary

| Category | Issue | Severity |
|----------|-------|----------|
| Mobile | No viewport meta | 🔴 |
| Mobile | Touch targets too small | 🟡 |
| Mobile | Horizontal scroll | 🟡 |
| Performance | LCP > 4s | 🔴 |
| Performance | CLS > 0.25 | 🟡 |
| i18n | Missing hreflang | 🟢 |
| i18n | Incorrect language codes | 🟡 |
| Accessibility | Missing alt text | 🔴 |
| Accessibility | Poor heading structure | 🟡 |
| Indexing | Important pages noindexed | 🔴 |
| Indexing | Thin pages indexed | 🟡 |
