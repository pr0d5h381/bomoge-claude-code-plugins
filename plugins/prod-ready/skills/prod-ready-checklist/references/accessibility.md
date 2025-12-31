# Accessibility Checklist

## Critical Checks

### Keyboard Navigation
```jsx
// All interactive elements must be keyboard accessible
<button onClick={handleClick}>Click me</button>  // ✓ Works
<div onClick={handleClick}>Click me</div>        // ✗ Not keyboard accessible

// Fix non-button elements
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

**Check:**
- [ ] Tab through entire page
- [ ] All interactive elements focusable
- [ ] Focus order is logical
- [ ] No keyboard traps
- [ ] Skip-to-content link

### Focus Indicators
```css
/* Never remove focus outline without replacement */
/* BAD */
:focus { outline: none; }

/* GOOD */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

**Check:**
- [ ] Focus visible on all elements
- [ ] High contrast focus ring
- [ ] Consistent focus style

### Screen Reader Support
```jsx
// Proper labeling
<button aria-label="Close menu">
  <XIcon />
</button>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Hidden from screen readers
<div aria-hidden="true">
  <DecorativeImage />
</div>
```

**Check:**
- [ ] All images have alt text
- [ ] Icon buttons have labels
- [ ] Form inputs have labels
- [ ] Dynamic content announced

## Warning Checks

### ARIA Labels
```jsx
// Form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" />

// Or using aria-label
<input aria-label="Search" type="search" />

// Error states
<input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error">Invalid email format</span>
```

### Color Contrast (WCAG AA)
```
Minimum contrast ratios:
- Normal text: 4.5:1
- Large text (18px+ or 14px bold): 3:1
- UI components: 3:1
```

**Tools:**
- Chrome DevTools (inspect → accessibility)
- axe DevTools extension
- https://webaim.org/resources/contrastchecker/

### Semantic HTML
```jsx
// Use semantic elements
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

// Use headings properly
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>

// Use lists for lists
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### Alt Text for Images
```jsx
// Informative images
<img src="chart.png" alt="Sales increased 50% from Q1 to Q2" />

// Decorative images
<img src="decorative.png" alt="" role="presentation" />

// Complex images
<figure>
  <img src="diagram.png" alt="System architecture diagram" />
  <figcaption>
    Detailed description of the diagram...
  </figcaption>
</figure>
```

**Alt text guidelines:**
- [ ] Descriptive, not "image of..."
- [ ] Include important text in images
- [ ] Empty alt for decorative images
- [ ] Avoid redundant alt text

### Form Accessibility
```jsx
// Required fields
<label>
  Email <span aria-label="required">*</span>
</label>
<input
  type="email"
  required
  aria-required="true"
/>

// Error messages
<input
  aria-invalid={!!error}
  aria-describedby="email-error"
/>
{error && <span id="email-error" role="alert">{error}</span>}

// Grouping
<fieldset>
  <legend>Shipping Address</legend>
  ...
</fieldset>
```

### Modal/Dialog Accessibility
```jsx
// Proper dialog structure
<dialog
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Dialog Title</h2>
  <p id="dialog-description">Description</p>

  {/* Focus trap inside modal */}
  {/* Close on Escape key */}
  {/* Return focus on close */}
</dialog>
```

### Skip Links
```jsx
// Add at the very beginning of body
<a
  href="#main-content"
  className="sr-only focus:not-sr-only"
>
  Skip to main content
</a>

// Target
<main id="main-content" tabIndex={-1}>
  ...
</main>
```

## Info Checks

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Language Attribute
```html
<html lang="pl">
```

### Page Title Changes
```jsx
// Update title on route change
useEffect(() => {
  document.title = `${pageTitle} | Site Name`;
}, [pageTitle]);
```

### Link Text
```jsx
// BAD - non-descriptive
<a href="/docs">Click here</a>

// GOOD - descriptive
<a href="/docs">View documentation</a>

// External links
<a href="https://..." target="_blank" rel="noopener">
  External site
  <span className="sr-only">(opens in new tab)</span>
</a>
```

## Search Patterns

```bash
# Find images without alt
grep -rn "<img" --include="*.{tsx,jsx}" | grep -v "alt="

# Find buttons without labels
grep -rn "<button" --include="*.{tsx,jsx}" | grep -v "aria-label"

# Find divs with onClick (potential a11y issue)
grep -rn "<div.*onClick" --include="*.{tsx,jsx}"

# Find missing htmlFor
grep -rn "<label" --include="*.{tsx,jsx}" | grep -v "htmlFor"
```

## Testing Tools

```bash
# Browser extensions:
# - axe DevTools
# - WAVE
# - Lighthouse

# Automated testing:
npm install @axe-core/react
npm install jest-axe

# Screen reader testing:
# - VoiceOver (Mac: Cmd + F5)
# - NVDA (Windows, free)
# - JAWS (Windows, paid)
```

## WCAG 2.1 Level AA Checklist

### Perceivable
- [ ] Text alternatives for images
- [ ] Captions for videos
- [ ] Adaptable layouts
- [ ] Distinguishable content (contrast)

### Operable
- [ ] Keyboard accessible
- [ ] Enough time to read
- [ ] No seizure-inducing content
- [ ] Navigable

### Understandable
- [ ] Readable text
- [ ] Predictable functionality
- [ ] Input assistance (errors, labels)

### Robust
- [ ] Compatible with assistive tech
- [ ] Valid HTML
- [ ] ARIA used correctly
