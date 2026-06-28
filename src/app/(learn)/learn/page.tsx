import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, BookOpen, Layers } from "lucide-react";
export const revalidate = 3600; // Static ISR, revalidates every hour
const getCourseIcon = (slug: string) => {
  const icons: Record<string, string> = {
    'sql': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg',
    'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
    'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    'db-fundamentals': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
    'data-warehousing': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
    'etl': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg',
    'elt': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/d3js/d3js-original.svg',
    'spark': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg',
    'kafka': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg',
    'airflow': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg',
    'snowflake': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg',
    'aws-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    'azure-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    'gcp-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  };
  return icons[slug] || null;
};

export default async function LearnPage() {
  await connectDB();
  const coursesRaw = await Course.find({ published: true }).sort({ order: 1 }).lean();
  const courses = JSON.parse(JSON.stringify(coursesRaw));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-5xl font-display font-extrabold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Data Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Curriculum</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed relative z-10">
          Master the complete modern data stack. From SQL fundamentals to advanced cloud architectures and real-time streaming pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {courses.map((course: any, idx: number) => (
          <Link key={course._id} href={`/learn/${course.slug}`}>
            <Card className={`group h-full bg-white/5 border-white/10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 overflow-hidden shadow-lg ${idx === 0 ? 'lg:col-span-2' : ''}`}>
              <div className="h-56 relative flex items-center justify-center border-b border-white/10 overflow-hidden">
                {/* Glowing backdrop based on index */}
                <div className={`absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70 ${
                  idx % 3 === 0 ? 'bg-gradient-to-br from-cyan-600 to-indigo-900' :
                  idx % 3 === 1 ? 'bg-gradient-to-br from-indigo-600 to-purple-900' :
                  'bg-gradient-to-br from-emerald-600 to-teal-900'
                }`} />
                <div className="w-24 h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative">
                  {getCourseIcon(course.slug) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={getCourseIcon(course.slug)!} alt={course.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-8xl">{course.icon}</span>
                  )}
                </div>
                {/* Deep shadow at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
              </div>
              
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-sm">
                    {course.title}
                  </h3>
                  <Badge variant="outline" className={`px-3 py-1 font-semibold tracking-wider text-xs border uppercase rounded-full shadow-inner ${
                    course.level === "beginner" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]" :
                    course.level === "intermediate" ? "text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]" :
                    "text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(243,33,113,0.2)]"
                  }`}>
                    {course.level}
                  </Badge>
                </div>
                
                <p className={`text-slate-400 mb-8 leading-relaxed ${idx === 0 ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'}`}>
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-4 text-xs font-medium text-slate-400 mt-auto pt-6 border-t border-white/10 group-hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 group-hover:text-cyan-400 transition-all">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span>{course.estimatedHours} Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 group-hover:text-purple-400 transition-all">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span>Comprehensive hands-on coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
