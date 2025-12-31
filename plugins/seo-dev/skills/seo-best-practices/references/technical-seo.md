# Technical SEO Reference

Sitemap, robots.txt, HTTPS, and other technical SEO elements.

## Sitemap.xml

Helps search engines discover and crawl pages.

### Basic Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Sitemap Index (for large sites)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

### Image Sitemap

```xml
<url>
  <loc>https://example.com/product</loc>
  <image:image>
    <image:loc>https://example.com/product.jpg</image:loc>
    <image:title>Product Name</image:title>
    <image:caption>Product description</image:caption>
  </image:image>
</url>
```

### Next.js Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

// For dynamic routes
export default async function sitemap(): MetadataRoute.Sitemap {
  const products = await getProducts();

  const productUrls = products.map((product) => ({
    url: `https://example.com/products/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  return [
    { url: 'https://example.com', lastModified: new Date() },
    ...productUrls,
  ];
}
```

### Best Practices

- Maximum 50,000 URLs per sitemap
- Maximum 50MB uncompressed size
- Use sitemap index for larger sites
- Include only canonical URLs
- Update lastmod when content changes
- Submit to Google Search Console

## Robots.txt

Controls crawler access to site.

### Location

Must be at root: `https://example.com/robots.txt`

### Basic Format

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Sitemap location
Sitemap: https://example.com/sitemap.xml
```

### Common Patterns

```
# Block all crawlers
User-agent: *
Disallow: /

# Allow all crawlers
User-agent: *
Allow: /

# Block specific crawler
User-agent: Googlebot
Disallow: /private/

# Block crawling but allow indexing (via links)
User-agent: *
Disallow: /thank-you/

# Crawl delay (not respected by Google)
User-agent: *
Crawl-delay: 10
```

### Next.js Robots

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### What to Block

- Admin areas: `/admin/`, `/dashboard/`
- API endpoints: `/api/`
- Authentication pages: `/login/`, `/register/`
- Thank you pages: `/thank-you/`
- Search results: `/search?`
- Pagination parameters: `/*?page=`
- Session/cart pages: `/cart/`, `/checkout/`
- Development files: `/_next/`, `/static/`

### What NOT to Block

- CSS/JS files (Google needs them for rendering)
- Images (unless you don't want image search traffic)
- Main content pages
- Product/category pages

## HTTPS

Essential for SEO and security.

### Check Points

- [ ] Site redirects HTTP to HTTPS
- [ ] All internal links use HTTPS
- [ ] All resources (images, scripts) use HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate
- [ ] HSTS header enabled

### HSTS Header

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Next.js HTTPS Redirect

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://example.com/:path*',
        permanent: true,
      },
    ];
  },
};
```

## URL Structure

### Best Practices

- Use lowercase letters
- Use hyphens, not underscores
- Keep URLs short and descriptive
- Include keywords naturally
- Avoid query parameters when possible
- Use trailing slashes consistently

### Good vs Bad URLs

```
✅ Good:
https://example.com/products/running-shoes
https://example.com/blog/seo-guide-2024

❌ Bad:
https://example.com/products.php?id=123&cat=4
https://example.com/PRODUCTS/Running_Shoes
https://example.com/p/12345
```

### Trailing Slashes

Be consistent. Choose one and redirect the other:

```javascript
// next.config.js
module.exports = {
  trailingSlash: true, // or false
};
```

## Redirects

### Types

- **301 (Permanent)**: Page moved permanently, pass SEO value
- **302 (Temporary)**: Temporary redirect, minimal SEO impact
- **307/308**: HTTP/2 equivalents

### When to Use

| Scenario | Redirect |
|----------|----------|
| Page permanently moved | 301 |
| Site migration | 301 |
| A/B testing | 302 |
| Maintenance | 302 |
| HTTP to HTTPS | 301 |
| www to non-www | 301 |

### Next.js Redirects

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 301
      },
      {
        source: '/blog/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
};
```

## Page Speed

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5s-4s | >4s |
| INP (Interaction to Next Paint) | ≤200ms | 200ms-500ms | >500ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

### Quick Wins

- Optimize images (WebP, proper sizing)
- Enable compression (gzip/brotli)
- Minimize CSS/JS
- Use CDN
- Enable browser caching
- Lazy load images
- Preconnect to required origins

## Common Issues

| Issue | Severity | Detection | Fix |
|-------|----------|-----------|-----|
| No sitemap.xml | 🟡 | 404 on /sitemap.xml | Generate sitemap |
| Robots blocking important pages | 🔴 | Check robots.txt | Update rules |
| Mixed content | 🟡 | Browser console | Use HTTPS for all resources |
| Redirect chains | 🟡 | Multiple redirects | Direct redirect |
| 404 errors | 🟡 | Broken links | Fix or redirect |
| Slow page load | 🟡 | >3s load time | Optimize performance |
| No HTTPS | 🔴 | HTTP URLs | Enable SSL |
