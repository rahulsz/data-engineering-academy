import Link from "next/link";
import { Zap, GitBranch, MessageSquare, Briefcase, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-black pt-24 pb-8 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Pre-Footer CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-16 mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              Ready to engineer data?
            </h2>
            <p className="text-zinc-400 text-lg font-light tracking-tight max-w-md">
              Join thousands of learners mastering the modern data stack for free.
            </p>
          </div>
          <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Start Learning Free <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          <div className="col-span-2 md:col-span-2 md:pr-12">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Zap className="h-6 w-6 text-white" fill="currentColor" />
              <span className="text-xl font-bold tracking-tight text-white">
                DE.Academy
              </span>
            </Link>
            <p className="text-[15px] text-zinc-500 font-light leading-relaxed mb-8 max-w-sm">
              The ultimate open-source learning platform for modern data engineering. Interactive playgrounds, real-world architecture, zero setup.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com" className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                <GitBranch className="w-4 h-4" />
              </Link>
              <Link href="https://twitter.com" className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                <MessageSquare className="w-4 h-4" />
              </Link>
              <Link href="https://linkedin.com" className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                <Briefcase className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-tight">Platform</h3>
            <ul className="space-y-4 text-[14px] text-zinc-500 font-light">
              <li><Link href="/learn" className="hover:text-zinc-300 transition-colors">Curriculum</Link></li>
              <li><Link href="/playground/sql" className="hover:text-zinc-300 transition-colors">SQL Playground</Link></li>
              <li><Link href="/projects" className="hover:text-zinc-300 transition-colors">Real Projects</Link></li>
              <li><Link href="/achievements" className="hover:text-zinc-300 transition-colors">Achievements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-tight">Resources</h3>
            <ul className="space-y-4 text-[14px] text-zinc-500 font-light">
              <li><Link href="/forum" className="hover:text-zinc-300 transition-colors">Community Forum</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-300 transition-colors">Engineering Blog</Link></li>
              <li><Link href="/discord" className="hover:text-zinc-300 transition-colors">Discord Server</Link></li>
              <li><Link href="/leaderboard" className="hover:text-zinc-300 transition-colors">Global Leaderboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-tight">Company</h3>
            <ul className="space-y-4 text-[14px] text-zinc-500 font-light">
              <li><Link href="/about" className="hover:text-zinc-300 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border">
          <p className="text-[14px] text-zinc-500 font-light tracking-tight">
            © {new Date().getFullYear()} DataEngineering.Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[13px] text-zinc-400 font-medium tracking-tight hover:text-white transition-colors cursor-pointer">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
