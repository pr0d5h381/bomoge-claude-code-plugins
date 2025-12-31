# Responsiveness Checklist

## Critical Checks

### Viewport Meta Tag
```html
<!-- Required in every page -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Check:**
- [ ] Viewport meta tag present
- [ ] No `user-scalable=no` (accessibility issue)
- [ ] No fixed width set

## Warning Checks

### Breakpoint Coverage
Standard breakpoints to test:

| Breakpoint | Width | Device |
|------------|-------|--------|
| Mobile S | 320px | Small phones |
| Mobile M | 375px | iPhone SE, standard |
| Mobile L | 425px | Large phones |
| Tablet | 768px | iPad |
| Laptop | 1024px | Small laptops |
| Desktop | 1440px | Standard desktop |
| 4K | 2560px | Large displays |

### Mobile Layout (< 640px)
- [ ] Single column layout
- [ ] Full-width elements
- [ ] Stacked navigation
- [ ] Readable font size (16px min)
- [ ] Adequate spacing
- [ ] No horizontal scroll

### Tablet Layout (640px - 1024px)
- [ ] Two-column layouts where appropriate
- [ ] Adjusted navigation
- [ ] Proper image sizing
- [ ] Touch-friendly targets

### Desktop Layout (> 1024px)
- [ ] Multi-column layouts
- [ ] Max-width container
- [ ] Expanded navigation
- [ ] Hover states

### Touch Targets
```css
/* Minimum touch target size */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

**Check:**
- [ ] Buttons ≥ 44x44px
- [ ] Links have adequate padding
- [ ] Form inputs are large enough
- [ ] No tiny clickable elements

### Responsive Images
```jsx
// Next.js responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// HTML srcset
<img
  src="small.jpg"
  srcset="small.jpg 320w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 320px) 280px, (max-width: 768px) 720px, 1200px"
/>
```

**Check:**
- [ ] Images scale properly
- [ ] Different sizes for breakpoints
- [ ] No stretched/distorted images
- [ ] Lazy loading enabled

### Typography Scaling
```css
/* Responsive typography */
html {
  font-size: 16px; /* Base */
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

**Check:**
- [ ] Readable on all devices
- [ ] Headings scale appropriately
- [ ] Line length reasonable (45-75 chars)
- [ ] Adequate line height

### Navigation
```jsx
// Mobile menu pattern
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Desktop: horizontal nav
// Mobile: hamburger + drawer/sheet
```

**Check:**
- [ ] Mobile hamburger menu works
- [ ] Menu closes on navigation
- [ ] Active state visible
- [ ] All items accessible

### Forms
```css
/* Responsive form */
.form-group {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .form-group {
    flex-direction: row;
  }
}
```

**Check:**
- [ ] Inputs full width on mobile
- [ ] Labels visible (not just placeholders)
- [ ] Error messages visible
- [ ] Submit button accessible

### Tables
```jsx
// Responsive table options:
// 1. Horizontal scroll
<div className="overflow-x-auto">
  <table>...</table>
</div>

// 2. Card layout on mobile
// 3. Hide non-essential columns
```

**Check:**
- [ ] Tables scrollable or stackable
- [ ] Important data visible
- [ ] No content cut off

## Info Checks

### Orientation Support
- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] No content hidden on rotate

### Modal/Dialog Behavior
- [ ] Full screen on mobile
- [ ] Proper sizing on tablet/desktop
- [ ] Scroll inside modal if needed
- [ ] Close button accessible

### Fixed/Sticky Elements
- [ ] Headers don't block content
- [ ] Bottom bars don't cover inputs
- [ ] Modals work with keyboard

## Search Patterns

```bash
# Find hardcoded widths
grep -rn "width:\s*[0-9]*px" --include="*.{css,scss,tsx,jsx}"

# Find responsive utilities
grep -rn "sm:\|md:\|lg:\|xl:" --include="*.{tsx,jsx}"

# Check for viewport meta
grep -rn "viewport" --include="*.{tsx,jsx,html}"
```

## Testing Tools

```bash
# Chrome DevTools device toolbar (Cmd+Shift+M)
# Test at all standard breakpoints

# Responsive testing sites:
# - responsively.app
# - browserstack.com
# - responsivedesignchecker.com
```

## Common Issues

### Horizontal Overflow
```css
/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
}

/* Find culprits */
* {
  outline: 1px solid red;
}
```

### Fixed Widths
```css
/* BAD */
.container {
  width: 1200px;
}

/* GOOD */
.container {
  max-width: 1200px;
  width: 100%;
}
```

### Viewport Units
```css
/* Be careful with vh on mobile (address bar issues) */
.full-height {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height */
}
```
