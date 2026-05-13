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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useState, useMemo, useEffect } from "react";

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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

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
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/25">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight">ClientPulse</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isGroupActive =
              pathname === item.href ||
              item.children.some((c) => pathname === c.href);
            const isOpen = effectiveOpenGroups[item.href] ?? false;

            return (
              <div key={item.href} className="relative group">
                <button
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      return;
                    }
                    toggleGroup(item.href);
                  }}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isGroupActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {isGroupActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
                  )}
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
                {/* CSS tooltip for collapsed mode */}
                {collapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                    {item.title}
                  </div>
                )}

                {!collapsed && isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                            isChildActive
                              ? "bg-primary/10 text-primary font-medium"
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

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
                )}
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
              {/* CSS tooltip for collapsed mode */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {item.title}
                </div>
              )}
            </div>
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
