# Structured Data Reference

JSON-LD and Schema.org markup for rich search results.

## Overview

Structured data helps search engines understand page content and enables rich results (rich snippets) in search.

**Format:** JSON-LD (recommended by Google)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title"
}
</script>
```

## Essential Schemas

### Organization

For company/brand pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-5555",
    "contactType": "customer service",
    "availableLanguage": ["English", "Polish"]
  }
}
```

### WebSite (with Search)

For homepage with site search:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### BreadcrumbList

For navigation breadcrumbs:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Product Name",
      "item": "https://example.com/products/product-name"
    }
  ]
}
```

### Product

For e-commerce product pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": [
    "https://example.com/product1.jpg",
    "https://example.com/product2.jpg"
  ],
  "description": "Product description",
  "sku": "SKU123",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "99.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Seller Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "123"
  }
}
```

### Article

For blog posts and articles:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15T08:00:00Z",
  "dateModified": "2024-01-20T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/article"
  }
}
```

### FAQPage

For FAQ sections:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO stands for Search Engine Optimization..."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO results typically take 3-6 months..."
      }
    }
  ]
}
```

### LocalBusiness

For local businesses:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/business.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.7128",
    "longitude": "-74.0060"
  },
  "telephone": "+1-555-555-5555",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$"
}
```

### HowTo

For tutorial/guide pages:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Optimize Images for SEO",
  "description": "Learn how to optimize images for better SEO",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Choose the right format",
      "text": "Use WebP for best compression..."
    },
    {
      "@type": "HowToStep",
      "name": "Add alt text",
      "text": "Write descriptive alt text..."
    }
  ]
}
```

### SoftwareApplication

For app/software pages:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "App Name",
  "operatingSystem": "Web, iOS, Android",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "5000"
  }
}
```

## Next.js Implementation

Use Next.js metadata API for structured data:

```typescript
// app/layout.tsx or app/page.tsx
export const metadata: Metadata = {
  // Next.js doesn't have built-in JSON-LD support
  // Use a component approach instead
};

// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Note: JSON.stringify with static data is safe
      // Never pass user input directly
      {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }}
    />
  );
}

// Or use next-seo package for safer implementation
// npm install next-seo
import { ArticleJsonLd } from 'next-seo';
```

## Nuxt 3 Implementation

```typescript
// pages/index.vue
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Page Title',
      }),
    },
  ],
});
```

## Common Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| No structured data | 🟡 | Add relevant schema |
| Invalid JSON-LD | 🔴 | Validate and fix syntax |
| Missing required fields | 🟡 | Add required properties |
| Wrong schema type | 🟡 | Use appropriate type |
| Outdated prices | 🔴 | Keep product data current |
| Missing reviews | 🟢 | Add AggregateRating if available |

## Testing Tools

- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/
- **JSON-LD Playground:** https://json-ld.org/playground/
