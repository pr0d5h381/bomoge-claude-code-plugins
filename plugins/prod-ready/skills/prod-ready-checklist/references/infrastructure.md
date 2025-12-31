# Infrastructure Checklist

## Critical Checks

### Environment Variables
```bash
# List all env vars used in code
grep -rn "process.env\." --include="*.{ts,tsx,js,jsx}" | \
  sed 's/.*process.env.\([A-Z_]*\).*/\1/' | sort -u
```

**Checklist:**
- [ ] All required env vars documented
- [ ] `.env.example` file exists
- [ ] Production values set in hosting platform
- [ ] No secrets in `.env` committed to git
- [ ] Separate dev/staging/prod values

```
# .env.example
DATABASE_URL=
NEXT_PUBLIC_API_URL=
STRIPE_SECRET_KEY=
# ... document all required vars
```

### Production Environment
- [ ] `NODE_ENV=production` set
- [ ] Debug mode disabled
- [ ] Production database connected
- [ ] Production API endpoints configured
- [ ] CDN configured for assets

### Build Process
```bash
# Verify build works
npm run build

# Check for build warnings
npm run build 2>&1 | grep -i "warn\|error"
```

## Warning Checks

### CORS Configuration
```javascript
// Proper CORS setup
const allowedOrigins = [
  'https://example.com',
  'https://www.example.com'
];

// Don't allow all origins in production
// BAD: Access-Control-Allow-Origin: *
```

**Check:**
- [ ] Only trusted origins allowed
- [ ] Credentials properly configured
- [ ] Preflight requests handled
- [ ] No wildcard (*) in production

### Rate Limiting
```javascript
// API rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
});

app.use('/api/', limiter);
```

**Protect:**
- [ ] Authentication endpoints
- [ ] API routes
- [ ] Form submissions
- [ ] File uploads

### Error Logging
```javascript
// Production error logging
if (process.env.NODE_ENV === 'production') {
  // Send to logging service (Sentry, LogRocket, etc.)
  Sentry.captureException(error);
}
```

**Setup:**
- [ ] Error tracking service configured
- [ ] Unhandled exceptions caught
- [ ] API errors logged
- [ ] Client errors reported
- [ ] Alerts configured for critical errors

### Monitoring
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Performance monitoring (APM)
- [ ] Database monitoring
- [ ] Resource usage alerts

### Backup Strategy
- [ ] Database backups automated
- [ ] Backup frequency defined
- [ ] Backup restoration tested
- [ ] File storage backed up
- [ ] Backup retention policy

### CI/CD Pipeline
```yaml
# Example GitHub Actions
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - run: npm run deploy
```

**Verify:**
- [ ] Automated testing on push
- [ ] Build verification
- [ ] Automated deployment
- [ ] Rollback capability

## Info Checks

### SSL/TLS
- [ ] HTTPS enforced
- [ ] SSL certificate valid
- [ ] Auto-renewal configured
- [ ] HSTS header set

### Domain Configuration
- [ ] DNS properly configured
- [ ] www redirect (or non-www)
- [ ] Subdomains configured
- [ ] Email records (SPF, DKIM, DMARC)

### Database
- [ ] Connection pooling
- [ ] Read replicas (if needed)
- [ ] Query optimization
- [ ] Indexes created
- [ ] Migration scripts ready

### Scaling
- [ ] Load balancer configured
- [ ] Auto-scaling rules
- [ ] CDN for static assets
- [ ] Database scaling plan

### Security Headers
```javascript
// Security headers (Next.js example)
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
];
```

## Search Patterns

```bash
# Find hardcoded URLs
grep -rn "http://localhost\|127.0.0.1" --include="*.{ts,tsx,js,jsx}"

# Find environment checks
grep -rn "NODE_ENV" --include="*.{ts,tsx,js,jsx}"

# Check for missing env vars in code
grep -rn "process.env\.\w*" --include="*.{ts,tsx}" | grep -v ".env"
```

## Pre-Launch Infrastructure Checklist

### Hosting
- [ ] Production server provisioned
- [ ] Environment variables set
- [ ] Domain connected
- [ ] SSL certificate active

### Database
- [ ] Production database created
- [ ] Migrations applied
- [ ] Seed data (if needed)
- [ ] Backup schedule configured

### Services
- [ ] Email service configured
- [ ] Payment gateway live mode
- [ ] Analytics tracking active
- [ ] Error tracking enabled

### DNS
- [ ] A/CNAME records configured
- [ ] TTL set appropriately
- [ ] Propagation complete
