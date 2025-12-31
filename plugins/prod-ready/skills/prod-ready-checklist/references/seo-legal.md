# SEO & Legal Checklist

## Critical Checks

### robots.txt
```
# Must exist at root: /robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /panel/

Sitemap: https://example.com/sitemap.xml
```

**Check:**
- [ ] File exists at `/robots.txt`
- [ ] Allows crawling of public pages
- [ ] Blocks private/admin areas
- [ ] Points to sitemap
- [ ] No accidental `Disallow: /`

### Legal Pages
Required pages for public apps:

1. **Privacy Policy** (`/privacy`, `/polityka-prywatnosci`)
   - Data collection practices
   - Third-party services used
   - User rights (GDPR if EU)
   - Contact information

2. **Terms of Service** (`/terms`, `/regulamin`)
   - Usage terms
   - User obligations
   - Liability limitations
   - Dispute resolution

3. **Cookie Policy** (`/cookies`, `/polityka-cookies`)
   - Types of cookies used
   - Purpose of each
   - How to manage/opt-out
   - Third-party cookies

**For legal pages:**
- Add `noindex` if not meant for SEO
- Keep accessible from footer
- Include last updated date

### Sitemap
```xml
<!-- /sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

**Check:**
- [ ] Sitemap exists and is valid
- [ ] All public pages included
- [ ] No private/admin pages
- [ ] Submitted to Search Console

## Warning Checks

### Meta Tags
Every page needs:
```html
<head>
  <title>Page Title | Brand Name</title>
  <meta name="description" content="155 character description...">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="https://example.com/page">
</head>
```

**Title requirements:**
- 50-60 characters
- Unique per page
- Include primary keyword
- Brand name at end

**Description requirements:**
- 150-160 characters
- Compelling call-to-action
- Include primary keyword
- Unique per page

### OpenGraph Tags
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description for social sharing">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Brand Name">
<meta property="og:locale" content="pl_PL">
```

**OG Image requirements:**
- Minimum 1200x630px
- Max 8MB
- Include brand/text

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

### Canonical URLs
```html
<!-- Prevent duplicate content -->
<link rel="canonical" href="https://example.com/page">
```

**Check:**
- [ ] Every page has canonical
- [ ] URLs are absolute (not relative)
- [ ] No trailing slash inconsistency
- [ ] HTTPS, not HTTP

### Structured Data (JSON-LD)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
</script>
```

**Common types:**
- Organization (homepage)
- WebSite (homepage with search)
- Product (product pages)
- Article (blog posts)
- BreadcrumbList (navigation)
- FAQPage (FAQ sections)

### Heading Structure
```html
<!-- Correct hierarchy -->
<h1>Main Title</h1>         <!-- One per page -->
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

**Check:**
- [ ] One H1 per page
- [ ] Logical heading hierarchy
- [ ] No skipped levels (h1 → h3)
- [ ] Keywords in headings

## Info Checks

### Image Alt Text
```html
<img src="product.jpg" alt="Red leather wallet with gold clasp">
```

**Check:**
- [ ] All images have alt text
- [ ] Alt is descriptive (not "image1")
- [ ] Decorative images: `alt=""`

### Internal Linking
- Related content linked
- Anchor text is descriptive
- No broken internal links
- Reasonable link depth (< 3 clicks)

### URL Structure
- Descriptive slugs (`/products/red-wallet`)
- No query strings for content
- Lowercase, hyphen-separated
- No special characters

### Language Tags
```html
<html lang="pl">
<!-- or for multilingual -->
<link rel="alternate" hreflang="pl" href="https://example.com/pl/">
<link rel="alternate" hreflang="en" href="https://example.com/en/">
```

## Search Patterns

```bash
# Check for meta tags
grep -rn "<title>" --include="*.{tsx,jsx,html}"
grep -rn "description" --include="*.{tsx,jsx}" | grep "meta"

# Check for OG tags
grep -rn "og:" --include="*.{tsx,jsx}"

# Find pages without metadata
find . -name "page.tsx" -exec grep -L "metadata\|Metadata" {} \;

# Check for canonical
grep -rn "canonical" --include="*.{tsx,jsx}"
```

## Legal Compliance

### GDPR (EU)
- [ ] Cookie consent banner
- [ ] Privacy policy link in footer
- [ ] Data export capability
- [ ] Account deletion option
- [ ] Consent for marketing

### CCPA (California)
- [ ] "Do Not Sell" link
- [ ] Privacy policy updates
- [ ] Data access requests

### Accessibility (WCAG)
- Covered in accessibility.md
- Legally required in many jurisdictions
