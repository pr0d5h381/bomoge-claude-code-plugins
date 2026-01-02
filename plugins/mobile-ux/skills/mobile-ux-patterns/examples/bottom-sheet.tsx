/**
 * Bottom Sheet Component
 *
 * Native-like draggable bottom sheet for mobile web apps.
 * Features: Drag to dismiss, snap points, keyboard handling.
 */

"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// Haptic feedback utility
const triggerHaptic = (intensity: "light" | "medium" = "light") => {
  if ("vibrate" in navigator) {
    navigator.vibrate(intensity === "light" ? 10 : 20);
  }
};

// Snap point type
type SnapPoint = number | "content";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: SnapPoint[];
  initialSnap?: number;
  title?: string;
  className?: string;
  showHandle?: boolean;
  closeOnBackdropClick?: boolean;
  closeThreshold?: number;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  title,
  className,
  showHandle = true,
  closeOnBackdropClick = true,
  closeThreshold = 0.25,
}: BottomSheetProps) => {
  const [currentHeight, setCurrentHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Calculate actual height from snap point
  const getSnapHeight = useCallback(
    (snapPoint: SnapPoint): number => {
      const windowHeight = window.innerHeight;

      if (snapPoint === "content") {
        return contentRef.current?.scrollHeight || windowHeight * 0.5;
      }

      return windowHeight * snapPoint;
    },
    []
  );

  // Initialize height when opened
  useEffect(() => {
    if (isOpen) {
      const height = getSnapHeight(snapPoints[initialSnap]);
      setCurrentHeight(height);
      setCurrentSnapIndex(initialSnap);
      document.body.style.overflow = "hidden";
    } else {
      setCurrentHeight(0);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialSnap, snapPoints, getSnapHeight]);

  // Find nearest snap point
  const findNearestSnap = (height: number): number => {
    let nearestIndex = 0;
    let minDistance = Infinity;

    snapPoints.forEach((point, index) => {
      const snapHeight = getSnapHeight(point);
      const distance = Math.abs(height - snapHeight);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow dragging from the handle or header area
    const target = e.target as HTMLElement;
    const isHandle = target.closest("[data-sheet-handle]");
    const isHeader = target.closest("[data-sheet-header]");

    if (!isHandle && !isHeader) return;

    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = currentHeight;
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaY = startY.current - e.touches[0].clientY;
    const newHeight = Math.max(0, startHeight.current + deltaY);

    // Apply resistance at extremes
    const maxHeight = window.innerHeight * 0.95;
    const resistedHeight =
      newHeight > maxHeight
        ? maxHeight + (newHeight - maxHeight) * 0.3
        : newHeight;

    setCurrentHeight(resistedHeight);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const windowHeight = window.innerHeight;
    const heightRatio = currentHeight / windowHeight;

    // Close if below threshold
    if (heightRatio < closeThreshold) {
      triggerHaptic("light");
      onClose();
      return;
    }

    // Snap to nearest point
    const nearestIndex = findNearestSnap(currentHeight);
    const snapHeight = getSnapHeight(snapPoints[nearestIndex]);

    if (nearestIndex !== currentSnapIndex) {
      triggerHaptic("light");
    }

    setCurrentSnapIndex(nearestIndex);
    setCurrentHeight(snapHeight);
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      triggerHaptic("light");
      onClose();
    }
  };

  // Snap to specific point
  const snapTo = (index: number) => {
    if (index >= 0 && index < snapPoints.length) {
      const height = getSnapHeight(snapPoints[index]);
      setCurrentSnapIndex(index);
      setCurrentHeight(height);
      triggerHaptic("light");
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleBackdropClick}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "bg-background rounded-t-[16px]",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.15)]",
          isDragging ? "" : "transition-all duration-300 ease-out",
          className
        )}
        style={{
          height: currentHeight,
          paddingBottom: "env(safe-area-inset-bottom)",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div
            data-sheet-handle
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header with title */}
        {title && (
          <div
            data-sheet-header
            className="px-4 pb-3 border-b border-border/50"
          >
            <h2 className="text-lg font-semibold text-center">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            maxHeight: `calc(100% - ${showHandle ? "44px" : "0px"} - ${
              title ? "52px" : "0px"
            })`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Action Sheet variant (list of actions)
interface ActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: ActionItem[];
  cancelLabel?: string;
}

export const ActionSheet = ({
  isOpen,
  onClose,
  title,
  message,
  actions,
  cancelLabel = "Cancel",
}: ActionSheetProps) => {
  const handleAction = (action: ActionItem) => {
    if (action.disabled) return;
    triggerHaptic("light");
    action.onSelect();
    onClose();
  };

  const handleCancel = () => {
    triggerHaptic("light");
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0",
          "px-2 transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
        }}
      >
        {/* Actions group */}
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Header */}
          {(title || message) && (
            <div className="px-4 py-3 text-center border-b border-border/50">
              {title && (
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {message && (
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
              )}
            </div>
          )}

          {/* Action items */}
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "px-4 py-3 text-lg",
                "transition-colors duration-150",
                "active:bg-muted/50",
                index > 0 && "border-t border-border/50",
                action.destructive
                  ? "text-red-500"
                  : "text-primary",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          className={cn(
            "w-full mt-2 px-4 py-3",
            "bg-background/95 backdrop-blur-xl rounded-2xl",
            "text-lg font-semibold text-primary",
            "transition-colors duration-150",
            "active:bg-muted/50"
          )}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};

// Confirmation Sheet variant
interface ConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export const ConfirmationSheet = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmationSheetProps) => {
  const actions: ActionItem[] = [
    {
      id: "confirm",
      label: confirmLabel,
      destructive,
      onSelect: onConfirm,
    },
  ];

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      actions={actions}
      cancelLabel={cancelLabel}
    />
  );
};

// Usage Example
export const BottomSheetDemo = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => setIsSheetOpen(true)}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg"
      >
        Open Bottom Sheet
      </button>

      <button
        onClick={() => setIsActionSheetOpen(true)}
        className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg"
      >
        Open Action Sheet
      </button>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Sheet Title"
        snapPoints={[0.4, 0.7, 0.9]}
      >
        <div className="p-4 space-y-4">
          <p>Drag the handle to resize or dismiss.</p>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            Sheet Content
          </div>
        </div>
      </BottomSheet>

      {/* Action Sheet */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        title="Choose an action"
        message="Select one of the options below"
        actions={[
          { id: "edit", label: "Edit", onSelect: () => console.log("Edit") },
          { id: "share", label: "Share", onSelect: () => console.log("Share") },
          {
            id: "delete",
            label: "Delete",
            destructive: true,
            onSelect: () => console.log("Delete"),
          },
        ]}
      />
    </div>
  );
};

export default BottomSheet;
