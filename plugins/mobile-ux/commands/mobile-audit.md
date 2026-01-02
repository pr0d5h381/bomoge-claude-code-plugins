---
name: mobile-audit
description: Run comprehensive mobile UX audit on your application
---

# Mobile UX Audit

You are now conducting a comprehensive mobile UX audit. This audit will analyze the application for mobile usability issues and provide a detailed report with prioritized recommendations.

## Audit Scope

The audit covers these critical areas:

1. **Touch Interactions**
   - Tap target sizes (minimum 44x44px)
   - Touch feedback (visual/haptic)
   - Gesture support

2. **Navigation**
   - Bottom navigation patterns
   - Thumb-zone optimization
   - Back navigation support

3. **UI Components**
   - Modal → Bottom sheet transformation
   - Mobile-friendly forms
   - Loading states

4. **Typography & Readability**
   - Font sizes (16px+ for body)
   - Line heights
   - Input zoom prevention

5. **Safe Areas**
   - Notch/Dynamic Island
   - Home indicator
   - Viewport configuration

6. **PWA Readiness**
   - Web manifest
   - Service worker
   - Offline support

7. **Performance**
   - Skeleton loading
   - Optimistic updates
   - Touch responsiveness

## Audit Process

### Step 1: Discovery

First, identify the project structure and technology stack:

1. Find the framework (Next.js, React, Vue, etc.)
2. Locate component directories
3. Identify styling approach (Tailwind, CSS modules, etc.)
4. Map navigation and layout components

### Step 2: Systematic Analysis

Analyze each file category:

**Layout Files**: Check for safe area handling, viewport configuration
**Navigation Components**: Evaluate placement, touch targets, bottom nav usage
**Form Components**: Check input sizes, keyboard types, submit buttons
**Modal/Dialog Components**: Assess bottom sheet opportunities
**Interactive Elements**: Verify tap targets, touch feedback

### Step 3: Generate Report

Create a detailed report with this structure:

```markdown
# Mobile UX Audit Report

## Summary
- **Overall Score**: X/100
- **Critical Issues**: X
- **High Priority**: X
- **Medium Priority**: X
- **Low Priority**: X

## Critical Issues (Must Fix)

### Issue 1: [Title]
- **Location**: `path/to/file.tsx:line`
- **Problem**: Description
- **Impact**: How it affects users
- **Solution**: Specific fix with code example

## High Priority Issues

[Same format...]

## Medium Priority Improvements

[Same format...]

## Low Priority Enhancements

[Same format...]

## Already Implemented Well
- [List of good patterns found]

## Next Steps
1. Fix critical issues first
2. Address high priority items
3. Consider improvements for enhanced UX
```

### Step 4: Offer Implementation

After presenting the report:

1. Ask which issues to fix
2. Implement approved changes
3. Verify fixes don't break existing functionality

## Begin Audit

Start the audit by:

1. Using Glob to find key files (layouts, components, pages)
2. Using Read to analyze component implementations
3. Using Grep to find specific patterns (tap targets, modals, inputs)
4. Documenting findings in the report format

Focus on actionable findings with specific file locations and code fixes.

## Important Notes

- **Do not make changes without approval** - Report first, then implement
- **Preserve desktop functionality** - Mobile fixes should enhance, not break
- **Prioritize by impact** - Critical issues first
- **Provide code examples** - Show before/after for each fix
