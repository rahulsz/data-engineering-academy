import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getComments } from "@/features/blog/actions";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CommentSection } from "@/features/blog/components/CommentSection";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { VisualizerEmbed } from "@/components/mdx/VisualizerEmbed";

export const revalidate = 3600;

const components = {
  Callout,
  CodeBlock,
  VisualizerEmbed,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: (props: any) => {
    const codeElement = props.children;
    const languageClass = codeElement?.props?.className || "";
    const language = languageClass.replace("language-", "") || "text";
    return <CodeBlock language={language}>{codeElement.props.children}</CodeBlock>;
  },
};

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // Fetch comments (runs at runtime or revalidation)
  const comments = await getComments(slug);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Blog Post Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Articles
          </Link>
          
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
              {post.meta.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-6 leading-tight">
            {post.meta.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-400 mb-8">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.meta.date), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.meta.readingTime}
            </div>
          </div>

          <p className="text-lg text-slate-300 font-light border-l-2 border-cyan-500/50 pl-4 py-1 italic bg-cyan-500/5 rounded-r-lg">
            {post.meta.excerpt}
          </p>
        </div>
      </div>

      {/* Main Content & Comments */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 w-full">
        {/* MDX Content */}
        <article className="prose prose-invert prose-cyan max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border">
          <MDXRemote source={post.content} components={components} />
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-2">
          <Tag className="w-4 h-4 text-slate-500 mr-2 mt-0.5" />
          {post.meta.tags.map(tag => (
            <span key={tag} className="text-xs font-mono px-3 py-1 bg-white/5 rounded-full border border-border text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        {/* Comments Section */}
        <CommentSection slug={post.slug} title={post.meta.title} initialComments={comments} />
      </div>
    </div>
  );
}
