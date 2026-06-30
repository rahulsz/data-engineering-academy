import { getStaticLessons, getLessonBySlug, getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { VisualizerEmbed } from "@/components/mdx/VisualizerEmbed";
import { QuizEmbed } from "@/components/mdx/QuizEmbed";
import { FlashcardEmbed } from "@/components/mdx/FlashcardEmbed";
import { MarkCompleteButton } from "./_components/MarkCompleteButton";
import { LessonSidebar } from "./_components/LessonSidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const lessons = await getStaticLessons();
  return lessons.map((l: any) => ({
    module: l.moduleId?.slug,
    lesson: l.slug,
  })).filter((p: any) => p.module && p.lesson);
}

const components = {
  Callout,
  CodeBlock,
  VisualizerEmbed,
  QuizEmbed,
  FlashcardEmbed,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pre: (props: any) => {
    const codeElement = props.children;
    if (codeElement?.props?.className?.includes('language-')) {
      const languageClass = codeElement.props.className;
      const language = languageClass.replace("language-", "") || "text";
      return <CodeBlock language={language}>{codeElement.props.children}</CodeBlock>;
    }
    // Mac-Style Terminal Block
    return (
      <div className="relative my-8 rounded-xl overflow-hidden border border-border bg-background shadow-2xl">
        {/* Mac Window Controls */}
        <div className="h-8 border-b border-border flex items-center px-4 gap-2 bg-card">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-300" {...props} />
      </div>
    );
  },
  h1: (props: any) => <h1 className="text-3xl md:text-4xl font-display font-bold mt-10 mb-6 text-white tracking-tight" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-display font-bold mt-12 mb-4 text-white border-b border-border pb-2 tracking-tight" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-display font-semibold mt-8 mb-3 text-cyan-50" {...props} />,
  p: (props: any) => <p className="text-slate-300 leading-relaxed mb-6 font-sans text-[15px]" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 text-slate-300 space-y-2 font-sans text-[15px]" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 text-slate-300 space-y-2 font-sans text-[15px]" {...props} />,
  li: (props: any) => <li {...props} />,
  a: (props: any) => <a className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-cyan-500 pl-4 py-3 my-6 italic text-slate-300 bg-cyan-950/20 rounded-r-lg shadow-[inset_0_0_20px_rgba(6,182,212,0.02)]" {...props} />,
  // Inline Code
  code: (props: any) => {
    // If it's a child of pre, we handle it in the pre block styling below
    if (props.className?.includes('language-')) {
       return <code {...props} />;
    }
    return <code className="bg-background border border-border text-cyan-300 px-1.5 py-0.5 rounded font-mono text-[0.85em] shadow-sm" {...props} />;
  }
};

export default async function LessonPage({ params }: { params: Promise<{ module: string, lesson: string }> }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const lesson = await getLessonBySlug(moduleSlug, lessonSlug);
  if (!lesson) notFound();

  const data = await getModuleContent(moduleSlug);
  if (!data) notFound();
  const { module, lessons } = data;

  const currentIndex = lessons.findIndex((l: any) => l._id === lesson._id);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative bg-[#0e0e0e] selection:bg-cyan-500/30">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[900px] w-full mx-auto order-2 lg:order-1 relative z-10 flex flex-col">
        
        {/* Integrated Lesson Header with subtle gradient */}
        <header className="relative pt-12 pb-8 px-8 md:px-12 border-b border-border bg-gradient-to-b from-cyan-950/10 to-transparent">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 mb-8 font-mono">
            <Link href="/learn" className="hover:text-cyan-400 transition-colors uppercase">CURRICULUM</Link>
            <span className="text-white/10">/</span>
            <Link href={`/learn/${moduleSlug}`} className="hover:text-cyan-400 transition-colors uppercase">{module?.title}</Link>
            <span className="text-white/10">/</span>
            <span className="text-cyan-400 truncate max-w-[200px] uppercase">{lesson.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30">
              {lesson.type}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 flex items-center gap-2 px-3 py-1 rounded-full border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              {lesson.duration} MIN READ
            </span>
            <span className="text-[10px] font-bold font-mono tracking-widest text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 ml-auto">
              +{lesson.xpReward} XP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight mb-4">
            {lesson.title}
          </h1>
        </header>

        {/* MDX Content */}
        <div className="px-8 md:px-12 py-10 prose prose-invert prose-slate max-w-none flex-1">
          <MDXRemote 
            source={lesson.content} 
            components={components}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeHighlight as any],
              }
            }}
          />
        </div>

        {/* Edge-to-Edge Navigation Footer */}
        <footer className="mt-auto border-t border-border bg-background p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 z-20">
          <MarkCompleteButton lessonId={lesson._id} />
          
          <div className="flex gap-4 w-full sm:w-auto">
            {prev ? (
              <Link href={`/learn/${moduleSlug}/${prev.slug}`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full h-12 px-6 border-border hover:border-white/20 hover:bg-white/5 text-slate-300 bg-transparent font-mono text-xs uppercase tracking-widest transition-all">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </Button>
              </Link>
            ) : <div className="hidden sm:block w-[120px]" />}
            
            {next && (
              <Link href={`/learn/${moduleSlug}/${next.slug}`} className="flex-1 sm:flex-none group/next">
                <Button variant="outline" className="w-full h-12 px-6 border-cyan-500/30 text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-500/50 bg-background font-mono text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover/next:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </footer>
      </div>

      {/* Right Sidebar - Module Syllabus (Client Component) */}
      <LessonSidebar 
        moduleTitle={module.title}
        moduleSlug={moduleSlug}
        lessons={lessons}
        activeLessonId={lesson._id}
      />
    </div>
  );
}
