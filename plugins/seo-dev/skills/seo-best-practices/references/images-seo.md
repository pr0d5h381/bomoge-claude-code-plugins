# Images SEO Reference

Image optimization for search engines and performance.

## Alt Text

Describes image content for search engines and accessibility.

### Requirements

- Descriptive and specific
- Include keywords naturally (no stuffing)
- Under 125 characters
- Don't start with "Image of" or "Picture of"

### Examples

```html
<!-- Good -->
<img src="shoe.jpg" alt="Nike Air Max 90 running shoe in white and red">
<img src="chart.jpg" alt="Sales growth chart showing 45% increase in Q4 2024">

<!-- Bad -->
<img src="shoe.jpg" alt="shoe">
<img src="shoe.jpg" alt="Image of a shoe">
<img src="shoe.jpg" alt="nike shoe running shoe best shoe buy shoe cheap shoe">
<img src="shoe.jpg" alt=""> <!-- Empty is bad unless decorative -->
```

### Decorative Images

Use empty alt for purely decorative images:

```html
<img src="divider.svg" alt="" role="presentation">
```

## Image Formats

### Format Comparison

| Format | Best For | Compression | Transparency |
|--------|----------|-------------|--------------|
| WebP | Most images | Excellent | Yes |
| AVIF | Modern browsers | Best | Yes |
| JPEG | Photos | Good | No |
| PNG | Graphics, logos | Lossless | Yes |
| SVG | Icons, logos | N/A (vector) | Yes |

### Priority Order

1. **AVIF** - Best compression (limited browser support)
2. **WebP** - Excellent compression (good support)
3. **JPEG/PNG** - Fallback

### Next.js Image Component

```typescript
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product description"
  width={800}
  height={600}
  // Automatically serves WebP/AVIF
/>
```

## Lazy Loading

Defer loading off-screen images.

```html
<!-- Native lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- For above-the-fold images -->
<img src="hero.jpg" alt="Hero image" loading="eager" fetchpriority="high">
```

### Next.js

```typescript
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy" // Default behavior
  priority={false} // Set true for above-fold images
/>
```

## Sizing

### Explicit Dimensions

Always provide width and height to prevent layout shift:

```html
<img src="image.jpg" alt="Description" width="800" height="600">
```

### Responsive Images

```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
>
```

### Next.js Responsive

```typescript
<Image
  src="/image.jpg"
  alt="Description"
  fill // For flexible sizing
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/>
```

## File Optimization

### Size Guidelines

| Use Case | Max Size | Recommended |
|----------|----------|-------------|
| Hero images | 200KB | 100-150KB |
| Product images | 100KB | 50-80KB |
| Thumbnails | 30KB | 15-25KB |
| Icons | 10KB | 2-5KB |

### Optimization Tools

- **Squoosh** (web): https://squoosh.app
- **ImageOptim** (macOS)
- **Sharp** (Node.js)

```javascript
// Using sharp in Node.js
import sharp from 'sharp';

await sharp('input.jpg')
  .webp({ quality: 80 })
  .resize(800, 600)
  .toFile('output.webp');
```

## File Naming

Use descriptive, keyword-rich filenames:

```
✅ Good:
nike-air-max-90-white-red.webp
christmas-sale-banner-2024.jpg
company-team-photo-office.jpg

❌ Bad:
IMG_1234.jpg
photo1.jpg
untitled.png
```

## Image Sitemaps

Include images in sitemap for better discovery:

```xml
<url>
  <loc>https://example.com/products/shoes</loc>
  <image:image>
    <image:loc>https://example.com/images/nike-shoe.jpg</image:loc>
    <image:title>Nike Air Max 90</image:title>
    <image:caption>White and red Nike running shoe</image:caption>
  </image:image>
</url>
```

## CDN Best Practices

### URL Structure

```
https://cdn.example.com/images/products/nike-shoe.webp
```

### Headers

```
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/webp
```

### Image Transformation URLs

Many CDNs support on-the-fly transformations:

```
https://cdn.example.com/image.jpg?w=800&h=600&q=80&fmt=webp
```

## Common Issues

| Issue | Severity | Detection | Fix |
|-------|----------|-----------|-----|
| Missing alt text | 🔴 | No alt attribute | Add descriptive alt |
| Empty alt on content images | 🔴 | alt="" on non-decorative | Add description |
| No lazy loading | 🟡 | No loading="lazy" | Add lazy loading |
| Missing dimensions | 🟡 | No width/height | Add explicit dimensions |
| Large file sizes | 🟡 | >200KB | Optimize and compress |
| Wrong format | 🟡 | PNG for photos | Use WebP/JPEG |
| Non-descriptive filenames | 🟢 | IMG_1234.jpg | Rename with keywords |
| No srcset | 🟢 | Single image size | Add responsive images |

## Framework-Specific Patterns

### Next.js Complete Example

```typescript
import Image from 'next/image';

// Static image with priority (hero)
<Image
  src="/hero.webp"
  alt="Product showcase hero image"
  width={1920}
  height={1080}
  priority
  quality={85}
/>

// Dynamic product image
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
/>

// Responsive gallery image
<Image
  src="/gallery.webp"
  alt="Gallery image"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

### Nuxt 3

```vue
<template>
  <NuxtImg
    src="/image.jpg"
    alt="Description"
    width="800"
    height="600"
    loading="lazy"
    format="webp"
  />
</template>
```

## Checklist

- [ ] All content images have alt text
- [ ] Decorative images have empty alt=""
- [ ] Images use WebP/AVIF format
- [ ] Images have explicit width/height
- [ ] Off-screen images use lazy loading
- [ ] Hero images use priority loading
- [ ] File sizes are optimized (<200KB)
- [ ] Filenames are descriptive
- [ ] Responsive images use srcset
- [ ] Images are served from CDN
