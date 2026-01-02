/**
 * Bottom Navigation Component
 *
 * Native-like bottom navigation bar for mobile web apps.
 * Features: Safe area support, haptic feedback, animated transitions.
 */

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Icons - replace with your icon library
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Navigation item type
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/" },
  { id: "search", label: "Search", icon: SearchIcon, href: "/search" },
  { id: "create", label: "Create", icon: PlusIcon, href: "/create" },
  { id: "favorites", label: "Favorites", icon: HeartIcon, href: "/favorites", badge: 3 },
  { id: "profile", label: "Profile", icon: UserIcon, href: "/profile" },
];

// Haptic feedback utility
const triggerHaptic = (intensity: "light" | "medium" = "light") => {
  if ("vibrate" in navigator) {
    const patterns = { light: 10, medium: 20 };
    navigator.vibrate(patterns[intensity]);
  }
};

// Navigation Item Component
interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const NavItemButton = ({ item, isActive, onClick }: NavItemProps) => {
  const Icon = item.icon;

  const handleClick = () => {
    triggerHaptic("light");
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center",
        "min-w-[64px] min-h-[48px] py-1 px-2",
        "transition-all duration-200",
        "active:scale-95 active:opacity-70",
        // Prevent tap highlight
        "tap-highlight-transparent"
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Icon container with optional badge */}
      <div className="relative">
        <Icon
          className={cn(
            "h-6 w-6 transition-all duration-200",
            isActive
              ? "text-primary stroke-[2.5px]"
              : "text-muted-foreground stroke-[1.5px]"
          )}
        />

        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1.5",
              "min-w-[16px] h-4 px-1",
              "flex items-center justify-center",
              "text-[10px] font-medium text-white",
              "bg-red-500 rounded-full"
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          "text-[10px] mt-1 transition-all duration-200",
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        )}
      >
        {item.label}
      </span>

      {/* Active indicator dot */}
      <div
        className={cn(
          "absolute bottom-1 w-1 h-1 rounded-full",
          "transition-all duration-200",
          isActive ? "bg-primary opacity-100" : "opacity-0"
        )}
      />
    </button>
  );
};

// Main Bottom Navigation Component
interface BottomNavigationProps {
  items?: NavItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  onNavigate?: (href: string) => void;
  className?: string;
  hideLabels?: boolean;
  elevated?: boolean;
}

export const BottomNavigation = ({
  items = defaultNavItems,
  activeId,
  onChange,
  onNavigate,
  className,
  hideLabels = false,
  elevated = true,
}: BottomNavigationProps) => {
  const [active, setActive] = useState(activeId || items[0]?.id);

  // Sync with external activeId
  useEffect(() => {
    if (activeId) setActive(activeId);
  }, [activeId]);

  const handleItemClick = (item: NavItem) => {
    setActive(item.id);
    onChange?.(item.id);
    onNavigate?.(item.href);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-lg",
        "border-t border-border/50",
        elevated && "shadow-[0_-2px_10px_rgba(0,0,0,0.1)]",
        className
      )}
      style={{
        // Safe area support
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around h-[56px] max-w-lg mx-auto">
        {items.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </nav>
  );
};

// Variant: Bottom Navigation with FAB (Floating Action Button)
export const BottomNavigationWithFAB = ({
  items = defaultNavItems,
  activeId,
  onChange,
  onNavigate,
  onFABClick,
  fabIcon: FABIcon = PlusIcon,
  className,
}: BottomNavigationProps & {
  onFABClick?: () => void;
  fabIcon?: React.ComponentType<{ className?: string }>;
}) => {
  const [active, setActive] = useState(activeId || items[0]?.id);

  // Split items for left and right of FAB
  const midIndex = Math.floor(items.length / 2);
  const leftItems = items.slice(0, midIndex);
  const rightItems = items.slice(midIndex);

  const handleItemClick = (item: NavItem) => {
    setActive(item.id);
    onChange?.(item.id);
    onNavigate?.(item.href);
  };

  const handleFABClick = () => {
    triggerHaptic("medium");
    onFABClick?.();
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-lg",
        "border-t border-border/50",
        className
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="relative flex items-center justify-around h-[56px] max-w-lg mx-auto">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => handleItemClick(item)}
          />
        ))}

        {/* FAB spacer */}
        <div className="w-16" />

        {/* Right items */}
        {rightItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => handleItemClick(item)}
          />
        ))}

        {/* Floating Action Button */}
        <button
          onClick={handleFABClick}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 -top-7",
            "w-14 h-14 rounded-full",
            "bg-primary text-primary-foreground",
            "flex items-center justify-center",
            "shadow-lg shadow-primary/30",
            "transition-all duration-200",
            "active:scale-95 active:shadow-md"
          )}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <FABIcon className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

// Usage Example Component
export const BottomNavigationDemo = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen pb-20">
      {/* Page content */}
      <main className="p-4">
        <h1 className="text-xl font-semibold">
          Current Tab: {activeTab}
        </h1>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeId={activeTab}
        onChange={setActiveTab}
        onNavigate={(href) => console.log("Navigate to:", href)}
      />
    </div>
  );
};

export default BottomNavigation;
