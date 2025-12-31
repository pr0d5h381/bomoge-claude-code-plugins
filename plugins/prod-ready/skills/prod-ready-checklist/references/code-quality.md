# Code Quality Checklist

## Critical Checks

### Build Errors
```bash
# Run build and check for errors
npm run build
tsc --noEmit
python -m py_compile *.py
```

**Must pass:**
- TypeScript compilation
- Production build
- Linting (ESLint, Pylint, etc.)

### Compilation Warnings
- Unused variables
- Type mismatches
- Deprecated API usage
- Missing return types

## Warning Checks

### Debug Statements
```bash
# Search for debug code
grep -rn "console\.log" --include="*.{js,ts,tsx,jsx}"
grep -rn "console\.debug" --include="*.{js,ts,tsx,jsx}"
grep -rn "debugger" --include="*.{js,ts,tsx,jsx}"
grep -rn "print(" --include="*.py"
grep -rn "puts\|p " --include="*.rb"
```

**Remove before production:**
- `console.log()` statements
- `console.debug()` statements
- `debugger` statements
- `print()` in Python (use logging)
- Development-only code blocks

### TODO/FIXME Comments
```bash
# Search for unfinished work
grep -rn "TODO\|FIXME\|HACK\|XXX\|BUG" --include="*.{js,ts,tsx,jsx,py,rb,go}"
```

**Review each:**
- Is it blocking for launch?
- Can it be deferred post-launch?
- Does it indicate a bug?

### Unused Code
```bash
# TypeScript/JavaScript
npx ts-prune  # Find unused exports
npx depcheck  # Find unused dependencies
```

**Check for:**
- Unused imports
- Dead code paths
- Unused functions/components
- Unused dependencies in package.json

### Error Handling
```javascript
// BAD - Silent catch
try {
  await fetchData();
} catch (e) {
  // nothing
}

// GOOD - Proper handling
try {
  await fetchData();
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('DATA_FETCH_FAILED', error);
}
```

**Check for:**
- Empty catch blocks
- Generic error messages
- Missing error logging
- Unhandled promise rejections

### Code Duplication
- Repeated logic that should be extracted
- Copy-pasted components with slight variations
- Duplicated utility functions

## Info Checks

### Code Organization
- Consistent file structure
- Proper module separation
- Clear naming conventions
- Documented public APIs

### Type Safety
```typescript
// Avoid 'any' types
const data: any = response;  // BAD
const data: UserData = response;  // GOOD

// Avoid type assertions without validation
const user = data as User;  // Risky
const user = validateUser(data);  // Safe
```

### Comments Quality
- Outdated comments
- Comments explaining "what" instead of "why"
- Missing JSDoc for public APIs
- Commented-out code

## Patterns to Search

| Pattern | Severity | Description |
|---------|----------|-------------|
| `console.log` | Warning | Debug statement |
| `// TODO` | Warning | Unfinished work |
| `// FIXME` | Warning | Known issue |
| `// HACK` | Warning | Workaround |
| `any` type | Info | Weak typing |
| `@ts-ignore` | Warning | Type suppression |
| `eslint-disable` | Info | Rule bypass |
| `catch {}` | Warning | Silent error |

## Pre-Launch Commands

```bash
# Full quality check
npm run lint
npm run type-check
npm run build
npm run test

# Find issues
grep -rn "console\.log\|TODO\|FIXME" src/
```

## Framework-Specific

### React/Next.js
- Check for missing key props in lists
- Verify useEffect dependencies
- Look for memory leaks (missing cleanup)
- Check for prop drilling (consider context)

### Vue/Nuxt
- Check for v-if with v-for on same element
- Verify computed vs methods usage
- Look for direct state mutations

### Python
- Run `flake8` or `pylint`
- Check for bare `except:` clauses
- Verify type hints on public functions
