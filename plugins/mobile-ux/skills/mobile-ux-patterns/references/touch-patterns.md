# Advanced Touch Interaction Patterns

Comprehensive guide for implementing sophisticated touch interactions in web applications.

## Gesture Recognition System

### Touch Event Lifecycle

Understanding the complete touch event flow:

```typescript
interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  isActive: boolean;
}

const useTouchGesture = () => {
  const [touchState, setTouchState] = useState<TouchState | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      velocityX: 0,
      velocityY: 0,
      isActive: true,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchState?.isActive) return;

    const touch = e.touches[0];
    const deltaTime = Date.now() - touchState.startTime;

    setTouchState(prev => ({
      ...prev!,
      currentX: touch.clientX,
      currentY: touch.clientY,
      velocityX: (touch.clientX - prev!.startX) / deltaTime,
      velocityY: (touch.clientY - prev!.startY) / deltaTime,
    }));
  };

  const handleTouchEnd = () => {
    setTouchState(prev => prev ? { ...prev, isActive: false } : null);
  };

  return { touchState, handleTouchStart, handleTouchMove, handleTouchEnd };
};
```

### Gesture Classification

Classify touch gestures based on movement patterns:

```typescript
type GestureType = 'tap' | 'long-press' | 'swipe-left' | 'swipe-right' |
                   'swipe-up' | 'swipe-down' | 'pinch' | 'pan';

interface GestureConfig {
  tapMaxDuration: number;      // ms - max duration for tap
  longPressMinDuration: number; // ms - min duration for long press
  swipeMinDistance: number;     // px - min distance for swipe
  swipeMaxDuration: number;     // ms - max duration for swipe
  swipeVelocityThreshold: number; // px/ms - min velocity for swipe
}

const defaultConfig: GestureConfig = {
  tapMaxDuration: 200,
  longPressMinDuration: 500,
  swipeMinDistance: 50,
  swipeMaxDuration: 300,
  swipeVelocityThreshold: 0.3,
};

const classifyGesture = (
  touchState: TouchState,
  config: GestureConfig = defaultConfig
): GestureType => {
  const deltaX = touchState.currentX - touchState.startX;
  const deltaY = touchState.currentY - touchState.startY;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const duration = Date.now() - touchState.startTime;
  const velocity = Math.sqrt(touchState.velocityX ** 2 + touchState.velocityY ** 2);

  // Tap detection
  if (distance < 10 && duration < config.tapMaxDuration) {
    return 'tap';
  }

  // Long press detection
  if (distance < 10 && duration >= config.longPressMinDuration) {
    return 'long-press';
  }

  // Swipe detection
  if (distance >= config.swipeMinDistance &&
      duration <= config.swipeMaxDuration &&
      velocity >= config.swipeVelocityThreshold) {

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle >= -45 && angle < 45) return 'swipe-right';
    if (angle >= 45 && angle < 135) return 'swipe-down';
    if (angle >= -135 && angle < -45) return 'swipe-up';
    return 'swipe-left';
  }

  return 'pan';
};
```

## Pull-to-Refresh Implementation

Complete pull-to-refresh pattern with physics:

```typescript
interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 150;
const RESISTANCE = 2.5;

const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canRefresh: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    // Only enable if scrolled to top
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setState(prev => ({ ...prev, isPulling: true }));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!state.isPulling || state.isRefreshing) return;

    const deltaY = e.touches[0].clientY - startY.current;

    if (deltaY > 0) {
      e.preventDefault();

      // Apply resistance for rubber-band effect
      const pullDistance = Math.min(
        deltaY / RESISTANCE,
        MAX_PULL
      );

      setState(prev => ({
        ...prev,
        pullDistance,
        canRefresh: pullDistance >= PULL_THRESHOLD,
      }));
    }
  };

  const handleTouchEnd = async () => {
    if (state.canRefresh && !state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: PULL_THRESHOLD,
      }));

      try {
        await onRefresh();
      } finally {
        setState({
          isPulling: false,
          pullDistance: 0,
          isRefreshing: false,
          canRefresh: false,
        });
      }
    } else {
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
        canRefresh: false,
      });
    }
  };

  return {
    containerRef,
    state,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
```

### Pull-to-Refresh UI Component

```tsx
const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  threshold
}: {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div
      className="absolute left-0 right-0 flex justify-center transition-transform"
      style={{
        transform: `translateY(${pullDistance - 60}px)`,
        opacity: progress,
      }}
    >
      <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
        {isRefreshing ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className="w-5 h-5 text-primary transition-transform"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </div>
    </div>
  );
};
```

## Swipe Actions Pattern

Swipeable list item with reveal actions:

```typescript
interface SwipeActionsConfig {
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  overshootThreshold?: number;
}

interface SwipeAction {
  id: string;
  icon: React.ReactNode;
  color: string;
  onTrigger: () => void;
}

const useSwipeActions = (config: SwipeActionsConfig) => {
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState<'left' | 'right' | null>(null);

  const startX = useRef(0);
  const currentOffset = useRef(0);

  const threshold = config.threshold ?? 80;
  const overshootThreshold = config.overshootThreshold ?? 150;

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX - currentOffset.current;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX.current;

    // Limit swipe based on available actions
    let limitedDelta = deltaX;

    if (deltaX > 0 && !config.leftActions?.length) {
      limitedDelta = deltaX * 0.2; // Resistance
    }
    if (deltaX < 0 && !config.rightActions?.length) {
      limitedDelta = deltaX * 0.2;
    }

    // Apply max limits
    limitedDelta = Math.max(-overshootThreshold, Math.min(overshootThreshold, limitedDelta));

    setOffset(limitedDelta);
    currentOffset.current = limitedDelta;
  };

  const handleTouchEnd = () => {
    const absOffset = Math.abs(offset);

    if (absOffset >= overshootThreshold) {
      // Trigger primary action
      const actions = offset > 0 ? config.leftActions : config.rightActions;
      actions?.[0]?.onTrigger();
      snapTo(0);
    } else if (absOffset >= threshold) {
      // Open actions
      snapTo(offset > 0 ? threshold : -threshold);
      setIsOpen(offset > 0 ? 'left' : 'right');
    } else {
      // Close
      snapTo(0);
      setIsOpen(null);
    }
  };

  const snapTo = (target: number) => {
    setOffset(target);
    currentOffset.current = target;
  };

  const close = () => {
    snapTo(0);
    setIsOpen(null);
  };

  return {
    offset,
    isOpen,
    close,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
```

## Long Press Context Menu

Native-like long press with haptic feedback:

```typescript
const useLongPress = (
  onLongPress: () => void,
  options: {
    delay?: number;
    onStart?: () => void;
    onCancel?: () => void;
  } = {}
) => {
  const { delay = 500, onStart, onCancel } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const startPos = useRef({ x: 0, y: 0 });
  const isLongPressTriggered = useRef(false);

  const start = (e: TouchEvent | MouseEvent) => {
    const point = 'touches' in e ? e.touches[0] : e;
    startPos.current = { x: point.clientX, y: point.clientY };
    isLongPressTriggered.current = false;

    onStart?.();

    timeoutRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      triggerHaptic('medium');
      onLongPress();
    }, delay);
  };

  const move = (e: TouchEvent | MouseEvent) => {
    const point = 'touches' in e ? e.touches[0] : e;
    const distance = Math.sqrt(
      (point.clientX - startPos.current.x) ** 2 +
      (point.clientY - startPos.current.y) ** 2
    );

    // Cancel if moved too far
    if (distance > 10) {
      cancel();
    }
  };

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      if (!isLongPressTriggered.current) {
        onCancel?.();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: cancel,
    onMouseLeave: cancel,
  };
};

const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy') => {
  if ('vibrate' in navigator) {
    const patterns = { light: 10, medium: 25, heavy: 50 };
    navigator.vibrate(patterns[intensity]);
  }
};
```

## Pinch-to-Zoom

Image zoom with pinch gesture:

```typescript
const usePinchZoom = (options: {
  minScale?: number;
  maxScale?: number;
} = {}) => {
  const { minScale = 1, maxScale = 4 } = options;

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const initialDistance = useRef(0);
  const initialScale = useRef(1);
  const initialCenter = useRef({ x: 0, y: 0 });

  const getDistance = (touches: TouchList) => {
    return Math.sqrt(
      (touches[0].clientX - touches[1].clientX) ** 2 +
      (touches[0].clientY - touches[1].clientY) ** 2
    );
  };

  const getCenter = (touches: TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
      initialScale.current = scale;
      initialCenter.current = getCenter(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      const currentDistance = getDistance(e.touches);
      const currentCenter = getCenter(e.touches);

      // Calculate new scale
      const scaleChange = currentDistance / initialDistance.current;
      const newScale = Math.min(
        maxScale,
        Math.max(minScale, initialScale.current * scaleChange)
      );

      // Calculate position to zoom toward pinch center
      const deltaX = currentCenter.x - initialCenter.current.x;
      const deltaY = currentCenter.y - initialCenter.current.y;

      setScale(newScale);
      setPosition(prev => ({
        x: prev.x + deltaX * 0.5,
        y: prev.y + deltaY * 0.5,
      }));

      initialCenter.current = currentCenter;
    }
  };

  const handleTouchEnd = () => {
    // Snap back if below minimum
    if (scale < 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return {
    scale,
    position,
    reset,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    style: {
      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      transformOrigin: 'center center',
    },
  };
};
```

## Momentum Scrolling

Custom scrolling with momentum physics:

```typescript
const useMomentumScroll = (containerRef: RefObject<HTMLElement>) => {
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animationFrame = useRef<number>();

  const friction = 0.95;
  const minVelocity = 0.5;

  const handleTouchStart = (e: TouchEvent) => {
    cancelAnimationFrame(animationFrame.current!);
    lastY.current = e.touches[0].clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const currentTime = Date.now();
    const deltaY = lastY.current - currentY;
    const deltaTime = currentTime - lastTime.current;

    if (deltaTime > 0) {
      velocity.current = deltaY / deltaTime;
    }

    lastY.current = currentY;
    lastTime.current = currentTime;

    if (containerRef.current) {
      containerRef.current.scrollTop += deltaY;
    }
  };

  const handleTouchEnd = () => {
    const animate = () => {
      if (Math.abs(velocity.current) < minVelocity) {
        return;
      }

      if (containerRef.current) {
        containerRef.current.scrollTop += velocity.current * 16;
      }

      velocity.current *= friction;
      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrame.current!);
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};
```

## Touch Ripple Effect

Material Design-style ripple on touch:

```typescript
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const createRipple = (e: React.TouchEvent | React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();

    const point = 'touches' in e
      ? e.touches[0]
      : e;

    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;

    // Ripple should expand to cover entire element
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple: Ripple = {
      id: nextId.current++,
      x: x - size / 2,
      y: y - size / 2,
      size,
    };

    setRipples(prev => [...prev, ripple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  return { ripples, createRipple };
};

// Ripple component
const RippleContainer = ({ ripples }: { ripples: Ripple[] }) => (
  <span className="absolute inset-0 overflow-hidden pointer-events-none">
    {ripples.map(ripple => (
      <span
        key={ripple.id}
        className="absolute rounded-full bg-white/30 animate-ripple"
        style={{
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size,
        }}
      />
    ))}
  </span>
);

// CSS for ripple animation
// Add to global CSS:
// @keyframes ripple {
//   from { transform: scale(0); opacity: 1; }
//   to { transform: scale(1); opacity: 0; }
// }
// .animate-ripple { animation: ripple 0.6s ease-out; }
```

## Drag and Drop

Touch-friendly drag and drop:

```typescript
const useDragAndDrop = <T extends { id: string }>(
  items: T[],
  onReorder: (items: T[]) => void
) => {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleDragStart = (item: T, e: TouchEvent) => {
    setDraggedItem(item);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    triggerHaptic('light');
  };

  const handleDragMove = (e: TouchEvent) => {
    if (!draggedItem) return;

    currentY.current = e.touches[0].clientY;

    // Find item being dragged over
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);

    for (let i = 0; i < items.length; i++) {
      if (i === draggedIndex) continue;

      const element = itemRefs.current.get(items[i].id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (currentY.current < midY && i < draggedIndex) {
        setDragOverIndex(i);
        return;
      }
      if (currentY.current > midY && i > draggedIndex) {
        setDragOverIndex(i);
        return;
      }
    }
  };

  const handleDragEnd = () => {
    if (draggedItem && dragOverIndex !== null) {
      const newItems = [...items];
      const draggedIndex = items.findIndex(i => i.id === draggedItem.id);

      newItems.splice(draggedIndex, 1);
      newItems.splice(dragOverIndex, 0, draggedItem);

      onReorder(newItems);
      triggerHaptic('medium');
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const setItemRef = (id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return {
    draggedItem,
    dragOverIndex,
    setItemRef,
    handlers: {
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
    },
  };
};
```

## Best Practices Summary

1. **Always use passive event listeners** for scroll performance
2. **Debounce/throttle move handlers** to prevent jank
3. **Use CSS transforms** instead of top/left for animations
4. **Implement proper cancellation** for gesture interruptions
5. **Add visual feedback** during all touch interactions
6. **Consider accessibility** - provide alternatives for complex gestures
7. **Test on real devices** - emulators don't capture all touch nuances
8. **Handle edge cases** - multi-touch, interrupted gestures, rapid interactions
