---
name: Mobile UX Patterns
description: This skill should be used when the user asks to "optimize for mobile", "improve mobile UX", "make it mobile-friendly", "add touch interactions", "fix mobile layout", "thumb zone", "mobile navigation", "bottom sheet", "pull to refresh", "swipe gestures", "mobile forms", "tap targets", "safe areas", "notch handling", or mentions mobile user experience, responsive design issues, or native-like app feel.
version: 1.0.0
---

# Mobile UX Patterns

Expert knowledge for creating native-like mobile experiences in web applications. Focus on touch-first interactions, thumb-zone optimization, and app-like UI patterns.

## Core Principles

### Touch-First Design

Design for fingers, not cursors:
- Minimum tap target: 44x44px (Apple) / 48x48dp (Google)
- Spacing between targets: minimum 8px
- Touch feedback: visual + haptic when possible
- No hover-dependent interactions on mobile

### Thumb Zone Optimization

Optimize for one-handed use (right-hand dominant):
- **Easy reach**: Bottom center, bottom-right
- **Hard reach**: Top-left, top-right corners
- **Critical actions**: Place in easy reach zone
- **Navigation**: Bottom of screen preferred

### Mobile-First Hierarchy

Structure content for mobile consumption:
- Single column layouts on small screens
- Horizontal scroll for secondary content
- Collapsible sections for dense information
- Progressive disclosure of complex features

## Native-Like UI Patterns

### Bottom Navigation

Replace top navbars with bottom navigation:

```tsx
// Bottom navigation pattern
<nav className="fixed bottom-0 left-0 right-0 bg-background border-t safe-area-bottom">
  <div className="flex justify-around py-2">
    {items.map(item => (
      <button className="flex flex-col items-center p-2 min-w-[64px]">
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

### Bottom Sheets

Use bottom sheets instead of modals:

```tsx
// Bottom sheet pattern - slides up from bottom
<div className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl
               transform transition-transform safe-area-bottom">
  <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3" /> {/* Handle */}
  <div className="px-4 pb-4">{content}</div>
</div>
```

### Pull to Refresh

Implement native-like refresh:

```tsx
// Pull-to-refresh indicator
const [refreshing, setRefreshing] = useState(false);

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {refreshing && (
    <div className="flex justify-center py-4">
      <Spinner className="animate-spin" />
    </div>
  )}
  {content}
</div>
```

### Swipe Actions

Add swipe gestures to list items:

```tsx
// Swipe-to-reveal actions
<div className="relative overflow-hidden">
  <div className="absolute right-0 top-0 bottom-0 flex">
    <button className="bg-destructive px-6">Delete</button>
  </div>
  <div
    className="relative bg-background transition-transform"
    style={{ transform: `translateX(${swipeOffset}px)` }}
  >
    {content}
  </div>
</div>
```

## Touch Interactions

### Tap Feedback

Provide immediate visual feedback:

```css
/* Tap highlight */
.touchable {
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s, opacity 0.1s;
}

.touchable:active {
  transform: scale(0.97);
  opacity: 0.7;
}
```

### Haptic Feedback

Trigger device vibration for important actions:

```tsx
const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = { light: 10, medium: 20, heavy: 30 };
    navigator.vibrate(patterns[style]);
  }
};
```

### Gesture Recognition

Common gesture patterns:
- **Tap**: Single quick touch
- **Long press**: Hold 500ms+ (context menu)
- **Swipe**: Quick horizontal/vertical movement
- **Pinch**: Two-finger zoom
- **Pan**: Continuous drag movement

## Safe Areas

### iOS Safe Areas

Handle notch, Dynamic Island, and home indicator:

```css
/* Safe area padding */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-all {
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
}
```

### Viewport Configuration

Proper viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1" />
```

## Mobile Typography

### Readable Sizes

Minimum sizes for mobile:
- Body text: 16px minimum (prevents iOS zoom on input focus)
- Secondary text: 14px minimum
- Captions: 12px minimum
- Line height: 1.4-1.6 for body

### Touch-Friendly Inputs

Prevent zoom and improve UX:

```css
input, select, textarea {
  font-size: 16px; /* Prevents iOS zoom */
  padding: 12px 16px;
  border-radius: 8px;
}
```

## Mobile Forms

### Best Practices

- Use appropriate input types (`tel`, `email`, `number`)
- Add `inputmode` attribute for keyboard hints
- Single-column form layout
- Large submit buttons (full width)
- Inline validation with clear messages
- Auto-focus first field on form open

```tsx
<input
  type="email"
  inputMode="email"
  autoComplete="email"
  className="w-full p-3 text-base rounded-lg"
/>
```

## Performance Patterns

### Skeleton Loading

Show content placeholders while loading:

```tsx
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
  <div className="h-4 bg-muted rounded w-1/2" />
</div>
```

### Optimistic UI

Update UI before server confirms:

```tsx
const handleLike = async () => {
  setLiked(true); // Optimistic update
  try {
    await api.like(id);
  } catch {
    setLiked(false); // Revert on error
  }
};
```

### Lazy Loading

Load content as needed:

```tsx
// Intersection Observer for lazy loading
const [ref, inView] = useInView({ triggerOnce: true });

return (
  <div ref={ref}>
    {inView ? <HeavyComponent /> : <Skeleton />}
  </div>
);
```

## Common Issues Checklist

When auditing mobile UX, check:

- [ ] Tap targets are 44x44px minimum
- [ ] No hover-only interactions
- [ ] Safe areas handled (notch, home indicator)
- [ ] Input font size is 16px+ (no iOS zoom)
- [ ] Touch feedback on interactive elements
- [ ] Bottom navigation for primary actions
- [ ] Modals replaced with bottom sheets
- [ ] Forms optimized for mobile keyboards
- [ ] Loading states visible (skeletons/spinners)
- [ ] Error states are touch-friendly
- [ ] Scroll performance is smooth
- [ ] No horizontal scroll on main content

## Additional Resources

### Reference Files

For detailed patterns and code examples:
- **`references/touch-patterns.md`** - Advanced touch interaction patterns
- **`references/platform-differences.md`** - iOS vs Android differences

### Examples

Working implementations in `examples/`:
- **`bottom-navigation.tsx`** - Complete bottom nav component
- **`bottom-sheet.tsx`** - Draggable bottom sheet
- **`swipe-list.tsx`** - Swipeable list items
