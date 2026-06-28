import { getStaticLessons, getLessonBySlug, getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { VisualizerEmbed } from "@/components/mdx/VisualizerEmbed";
import { QuizEmbed } from "@/components/mdx/QuizEmbed";
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
  h1: (props: any) => <h1 className="text-3xl font-display font-bold mt-8 mb-4 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-display font-bold mt-8 mb-4 text-white border-b border-surface-deep pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-display font-bold mt-6 mb-3 text-slate-200" {...props} />,
  p: (props: any) => <p className="text-slate-300 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 text-slate-300 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 text-slate-300 space-y-2" {...props} />,
  li: (props: any) => <li {...props} />,
  a: (props: any) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-6 italic text-slate-400 bg-surface-deep/20 rounded-r-lg" {...props} />,
  code: (props: any) => <code className="bg-surface-deep/50 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
};

export default async function LessonPage({ params }: { params: { module: string, lesson: string } }) {
  const lesson = await getLessonBySlug(params.module, params.lesson);
  if (!lesson) notFound();

  const data = await getModuleContent(params.module);
  if (!data) notFound();
  const { module, lessons } = data;

  const currentIndex = lessons.findIndex((l: any) => l._id === lesson._id);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 lg:pr-16 order-2 lg:order-1">
        
        {/* Breadcrumb / Top Nav */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/learn" className="hover:text-white transition-colors">Curriculum</Link>
          <span>/</span>
          <Link href={`/learn/${params.module}`} className="hover:text-white transition-colors">{module?.title}</Link>
          <span>/</span>
          <span className="text-indigo-400 truncate max-w-[200px]">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {lesson.type}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {lesson.duration} min read
            </span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-500/20 ml-auto">
              +{lesson.xpReward} XP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            {lesson.title}
          </h1>
        </header>

        {/* MDX Content */}
        <div className="prose prose-invert prose-slate max-w-none">
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

        {/* Completion Area */}
        <div className="mt-16 pt-8 border-t border-surface-deep/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <MarkCompleteButton lessonId={lesson._id} />
          
          <div className="flex gap-4 w-full md:w-auto">
            {prev ? (
              <Link href={`/learn/${params.module}/${prev.slug}`} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full border-surface-deep hover:bg-surface-deep text-slate-300">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </Button>
              </Link>
            ) : <div className="hidden md:block w-[90px]" />}
            
            {next && (
              <Link href={`/learn/${params.module}/${next.slug}`} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Module Syllabus (Client Component) */}
      <LessonSidebar 
        moduleTitle={module.title}
        moduleSlug={params.module}
        lessons={lessons}
        activeLessonId={lesson._id}
      />
    </div>
  );
}
