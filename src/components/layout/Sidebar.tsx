"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Database,
  Briefcase,
  MessagesSquare,
  Bookmark,
  Settings,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Continue Learning", icon: BookOpen, href: "/learn" },
  { label: "Practice", icon: Code2, href: "/practice" },
  { label: "Playground", icon: Database, href: "/playground/sql" },
  { label: "Projects", icon: Briefcase, href: "/projects" },
  { label: "Interview Prep", icon: MessagesSquare, href: "/interview" },
  { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-[240px] h-[calc(100vh-4rem)] border-r bg-background shrink-0 sticky top-16"
    >
      <div className="p-6 border-b">
        {isLoaded && user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="w-10 h-10 rounded-full bg-muted"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm truncate max-w-[140px]">
                {user.fullName}
              </span>
              <span className="text-xs text-primary font-medium">Lvl. 1 Scholar</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-1 w-full">
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
              <div className="h-3 bg-muted rounded animate-pulse w-16" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                pathname === route.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <route.icon
                className={cn(
                  "w-4 h-4",
                  pathname === route.href ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}
