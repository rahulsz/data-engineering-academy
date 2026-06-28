"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { 
  Database, Terminal, Play, Trophy, Users, BookOpen, 
  Search, Sun, Moon, ArrowRight, BookMarked
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50 border border-border/50 rounded-full hover:bg-muted transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search curriculum...</span>
        <kbd className="ml-2 pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Command.Dialog 
        open={open} 
        onOpenChange={setOpen}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
        overlayClassName="fixed inset-0 bg-black/40"
      >
        <div className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center px-4 border-b border-border/50" cmdk-input-wrapper="">
            <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="flex h-14 w-full bg-transparent outline-none placeholder:text-muted-foreground text-foreground border-0 focus:ring-0"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Curriculum" className="text-xs font-medium text-muted-foreground px-2 py-1">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/learn/sql'))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors mt-1"
              >
                <Database className="w-4 h-4" />
                <span>SQL Fundamentals</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/learn/python'))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>Python for Data Engineering</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Tools & Practice" className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/playground/sql'))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors mt-1"
              >
                <Play className="w-4 h-4" />
                <span>Interactive SQL Playground</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/practice/interview-questions'))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <BookMarked className="w-4 h-4" />
                <span>Interview Question Bank</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Settings" className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2 border-t border-border/50 pt-2">
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("dark"))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Moon className="w-4 h-4" />
                <span>Dark Theme</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("light"))}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground rounded-lg cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Sun className="w-4 h-4" />
                <span>Light Theme</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
