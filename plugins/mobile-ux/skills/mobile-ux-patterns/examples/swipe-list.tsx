/**
 * Swipeable List Component
 *
 * Native-like swipeable list items with reveal actions.
 * Features: Swipe left/right actions, velocity detection, haptic feedback.
 */

"use client";

import {
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// Haptic feedback utility
const triggerHaptic = (intensity: "light" | "medium" = "light") => {
  if ("vibrate" in navigator) {
    navigator.vibrate(intensity === "light" ? 10 : 20);
  }
};

// Action type
interface SwipeAction {
  id: string;
  label: string;
  icon?: ReactNode;
  color: string;
  textColor?: string;
  onTrigger: () => void;
}

// Configuration
interface SwipeConfig {
  threshold: number; // Min distance to reveal actions
  overshootThreshold: number; // Distance to auto-trigger primary action
  velocityThreshold: number; // Velocity for momentum-based reveal
}

const defaultConfig: SwipeConfig = {
  threshold: 80,
  overshootThreshold: 180,
  velocityThreshold: 0.5,
};

// Individual swipeable item hook
const useSwipeableItem = (
  config: SwipeConfig,
  leftActions?: SwipeAction[],
  rightActions?: SwipeAction[]
) => {
  const [offset, setOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startX = useRef(0);
  const currentOffset = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);

  const resetPosition = () => {
    setIsAnimating(true);
    setOffset(0);
    currentOffset.current = 0;
    setIsRevealed(null);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;

    startX.current = e.touches[0].clientX - currentOffset.current;
    lastX.current = e.touches[0].clientX;
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAnimating) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (currentX - lastX.current) / dt;
    }
    lastX.current = currentX;
    lastTime.current = now;

    // Apply resistance if no actions on that side
    let constrainedDelta = deltaX;

    if (deltaX > 0 && !leftActions?.length) {
      constrainedDelta = deltaX * 0.2;
    }
    if (deltaX < 0 && !rightActions?.length) {
      constrainedDelta = deltaX * 0.2;
    }

    // Apply max limits with rubber-band effect
    const maxOffset = config.overshootThreshold + 50;
    if (Math.abs(constrainedDelta) > maxOffset) {
      const overflow = Math.abs(constrainedDelta) - maxOffset;
      constrainedDelta =
        Math.sign(constrainedDelta) * (maxOffset + overflow * 0.1);
    }

    setOffset(constrainedDelta);
    currentOffset.current = constrainedDelta;
  };

  const handleTouchEnd = () => {
    if (isAnimating) return;

    const absOffset = Math.abs(offset);
    const absVelocity = Math.abs(velocity.current);

    // Determine direction
    const direction = offset > 0 ? "left" : "right";
    const actions = direction === "left" ? leftActions : rightActions;

    // Auto-trigger if overshoot threshold exceeded
    if (absOffset >= config.overshootThreshold && actions?.length) {
      triggerHaptic("medium");
      actions[0].onTrigger();
      resetPosition();
      return;
    }

    // Reveal actions if threshold exceeded or high velocity
    if (
      (absOffset >= config.threshold || absVelocity >= config.velocityThreshold) &&
      actions?.length
    ) {
      const revealOffset = direction === "left" ? config.threshold : -config.threshold;
      setIsAnimating(true);
      setOffset(revealOffset);
      currentOffset.current = revealOffset;
      setIsRevealed(direction);
      triggerHaptic("light");
      setTimeout(() => setIsAnimating(false), 300);
      return;
    }

    // Reset position
    resetPosition();
  };

  return {
    offset,
    isRevealed,
    isAnimating,
    resetPosition,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

// Single Swipeable Item Component
interface SwipeableItemProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  config?: Partial<SwipeConfig>;
  className?: string;
  onSwipeOpen?: (direction: "left" | "right") => void;
  onSwipeClose?: () => void;
}

export const SwipeableItem = ({
  children,
  leftActions = [],
  rightActions = [],
  config: customConfig,
  className,
  onSwipeOpen,
  onSwipeClose,
}: SwipeableItemProps) => {
  const config = { ...defaultConfig, ...customConfig };
  const {
    offset,
    isRevealed,
    isAnimating,
    resetPosition,
    handlers,
  } = useSwipeableItem(config, leftActions, rightActions);

  // Notify parent of state changes
  useEffect(() => {
    if (isRevealed) {
      onSwipeOpen?.(isRevealed);
    } else if (!isAnimating && offset === 0) {
      onSwipeClose?.();
    }
  }, [isRevealed, isAnimating, offset, onSwipeOpen, onSwipeClose]);

  const handleActionClick = (action: SwipeAction) => {
    triggerHaptic("light");
    action.onTrigger();
    resetPosition();
  };

  // Calculate action button widths based on offset
  const leftActionsWidth = Math.max(0, offset);
  const rightActionsWidth = Math.max(0, -offset);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left actions (revealed on swipe right) */}
      {leftActions.length > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 flex"
          style={{ width: leftActionsWidth }}
        >
          {leftActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center justify-center gap-2",
                "flex-1 px-4",
                "text-sm font-medium",
                "transition-opacity",
                leftActionsWidth > 40 ? "opacity-100" : "opacity-0"
              )}
              style={{
                backgroundColor: action.color,
                color: action.textColor || "white",
              }}
            >
              {action.icon}
              {leftActionsWidth > 80 && (
                <span className="whitespace-nowrap">{action.label}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Right actions (revealed on swipe left) */}
      {rightActions.length > 0 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex"
          style={{ width: rightActionsWidth }}
        >
          {rightActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center justify-center gap-2",
                "flex-1 px-4",
                "text-sm font-medium",
                "transition-opacity",
                rightActionsWidth > 40 ? "opacity-100" : "opacity-0"
              )}
              style={{
                backgroundColor: action.color,
                color: action.textColor || "white",
              }}
            >
              {rightActionsWidth > 80 && (
                <span className="whitespace-nowrap">{action.label}</span>
              )}
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          "relative bg-background",
          isAnimating && "transition-transform duration-300 ease-out"
        )}
        style={{
          transform: `translateX(${offset}px)`,
        }}
        {...handlers}
      >
        {children}
      </div>
    </div>
  );
};

// Swipeable List Component
interface ListItem {
  id: string;
  [key: string]: any;
}

interface SwipeableListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  leftActions?: (item: T) => SwipeAction[];
  rightActions?: (item: T) => SwipeAction[];
  config?: Partial<SwipeConfig>;
  className?: string;
  itemClassName?: string;
}

export const SwipeableList = <T extends ListItem>({
  items,
  renderItem,
  leftActions,
  rightActions,
  config,
  className,
  itemClassName,
}: SwipeableListProps<T>) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item, index) => (
        <SwipeableItem
          key={item.id}
          leftActions={leftActions?.(item)}
          rightActions={rightActions?.(item)}
          config={config}
          className={itemClassName}
          onSwipeOpen={() => setOpenItemId(item.id)}
          onSwipeClose={() => {
            if (openItemId === item.id) {
              setOpenItemId(null);
            }
          }}
        >
          {renderItem(item, index)}
        </SwipeableItem>
      ))}
    </div>
  );
};

// Icons for demo
const TrashIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ArchiveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

// Demo messages data
interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
}

const demoMessages: Message[] = [
  {
    id: "1",
    sender: "John Doe",
    subject: "Meeting tomorrow",
    preview: "Hi, just wanted to confirm our meeting tomorrow at 10am...",
    time: "10:30 AM",
    isRead: false,
    isStarred: false,
  },
  {
    id: "2",
    sender: "Jane Smith",
    subject: "Project update",
    preview: "The project is progressing well. Here's a quick update...",
    time: "9:15 AM",
    isRead: true,
    isStarred: true,
  },
  {
    id: "3",
    sender: "Support Team",
    subject: "Your ticket has been resolved",
    preview: "We've resolved your support ticket #12345...",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
  },
];

// Usage Example - Email-like list
export const SwipeableListDemo = () => {
  const [messages, setMessages] = useState(demoMessages);

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleArchive = (id: string) => {
    console.log("Archive:", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isStarred: !m.isStarred } : m
      )
    );
  };

  const handleFlag = (id: string) => {
    console.log("Flag:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <h1 className="text-xl font-semibold">Inbox</h1>
      </header>

      <SwipeableList
        items={messages}
        leftActions={(item) => [
          {
            id: "star",
            label: item.isStarred ? "Unstar" : "Star",
            icon: <StarIcon />,
            color: "#f59e0b",
            onTrigger: () => handleStar(item.id),
          },
          {
            id: "flag",
            label: "Flag",
            icon: <FlagIcon />,
            color: "#8b5cf6",
            onTrigger: () => handleFlag(item.id),
          },
        ]}
        rightActions={(item) => [
          {
            id: "archive",
            label: "Archive",
            icon: <ArchiveIcon />,
            color: "#3b82f6",
            onTrigger: () => handleArchive(item.id),
          },
          {
            id: "delete",
            label: "Delete",
            icon: <TrashIcon />,
            color: "#ef4444",
            onTrigger: () => handleDelete(item.id),
          },
        ]}
        renderItem={(message) => (
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {message.sender.charAt(0)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm",
                      !message.isRead && "font-semibold"
                    )}
                  >
                    {message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.time}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm truncate",
                    !message.isRead && "font-medium"
                  )}
                >
                  {message.subject}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {message.preview}
                </p>
              </div>

              {/* Star indicator */}
              {message.isStarred && (
                <StarIcon />
              )}
            </div>
          </div>
        )}
      />

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>No messages</p>
        </div>
      )}
    </div>
  );
};

export default SwipeableList;
