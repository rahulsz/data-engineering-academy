"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { CommandMenu } from "@/components/common/CommandMenu";
import { Button } from "@/components/ui/button";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";

export function AppHeader() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 w-full items-center border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-full w-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors">
                <Zap className="h-4 w-4 text-primary" fill="currentColor" />
              </div>
              <span className="text-[14px] font-semibold tracking-tight text-foreground/90">
                DE.Academy
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { name: "Learn", href: "/learn" },
                { name: "Practice", href: "/practice" },
                { name: "Playground", href: "/playground/sql" },
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  prefetch={false}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-1.5 rounded-full transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block w-48 xl:w-64">
              <CommandMenu />
            </div>
            
            <div className="w-[1px] h-4 bg-border mx-1 hidden md:block" />
            
            <ThemeToggle />
            
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link href="/sign-in">
                  <span className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Log in</span>
                </Link>
                <Link href="/sign-up">
                  <button className="text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-1.5 rounded-full">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%+1px)] left-0 w-full p-2 border-b border-border bg-background shadow-xl">
            <nav className="flex flex-col gap-1 text-[13px] font-medium p-2">
              <Link href="/learn" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-accent/50 rounded-lg">Learn</Link>
              <Link href="/practice" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-accent/50 rounded-lg">Practice</Link>
              <Link href="/playground/sql" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-accent/50 rounded-lg">Playground</Link>
              <div className="px-4 py-2 mt-2">
                <CommandMenu />
              </div>
              {!isSignedIn && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                  <Link href="/sign-in"><button className="w-full text-left px-4 py-2 hover:bg-accent/50 rounded-lg text-muted-foreground">Log in</button></Link>
                  <Link href="/sign-up"><button className="w-full text-left px-4 py-2 bg-primary/20 text-primary rounded-lg mt-1">Sign up free</button></Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
