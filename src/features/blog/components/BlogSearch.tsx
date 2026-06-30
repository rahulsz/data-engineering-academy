"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { BlogPostMeta } from "@/lib/blog";

export function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogPostMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // You will need to create the useDebounce hook if it doesn't exist, 
  // but for now, we'll assume it exists or just use a simple timeout effect.
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`/api/blog/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query) setShowDropdown(true); }}
          onBlur={() => {
            // Small delay to allow clicking results
            setTimeout(() => setShowDropdown(false), 200);
          }}
          className="pl-10 bg-white/5 border-border focus:border-cyan-500 focus:ring-cyan-500/20"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 animate-spin" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length === 0 && !isSearching ? (
            <div className="p-4 text-sm text-slate-400 text-center">No results found.</div>
          ) : (
            <div className="flex flex-col">
              {results.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="p-3 hover:bg-white/5 border-b border-border/50 last:border-0 transition-colors"
                >
                  <div className="text-sm font-medium text-white mb-1 line-clamp-1">{post.title}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="text-cyan-500">{post.category}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
