# Security Checklist

## Critical Checks

### Hardcoded Secrets
```bash
# Search patterns for exposed secrets
grep -r "password\s*=" --include="*.{js,ts,tsx,jsx,py,rb,go}"
grep -r "api[_-]?key\s*=" --include="*.{js,ts,tsx,jsx,py,rb,go}"
grep -r "secret\s*=" --include="*.{js,ts,tsx,jsx,py,rb,go}"
grep -r "token\s*=" --include="*.{js,ts,tsx,jsx,py,rb,go}"
```

**What to look for:**
- API keys in source code (not env vars)
- Database connection strings with passwords
- JWT secrets hardcoded
- OAuth client secrets in frontend code
- AWS/GCP/Azure credentials

**Fix:** Move all secrets to environment variables, use `.env.local` for development, never commit `.env` files.

### SQL Injection
```javascript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// SAFE
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);
```

**Check for:**
- String concatenation in SQL queries
- Template literals with user input in queries
- Missing parameterized queries
- Raw SQL in ORMs without proper escaping

### XSS (Cross-Site Scripting)
**Check for unsafe HTML rendering:**
- Direct DOM manipulation with user content
- React unsafe HTML rendering props
- Vue v-html directive without sanitization
- Unescaped template variables

**Fix:** Use textContent for plain text, sanitize with DOMPurify for HTML.

### CSRF Protection
- Check for CSRF tokens in forms
- Verify API routes validate CSRF tokens
- Use SameSite cookie attribute

### Authentication Issues
- Missing authentication on protected routes
- Weak password requirements
- No rate limiting on login
- Session tokens in URLs
- Missing logout functionality
- No session expiration

### Authorization Issues
- Missing role checks on admin routes
- Direct object reference (IDOR) vulnerabilities
- Missing ownership validation
- Privilege escalation paths

## Warning Checks

### HTTPS Enforcement
```bash
# Check for HTTP URLs in production code
grep -r "http://" --include="*.{js,ts,tsx,jsx}" | grep -v "localhost"
```

### Secure Cookies
```javascript
// Check cookie settings
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}
```

### Input Validation
- Validate all user inputs on server side
- Use validation libraries (zod, yup, joi)
- Sanitize file uploads
- Validate file types and sizes

### Dependency Vulnerabilities
```bash
# Run security audit
npm audit
yarn audit
pip-audit
bundle audit
```

### Headers Security
```javascript
// Recommended security headers
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': '...'
}
```

## File Patterns to Check

| Pattern | Risk | Check |
|---------|------|-------|
| `.env` in git | Critical | Should be in .gitignore |
| `credentials.json` | Critical | Should not exist in repo |
| `*.pem`, `*.key` | Critical | Private keys exposed |
| `config/secrets.*` | Critical | Check for hardcoded values |

## Framework-Specific

### Next.js
- Check `next.config.js` for exposed env vars
- Verify API routes have authentication
- Check for client-side secret exposure (NEXT_PUBLIC_*)

### Express
- Verify helmet middleware is used
- Check CORS configuration
- Validate rate limiting on auth routes

### Django
- Check DEBUG = False in production
- Verify SECRET_KEY is from env
- Check ALLOWED_HOSTS configuration
