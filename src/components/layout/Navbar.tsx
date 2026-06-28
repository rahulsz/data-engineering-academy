"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { CommandMenu } from "@/components/common/CommandMenu";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Condense the pill slightly when scrolling down
  const width = useTransform(scrollY, [0, 100], ["100%", "95%"]);
  const y = useTransform(scrollY, [0, 100], [0, 16]);

  return (
    <div className="sticky top-0 z-50 flex justify-center pt-6 px-4 pb-6 pointer-events-none">
      <motion.header
        style={{ width, y }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-6xl w-full pointer-events-auto border border-white/10 bg-black/40 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] supports-[backdrop-filter]:bg-black/20"
      >
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-8">
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
                { name: "Projects", href: "/projects" },
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  prefetch={false}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <CommandMenu />
            </div>
            
            <div className="w-[1px] h-4 bg-white/10 mx-1 hidden md:block" />
            
            <ThemeToggle />
            
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden md:block">
                  <span className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mr-2">Dashboard</span>
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link href="/sign-in">
                  <span className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Log in</span>
                </Link>
                <Link href="/sign-up">
                  <button className="text-[13px] font-semibold bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-1.5 rounded-full">
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
          <div className="md:hidden absolute top-[calc(100%+8px)] left-0 w-full p-2 border border-white/10 bg-black/80 backdrop-blur-3xl rounded-2xl shadow-2xl">
            <nav className="flex flex-col gap-1 text-[13px] font-medium p-2">
              <Link href="/learn" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg">Learn</Link>
              <Link href="/practice" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg">Practice</Link>
              <Link href="/playground/sql" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg">Playground</Link>
              <div className="px-4 py-2 mt-2">
                <CommandMenu />
              </div>
              {!isSignedIn && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                  <Link href="/sign-in"><button className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-muted-foreground">Log in</button></Link>
                  <Link href="/sign-up"><button className="w-full text-left px-4 py-2 bg-primary/20 text-primary rounded-lg mt-1">Sign up free</button></Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </motion.header>
    </div>
  );
}
