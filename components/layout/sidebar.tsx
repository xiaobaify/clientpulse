"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useState, useMemo } from "react";

interface NavChild {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    title: "仪表盘",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "用户管理",
    href: "/users",
    icon: Users,
  },
  {
    title: "项目管理",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "订阅计费",
    href: "/billing",
    icon: CreditCard,
    children: [
      { title: "套餐配置", href: "/billing/plans" },
      { title: "发票列表", href: "/billing/invoices" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Track which parent groups are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-expand groups that contain the active route
  const effectiveOpenGroups = useMemo(() => {
    const result = { ...openGroups };
    for (const item of navItems) {
      if (item.children) {
        const isGroupActive =
          pathname === item.href ||
          item.children.some((c) => pathname === c.href);
        if (isGroupActive) {
          result[item.href] = true;
        }
      }
    }
    return result;
  }, [openGroups, pathname]);

  function toggleGroup(href: string) {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <Link href="/" className="font-bold text-lg">
            ClientPulse
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            // Parent with children: highlight when on parent or any child route
            const isGroupActive =
              pathname === item.href ||
              item.children.some((c) => pathname === c.href);
            const isOpen = effectiveOpenGroups[item.href] ?? false;

            return (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (collapsed) return;
                    toggleGroup(item.href);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isGroupActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-150",
                          isOpen && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "bg-primary/15 text-primary font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular item (no children)
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2 space-y-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
