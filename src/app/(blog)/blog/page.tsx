import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { BlogSearch } from "@/features/blog/components/BlogSearch";
import { BookOpen } from "lucide-react";

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <BookOpen className="w-8 h-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4 leading-[1.1]">
              Engineering Insights
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-light tracking-tight mb-8">
              Deep dives into data architecture, pipeline optimization, and the modern data stack.
            </p>

            {/* Search Bar */}
            <BlogSearch />
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 w-full">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No articles found. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              if (!post) return null;
              return <BlogCard key={post.meta.slug} post={post.meta} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
