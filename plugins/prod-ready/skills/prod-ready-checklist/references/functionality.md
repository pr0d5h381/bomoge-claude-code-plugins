# Functionality Checklist

## Critical Checks

### Core User Flows
Test complete flows end-to-end:

1. **Authentication Flow**
   - Sign up → Email verification → Login → Logout
   - Password reset flow
   - Social login (if applicable)
   - Session persistence

2. **Main Business Flow**
   - Create → Read → Update → Delete
   - All CRUD operations work
   - Data persists correctly
   - Permissions enforced

3. **Payment Flow** (if applicable)
   - Checkout process
   - Payment processing
   - Success/failure handling
   - Receipt/confirmation

### API Endpoints
```bash
# List all API routes
grep -rn "export.*GET\|POST\|PUT\|DELETE\|PATCH" --include="*.ts" app/api/
```

**Verify each endpoint:**
- Returns correct status codes
- Handles errors gracefully
- Validates input
- Returns proper response format

## Warning Checks

### Broken Links
```bash
# Find internal links
grep -rn 'href="\/' --include="*.{tsx,jsx,html}"
grep -rn "Link.*to=" --include="*.{tsx,jsx}"
grep -rn "router.push" --include="*.{tsx,jsx}"
```

**Check:**
- All internal links resolve
- External links work
- No 404s in navigation
- Deep links function

### Route Validation
```bash
# List all routes (Next.js)
find app -name "page.tsx" | sed 's/app//' | sed 's/page.tsx//'

# List all routes (React Router)
grep -rn "path=" --include="*.{tsx,jsx}"
```

**Verify:**
- All routes accessible
- Protected routes redirect properly
- Dynamic routes handle params
- Catch-all routes work

### Form Submissions
Every form needs testing:
- Submit with valid data
- Submit with invalid data
- Submit empty form
- Double-submit prevention
- File upload limits

### Edge Cases

**Numeric inputs:**
- Zero values
- Negative numbers
- Very large numbers
- Decimal precision

**Text inputs:**
- Empty strings
- Very long strings
- Special characters
- Unicode/emoji
- XSS attempts

**Lists:**
- Empty list
- Single item
- Many items (100+)
- Pagination boundaries

**Dates:**
- Past dates
- Future dates
- Timezone handling
- Invalid dates

### Feature Flags
```bash
# Find feature flags
grep -rn "featureFlag\|feature_flag\|isEnabled\|FEATURE_" --include="*.{ts,tsx,js,jsx}"
```

**Before launch:**
- Remove or enable production features
- Remove development-only flags
- Document remaining flags

### Environment-Specific Code
```bash
# Find environment checks
grep -rn "NODE_ENV\|process.env" --include="*.{ts,tsx,js,jsx}"
grep -rn "isDevelopment\|isProduction" --include="*.{ts,tsx,js,jsx}"
```

**Verify:**
- Dev-only code doesn't run in prod
- Prod settings are correct
- No mock data in production

## Info Checks

### Navigation
- Breadcrumbs work correctly
- Back button behaves as expected
- History state is preserved
- Deep linking functions

### Data Integrity
- Relationships maintained
- Cascading deletes work
- Orphaned records cleaned
- Timestamps accurate

### Concurrent Operations
- Multiple users editing
- Race conditions handled
- Optimistic locking (if needed)
- Conflict resolution

## Testing Checklist

### By User Role
- [ ] Anonymous user flows
- [ ] Authenticated user flows
- [ ] Admin user flows
- [ ] Different permission levels

### By Device
- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Tablet
- [ ] Different browsers (Chrome, Firefox, Safari)

### By Network
- [ ] Fast connection
- [ ] Slow connection (throttle)
- [ ] Offline handling
- [ ] Intermittent connection

## Search Patterns

```bash
# Find TODO in route handlers
grep -rn "TODO\|FIXME" app/api/

# Find unhandled promises
grep -rn "\.then(" --include="*.{ts,tsx}" | grep -v "catch"

# Find disabled functionality
grep -rn "disabled\|TODO" --include="*.{tsx,jsx}"
```
