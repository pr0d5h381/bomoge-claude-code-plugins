# Social Meta Tags Reference

OpenGraph and Twitter Card meta tags for social sharing optimization.

## OpenGraph Protocol

OpenGraph tags control how content appears when shared on Facebook, LinkedIn, and other platforms.

### Required Tags

```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description (up to 200 chars)">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
```

### Image Requirements

| Platform | Recommended Size | Min Size | Aspect Ratio |
|----------|-----------------|----------|--------------|
| Facebook | 1200x630 | 600x315 | 1.91:1 |
| LinkedIn | 1200x627 | 400x400 | 1.91:1 |
| Twitter | 1200x600 | 300x157 | 2:1 |

**Best Practice:** Use 1200x630 for universal compatibility.

```html
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Image description">
<meta property="og:image:type" content="image/jpeg">
```

### Additional Tags

```html
<!-- Site name -->
<meta property="og:site_name" content="Brand Name">

<!-- Locale -->
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="pl_PL">

<!-- Article specific -->
<meta property="article:published_time" content="2024-01-15T08:00:00Z">
<meta property="article:modified_time" content="2024-01-20T10:00:00Z">
<meta property="article:author" content="https://example.com/author">
<meta property="article:section" content="Technology">
<meta property="article:tag" content="SEO">
```

### Content Types

```html
<!-- Website (default) -->
<meta property="og:type" content="website">

<!-- Article/Blog post -->
<meta property="og:type" content="article">

<!-- Product -->
<meta property="og:type" content="product">

<!-- Video -->
<meta property="og:type" content="video.other">

<!-- Profile -->
<meta property="og:type" content="profile">
```

## Twitter Cards

Twitter-specific tags that enhance tweet appearance.

### Card Types

**Summary Card (small image):**
```html
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description (up to 200 chars)">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

**Summary Large Image (recommended):**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/large-image.jpg">
<meta name="twitter:image:alt" content="Image description">
```

**Player Card (video/audio):**
```html
<meta name="twitter:card" content="player">
<meta name="twitter:player" content="https://example.com/player.html">
<meta name="twitter:player:width" content="480">
<meta name="twitter:player:height" content="480">
```

### Twitter-specific Tags

```html
<!-- Site's Twitter handle -->
<meta name="twitter:site" content="@brand">

<!-- Author's Twitter handle -->
<meta name="twitter:creator" content="@author">
```

## Complete Example

```html
<!-- OpenGraph -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://example.com/blog/seo-guide">
<meta property="og:title" content="Complete SEO Guide 2024">
<meta property="og:description" content="Learn everything about SEO in this comprehensive guide. From basics to advanced techniques.">
<meta property="og:image" content="https://example.com/images/seo-guide-og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="SEO Guide 2024 cover image">
<meta property="og:site_name" content="Example Blog">
<meta property="og:locale" content="en_US">
<meta property="article:published_time" content="2024-01-15T08:00:00Z">
<meta property="article:author" content="https://example.com/author/john">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@exampleblog">
<meta name="twitter:creator" content="@johndoe">
<meta name="twitter:title" content="Complete SEO Guide 2024">
<meta name="twitter:description" content="Learn everything about SEO in this comprehensive guide.">
<meta name="twitter:image" content="https://example.com/images/seo-guide-twitter.jpg">
<meta name="twitter:image:alt" content="SEO Guide 2024">
```

## Framework Implementations

### Next.js App Router

```typescript
export const metadata: Metadata = {
  openGraph: {
    type: 'article',
    url: 'https://example.com/blog/post',
    title: 'Article Title',
    description: 'Article description',
    siteName: 'Site Name',
    images: [
      {
        url: 'https://example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Image alt text',
      },
    ],
    locale: 'en_US',
    publishedTime: '2024-01-15T08:00:00Z',
    authors: ['Author Name'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brand',
    creator: '@author',
    title: 'Article Title',
    description: 'Article description',
    images: ['https://example.com/twitter-image.jpg'],
  },
};
```

### Nuxt 3

```typescript
useSeoMeta({
  // OpenGraph
  ogType: 'article',
  ogUrl: 'https://example.com/blog/post',
  ogTitle: 'Article Title',
  ogDescription: 'Article description',
  ogImage: 'https://example.com/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogSiteName: 'Site Name',
  ogLocale: 'en_US',

  // Twitter
  twitterCard: 'summary_large_image',
  twitterSite: '@brand',
  twitterCreator: '@author',
  twitterTitle: 'Article Title',
  twitterDescription: 'Article description',
  twitterImage: 'https://example.com/twitter-image.jpg',
});
```

## Common Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing OG image | 🟡 | Add og:image with 1200x630 image |
| OG image too small | 🟡 | Use minimum 600x315, prefer 1200x630 |
| Missing OG title | 🟡 | Add og:title matching page title |
| Missing OG description | 🟡 | Add og:description |
| No Twitter card | 🟢 | Add twitter:card meta |
| Missing image alt | 🟢 | Add og:image:alt and twitter:image:alt |
| HTTP image URL | 🟡 | Use HTTPS for all image URLs |
| Relative image URL | 🔴 | Use absolute URLs for images |

## Testing Tools

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Inspector:** https://www.linkedin.com/post-inspector/
- **OpenGraph.xyz:** https://www.opengraph.xyz/
