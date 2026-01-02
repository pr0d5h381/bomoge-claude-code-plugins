# iOS vs Android Platform Differences

Comprehensive guide to platform-specific considerations for mobile web development.

## Visual Design Differences

### Navigation Patterns

| Aspect | iOS | Android |
|--------|-----|---------|
| Primary navigation | Tab bar at bottom | Navigation drawer + bottom nav |
| Back navigation | Swipe from left edge | System back button/gesture |
| Header style | Large titles, blur effect | Material app bar |
| Tab icons | Outline when inactive | Filled icons |

### Typography

| Element | iOS | Android |
|---------|-----|---------|
| System font | SF Pro | Roboto |
| Title weight | Semibold (600) | Medium (500) |
| Body size | 17px | 16px |
| Caption size | 12px | 12px |
| Line height | 1.3 | 1.5 |

```css
/* Cross-platform system font stack */
.system-font {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* iOS-like large title */
.ios-large-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

/* Android-like headline */
.android-headline {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0;
}
```

### Color System

**iOS:**
- Uses semantic colors that adapt to Dark Mode
- Emphasis on translucency and blur
- Accent color (tint) consistent throughout app

**Android:**
- Material Design color roles
- Surface colors with elevation
- Primary/secondary color system

```css
/* iOS-style semantic colors */
:root {
  --ios-label: #000000;
  --ios-secondary-label: #3c3c4399;
  --ios-tertiary-label: #3c3c434d;
  --ios-system-background: #ffffff;
  --ios-secondary-background: #f2f2f7;
  --ios-separator: #3c3c4349;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ios-label: #ffffff;
    --ios-secondary-label: #ebebf599;
    --ios-tertiary-label: #ebebf54d;
    --ios-system-background: #000000;
    --ios-secondary-background: #1c1c1e;
    --ios-separator: #54545899;
  }
}

/* Android Material 3 color roles */
:root {
  --md-primary: #6750A4;
  --md-on-primary: #FFFFFF;
  --md-surface: #FFFBFE;
  --md-on-surface: #1C1B1F;
  --md-surface-variant: #E7E0EC;
  --md-outline: #79747E;
}
```

## Interaction Patterns

### Touch Feedback

**iOS:**
- Subtle opacity change (0.7-0.8)
- Scale down slightly (0.97-0.98)
- No ripple effect

**Android:**
- Ripple effect from touch point
- State layers (hover, focus, press)
- Elevation changes

```tsx
// iOS-style touch feedback
const IOSTouchable = ({ children, onPress }) => (
  <button
    onClick={onPress}
    className="active:opacity-70 active:scale-[0.98] transition-all duration-100"
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    {children}
  </button>
);

// Android-style with ripple
const AndroidTouchable = ({ children, onPress }) => {
  const { ripples, createRipple } = useRipple();

  return (
    <button
      onClick={onPress}
      onTouchStart={createRipple}
      className="relative overflow-hidden"
    >
      {children}
      <RippleContainer ripples={ripples} />
    </button>
  );
};

// Platform-adaptive
const Touchable = ({ children, onPress }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return isIOS
    ? <IOSTouchable onPress={onPress}>{children}</IOSTouchable>
    : <AndroidTouchable onPress={onPress}>{children}</AndroidTouchable>;
};
```

### Gestures

| Gesture | iOS | Android |
|---------|-----|---------|
| Back | Swipe from left edge (anywhere) | Swipe from left/right edge |
| Dismiss modal | Swipe down | Swipe down or tap outside |
| Pull to refresh | Native overscroll | Custom implementation often |
| Delete item | Swipe left to reveal | Swipe left/right |
| Reorder | Long press + drag | Long press + drag |

```typescript
// iOS edge swipe detection
const useIOSEdgeSwipe = (onBack: () => void) => {
  const startX = useRef(0);
  const isEdgeSwipe = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    // iOS edge swipe starts within 20px of left edge
    isEdgeSwipe.current = startX.current < 20;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isEdgeSwipe.current) return;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX.current;

    // Trigger back if swiped more than 100px right
    if (deltaX > 100) {
      onBack();
    }
  };

  return { handleTouchStart, handleTouchEnd };
};

// Android back gesture (both edges)
const useAndroidBackGesture = (onBack: () => void) => {
  const startX = useRef(0);
  const startEdge = useRef<'left' | 'right' | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    const screenWidth = window.innerWidth;

    if (startX.current < 24) {
      startEdge.current = 'left';
    } else if (startX.current > screenWidth - 24) {
      startEdge.current = 'right';
    } else {
      startEdge.current = null;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!startEdge.current) return;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX.current;

    const shouldTrigger = startEdge.current === 'left'
      ? deltaX > 80
      : deltaX < -80;

    if (shouldTrigger) {
      onBack();
    }
  };

  return { handleTouchStart, handleTouchEnd };
};
```

## Safe Areas

### iOS Safe Areas

Handle Dynamic Island, notch, and home indicator:

```css
/* iOS safe areas */
.ios-safe-top {
  padding-top: env(safe-area-inset-top);
}

.ios-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Fixed header with safe area */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: calc(env(safe-area-inset-top) + 8px);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Fixed bottom bar */
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Android System Bars

Handle status bar, navigation bar, and gesture navigation:

```typescript
// Detect Android gesture navigation
const useAndroidNavMode = () => {
  const [navMode, setNavMode] = useState<'buttons' | 'gesture'>('gesture');

  useEffect(() => {
    // Check if gesture navigation is active
    // Gesture nav has smaller bottom inset
    const bottomInset = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--sab') || '0'
    );

    setNavMode(bottomInset < 48 ? 'gesture' : 'buttons');
  }, []);

  return navMode;
};
```

### Viewport Configuration

```html
<!-- iOS: Enable safe area handling -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<!-- iOS: Status bar style -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- Android: Theme color for browser chrome -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
```

## Form Inputs

### Keyboard Differences

| Input Type | iOS Keyboard | Android Keyboard |
|------------|--------------|------------------|
| `type="email"` | @ and . prominent | @ symbol available |
| `type="tel"` | Phone keypad | Phone keypad |
| `type="number"` | Number pad only | Number row + keyboard |
| `type="url"` | .com, / prominent | .com shortcut |
| `inputmode="decimal"` | Number pad with . | Number pad with . |

```tsx
// Platform-optimized input
const OptimizedInput = ({ type, ...props }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // iOS zoom prevention: font-size must be 16px+
  const baseFontSize = isIOS ? 16 : 14;

  return (
    <input
      type={type}
      {...props}
      style={{
        fontSize: baseFontSize,
        // iOS: remove inner shadow
        ...(isIOS && {
          WebkitAppearance: 'none',
          borderRadius: 8,
        }),
      }}
      // Android: proper autocomplete
      autoComplete={props.autoComplete || 'off'}
    />
  );
};
```

### Date/Time Pickers

**iOS:**
- Native picker UI (spinner)
- Opens inline or as popover
- Excellent UX, use native when possible

**Android:**
- Material date picker dialog
- Calendar view for dates
- Clock view for time

```tsx
// Cross-platform date picker approach
const DatePicker = ({ value, onChange }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // Use native iOS picker
    return (
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 text-base"
      />
    );
  }

  // Custom picker for Android (better UX than native)
  return (
    <CustomDatePicker
      value={value}
      onChange={onChange}
      format="YYYY-MM-DD"
    />
  );
};
```

## Modal Presentations

### iOS Sheet Styles

```tsx
// iOS-style modal sheet
const IOSSheet = ({ isOpen, onClose, children }) => (
  <div
    className={cn(
      "fixed inset-0 z-50 transition-opacity",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={onClose}
    />

    {/* Sheet */}
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0",
        "bg-background rounded-t-[10px]",
        "transform transition-transform duration-300",
        "safe-area-bottom",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Grabber */}
      <div className="flex justify-center pt-2 pb-4">
        <div className="w-9 h-1 bg-gray-300 rounded-full" />
      </div>

      {children}
    </div>
  </div>
);
```

### Android Dialog Styles

```tsx
// Android Material dialog
const AndroidDialog = ({ isOpen, onClose, children }) => (
  <div
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      "transition-opacity",
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    )}
  >
    {/* Scrim */}
    <div
      className="absolute inset-0 bg-black/32"
      onClick={onClose}
    />

    {/* Dialog */}
    <div
      className={cn(
        "relative bg-surface rounded-[28px] p-6",
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        "max-w-[560px] w-full",
        "transform transition-all duration-200",
        isOpen ? "scale-100" : "scale-95"
      )}
    >
      {children}
    </div>
  </div>
);
```

## Platform Detection

### Reliable Detection Methods

```typescript
// Platform detection utilities
export const platform = {
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  },

  isAndroid: () => {
    return /Android/.test(navigator.userAgent);
  },

  isMobile: () => {
    return platform.isIOS() || platform.isAndroid();
  },

  isStandalone: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  },

  isSafari: () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },

  isChrome: () => {
    return /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  },

  // iOS version (returns null if not iOS)
  iOSVersion: () => {
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3] || '0', 10),
      };
    }
    return null;
  },

  // Android version (returns null if not Android)
  androidVersion: () => {
    const match = navigator.userAgent.match(/Android (\d+)\.?(\d+)?\.?(\d+)?/);
    if (match) {
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2] || '0', 10),
        patch: parseInt(match[3] || '0', 10),
      };
    }
    return null;
  },
};

// React hook for platform
export const usePlatform = () => {
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isStandalone: false,
  });

  useEffect(() => {
    setPlatformInfo({
      isIOS: platform.isIOS(),
      isAndroid: platform.isAndroid(),
      isMobile: platform.isMobile(),
      isStandalone: platform.isStandalone(),
    });
  }, []);

  return platformInfo;
};
```

## Haptic Feedback

### iOS Haptics

iOS supports fine-grained haptic feedback through the Taptic Engine:

```typescript
// iOS haptic types (via CSS touch-action or vibration API)
const iOSHaptics = {
  // Light impact - subtle feedback
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },

  // Medium impact - standard feedback
  medium: () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
  },

  // Heavy impact - strong feedback
  heavy: () => {
    if ('vibrate' in navigator) navigator.vibrate(30);
  },

  // Selection changed
  selection: () => {
    if ('vibrate' in navigator) navigator.vibrate(5);
  },

  // Success notification
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
  },

  // Warning notification
  warning: () => {
    if ('vibrate' in navigator) navigator.vibrate([20, 40, 20]);
  },

  // Error notification
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([30, 30, 30, 30, 30]);
  },
};
```

### Cross-Platform Haptics

```typescript
const triggerHaptic = (
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'
) => {
  if (!('vibrate' in navigator)) return;

  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    warning: [20, 40, 20],
    error: [30, 30, 30, 30, 30],
  };

  navigator.vibrate(patterns[type]);
};

// Usage with interaction
const handleToggle = (newValue: boolean) => {
  triggerHaptic('light');
  setValue(newValue);
};

const handleSuccess = () => {
  triggerHaptic('success');
  showSuccessMessage();
};

const handleError = () => {
  triggerHaptic('error');
  showErrorMessage();
};
```

## Scroll Behavior

### iOS Rubber Banding

iOS has native rubber band (bounce) scrolling. To match on web:

```css
/* Enable iOS rubber band effect */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: auto;
}

/* Disable rubber band (for custom implementation) */
.no-bounce {
  overscroll-behavior: none;
}

/* Custom rubber band for non-iOS */
.custom-bounce {
  overscroll-behavior: contain;
}
```

### Android Overscroll

Android uses edge glow effect (Material 2) or stretch (Material 3):

```css
/* Android Material 3 stretch effect */
.android-overscroll {
  overscroll-behavior: auto;
}

/* Match iOS behavior on Android */
.ios-style-scroll {
  overscroll-behavior-y: contain;
}
```

## Performance Considerations

### iOS-Specific

```css
/* Fix iOS scroll performance */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  transform: translateZ(0);
}

/* Prevent iOS text size adjustment */
body {
  -webkit-text-size-adjust: 100%;
}

/* Hardware acceleration for animations */
.animated {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### Android-Specific

```css
/* Prevent highlight color on Android */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Improve scroll performance */
.scroll-container {
  will-change: scroll-position;
}

/* Reduce repaints */
.fixed-element {
  contain: layout style paint;
}
```

## Summary: Adaptive Strategy

Create platform-adaptive experiences:

```tsx
const AdaptiveComponent = () => {
  const { isIOS, isAndroid } = usePlatform();

  return (
    <div className={cn(
      "base-styles",
      isIOS && "ios-specific-styles",
      isAndroid && "android-specific-styles"
    )}>
      {isIOS ? <IOSVariant /> : <AndroidVariant />}
    </div>
  );
};
```

**Key principles:**
1. Start with platform-agnostic base styles
2. Add platform-specific enhancements
3. Test on real devices (emulators miss nuances)
4. Consider user expectations from native apps
5. Progressive enhancement over degradation
