import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { CourseCatalog } from "./_components/CourseCatalog";

export const revalidate = 3600; // Static ISR, revalidates every hour

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

      <CourseCatalog initialCourses={courses} />
    </div>
  );
}
