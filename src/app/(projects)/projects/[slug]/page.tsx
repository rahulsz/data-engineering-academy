import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/features/projects/actions";
import { 
  Clock, Code2, ChevronLeft, LayoutTemplate, Layers, FolderTree, GraduationCap, 
  Film, Headphones, Car, BarChart, Landmark, TrendingUp, Search, Folder 
} from "lucide-react";
import Link from "next/link";

const emojiToIcon: Record<string, React.ReactNode> = {
  "🎬": <Film className="w-12 h-12 text-rose-400" />,
  "🎧": <Headphones className="w-12 h-12 text-emerald-400" />,
  "🚗": <Car className="w-12 h-12 text-amber-400" />,
  "📊": <BarChart className="w-12 h-12 text-cyan-400" />,
  "🏛️": <Landmark className="w-12 h-12 text-indigo-400" />,
  "📈": <TrendingUp className="w-12 h-12 text-blue-400" />,
  "🔍": <Search className="w-12 h-12 text-purple-400" />
};
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ProjectArchitectureDiagram } from "@/features/projects/components/ProjectArchitectureDiagram";
import { MarkStartedButton } from "@/features/projects/components/MarkStartedButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const projects = await getAllProjects();
  return projects.map((p: any) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "intermediate": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "advanced": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 relative z-10">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="w-24 h-24 shrink-0 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-xl">
              {emojiToIcon[project.coverImage || ""] || <Folder className="w-12 h-12 text-indigo-400" />}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <Badge variant="outline" className={`capitalize font-mono text-[10px] tracking-wider px-2 py-0.5 ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-border">
                  <Clock className="w-3 h-3" />
                  {project.estimatedHours} Hours
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-6">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                {project.stack?.map((tech: string) => (
                  <span key={tech} className="text-xs font-mono px-3 py-1 bg-white/5 rounded-full border border-border text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 space-x-6 overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="overview" className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 data-[state=active]:text-cyan-400 transition-colors">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 data-[state=active]:text-cyan-400 transition-colors">
              <Layers className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="folder" className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 data-[state=active]:text-cyan-400 transition-colors">
              <FolderTree className="w-4 h-4 mr-2" />
              Folder Structure
            </TabsTrigger>
            <TabsTrigger value="guide" className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 data-[state=active]:text-cyan-400 transition-colors">
              <Code2 className="w-4 h-4 mr-2" />
              Implementation Guide
            </TabsTrigger>
            <TabsTrigger value="outcomes" className="cursor-pointer data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 data-[state=active]:text-cyan-400 transition-colors">
              <GraduationCap className="w-4 h-4 mr-2" />
              Learning Outcomes
            </TabsTrigger>
          </TabsList>

          <div className="py-8 prose prose-invert prose-cyan max-w-none">
            <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in duration-500">
              <MDXRemote source={project.overview || project.description} components={components} />
            </TabsContent>
            
            <TabsContent value="architecture" className="mt-0 outline-none animate-in fade-in duration-500">
              <ProjectArchitectureDiagram architectureText={project.architecture || ""} />
            </TabsContent>
            
            <TabsContent value="folder" className="mt-0 outline-none animate-in fade-in duration-500">
              <div className="bg-black/50 border border-border rounded-xl p-6 font-mono text-sm overflow-x-auto shadow-inner text-slate-300">
                <pre>{project.folderStructure || "No structure provided."}</pre>
              </div>
            </TabsContent>
            
            <TabsContent value="guide" className="mt-0 outline-none animate-in fade-in duration-500">
              <MDXRemote source={project.implementationGuide || "Implementation guide coming soon."} components={components} />
            </TabsContent>

            <TabsContent value="outcomes" className="mt-0 outline-none animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    What You'll Learn
                  </h3>
                  <ul className="space-y-3">
                    {project.learningOutcomes?.map((outcome: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <div className="w-5 h-5 mt-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          ✓
                        </div>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {project.prerequisites?.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <div className="w-5 h-5 mt-0.5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                          !
                        </div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MarkStartedButton projectId={project._id.toString()} />
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="cursor-pointer border-border text-slate-300 hover:text-white hover:bg-white/5">
                  <Code2 className="w-4 h-4 mr-2" />
                  View Repository
                </Button>
              </a>
            )}
          </div>
          <Link href="/projects" className="text-sm font-medium text-slate-500 hover:text-cyan-400 transition-colors">
            Return to Projects Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
