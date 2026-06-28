import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, BookOpen, Layers } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour

export default async function LearnPage() {
  await connectDB();
  const coursesRaw = await Course.find({ published: true }).sort({ order: 1 }).lean();
  const courses = JSON.parse(JSON.stringify(coursesRaw));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-4">
          Data Engineering Curriculum
        </h1>
        <p className="text-slate-400 text-lg">
          Master the complete modern data stack. From SQL fundamentals to advanced cloud architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {courses.map((course: any) => (
          <Link key={course._id} href={`/learn/${course.slug}`}>
            <Card className="group h-full bg-black/40 border-surface-deep/50 hover:border-indigo-500/50 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className="h-40 bg-surface-deep/30 relative flex items-center justify-center border-b border-surface-deep/50">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                  {course.icon}
                </div>
                {/* Simulated glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <Badge variant="outline" className={
                    course.level === "beginner" ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" :
                    course.level === "intermediate" ? "text-amber-400 border-amber-400/30 bg-amber-400/10" :
                    "text-rose-400 border-rose-400/30 bg-rose-400/10"
                  }>
                    {course.level}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-500 mt-auto pt-4 border-t border-surface-deep/30">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{course.estimatedHours} Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Comprehensive coverage</span>
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
