# Performance Checklist

## Critical Checks

### Bundle Size
```bash
# Analyze bundle (Next.js)
npx @next/bundle-analyzer

# Check bundle size
npm run build
ls -la .next/static/chunks/
```

**Thresholds:**
- Initial JS: < 200KB gzipped
- Per-route chunks: < 50KB gzipped
- Total app: < 500KB gzipped

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Warning Checks

### Image Optimization
```bash
# Find unoptimized images
find . -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | head -20

# Check for Image component usage (Next.js)
grep -rn "<img " --include="*.{tsx,jsx}"  # Should use <Image>
```

**Image checklist:**
- [ ] Use WebP/AVIF format
- [ ] Responsive images (srcset)
- [ ] Lazy loading enabled
- [ ] Proper dimensions set
- [ ] Alt text provided
- [ ] CDN delivery

```jsx
// Next.js Image optimization
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Code Splitting
```jsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// Route-based splitting (automatic in Next.js)
// Manual for React:
const Dashboard = React.lazy(() => import('./Dashboard'));
```

**Check:**
- Large components are lazy loaded
- Routes are code-split
- Heavy libraries loaded on demand
- No unnecessary imports in main bundle

### Caching Strategy
```javascript
// API caching
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

// Static assets
// next.config.js
headers: [
  {
    source: '/static/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
    ]
  }
]
```

### Database Queries
```sql
-- Check for N+1 queries
-- BAD: Fetching related data in loop
-- GOOD: Use JOINs or include related data

-- Check for missing indexes
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@test.com';
```

**Optimize:**
- Add indexes for frequent queries
- Use query pagination
- Implement connection pooling
- Cache frequent queries

### Third-Party Scripts
```html
<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>

<!-- Async for independent scripts -->
<script src="widget.js" async></script>
```

**Check:**
- Analytics loaded asynchronously
- Chat widgets lazy loaded
- Social scripts deferred
- No render-blocking scripts

## Info Checks

### Server Response Time
- API responses: < 200ms
- Page generation: < 500ms
- Database queries: < 100ms

### Memory Usage
- No memory leaks
- Efficient state management
- Proper cleanup in useEffect
- Large data virtualized

### Network Requests
- Minimize API calls
- Batch related requests
- Use HTTP/2 multiplexing
- Implement request deduplication

## Search Patterns

```bash
# Find large imports
grep -rn "import.*from" --include="*.{ts,tsx}" | grep -E "lodash|moment|@mui"

# Find inline styles (can't be cached)
grep -rn "style={{" --include="*.{tsx,jsx}"

# Find synchronous operations
grep -rn "readFileSync\|JSON.parse" --include="*.{ts,tsx}"
```

## Performance Tools

```bash
# Lighthouse audit
npx lighthouse https://yoursite.com --view

# Bundle analysis
npx source-map-explorer .next/static/chunks/*.js

# Load testing
npx autocannon -c 100 -d 10 https://yoursite.com
```

## Framework-Specific

### Next.js
- [ ] Use `next/image` for images
- [ ] Use `next/font` for fonts
- [ ] Enable ISR where applicable
- [ ] Use React Server Components
- [ ] Check `next.config.js` optimization settings

### React
- [ ] Memoize expensive computations
- [ ] Use React.memo for pure components
- [ ] Virtualize long lists
- [ ] Avoid inline functions in render

### General
- [ ] Minimize re-renders
- [ ] Use efficient state management
- [ ] Implement request caching
- [ ] Optimize database queries
