import { getDashboardData, getWeeklyXPData } from "@/features/dashboard/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, BookOpen, Layers, Trophy } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { WeeklyXPChart } from "./_components/WeeklyXPChart";
import { getXPForNextLevel } from "@/lib/xp";

export const revalidate = 0; // Disable caching for dashboard

const getModuleIcon = (slug?: string) => {
  if (!slug) return null;
  if (slug.includes('sql')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg';
  if (slug.includes('python')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg';
  if (slug.includes('linux') || slug.includes('bash')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg';
  if (slug.includes('aws') || slug.includes('s3')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg';
  if (slug.includes('postgres')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg';
  if (slug.includes('spark')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg';
  if (slug.includes('kafka')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg';
  if (slug.includes('airflow')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg';
  if (slug.includes('docker')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg';
  return null;
};

export default async function DashboardPage() {
  const { user, stats, recentProgress, achievements } = await getDashboardData();
  const weeklyData = await getWeeklyXPData(user._id);

  const xpNeeded = getXPForNextLevel(stats.level);
  const xpProgress = Math.min((stats.totalXP / xpNeeded) * 100, 100);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-white">
          Welcome back, {user?.firstName || "Data Engineer"}! 👋
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Ready to continue your data engineering journey?
        </p>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total XP</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-md border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-white drop-shadow-md">{stats.totalXP}</div>
            <p className="text-xs text-amber-400/80 mt-1">{xpNeeded - stats.totalXP} XP to Level {stats.level + 1}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-md border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Target className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-white drop-shadow-md">{stats.currentStreak} Days</div>
            <p className="text-xs text-orange-400/80 mt-1">Longest streak: {user.longestStreak || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lessons Completed</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-md border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <BookOpen className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-white drop-shadow-md">{stats.lessonsCompleted}</div>
            <p className="text-xs text-blue-400/80 mt-1">Keep learning!</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Modules Started</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Layers className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-white drop-shadow-md">{stats.modulesStarted}</div>
            <p className="text-xs text-emerald-400/80 mt-1">Out of {stats.totalModules} available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: XP Progress, Continue Learning & Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Level Progress - Gamer Style */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
            {/* Glow effect behind the card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                  <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 text-transparent bg-clip-text">Level {stats.level}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-slate-300">
                    Data Engineer Initiate
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stats.totalXP}</span>
                <span className="text-slate-400 font-medium"> / {xpNeeded} XP</span>
              </div>
            </div>
            
            {/* Neon Progress Bar */}
            <div className="h-6 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden p-1 shadow-inner relative z-10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-1000 ease-out relative"
                style={{ width: `${xpProgress}%` }}
              >
                {/* Shine effect inside the bar */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px] animate-pulse" />
              </div>
            </div>
          </section>

          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Continue Learning</h2>
              <Link href="/learn" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View Curriculum &rarr;
              </Link>
            </div>
            
            {recentProgress.length > 0 ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentProgress.map((prog: any) => (
                  <div key={prog._id} className="group flex items-center gap-5 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      {getModuleIcon(prog.moduleId?.slug) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={getModuleIcon(prog.moduleId?.slug)!} alt="icon" className="w-8 h-8 object-contain drop-shadow-md" />
                      ) : (
                        prog.moduleId?.icon || "📖"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg text-white font-semibold truncate group-hover:text-cyan-300 transition-colors">{prog.lessonId?.title || "Lesson"}</h4>
                      <p className="text-sm text-slate-400 truncate mt-0.5">{prog.moduleId?.title || "Module"}</p>
                    </div>
                    <Link href={`/learn/${prog.moduleId?.slug}/${prog.lessonId?.slug}`}>
                      <Button variant="outline" className="shrink-0 border-white/20 bg-white/5 text-white hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all rounded-xl font-semibold px-6">
                        Resume &rarr;
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={BookOpen} 
                title="No lessons started yet" 
                description="Start your journey by checking out the curriculum. We recommend starting with SQL Fundamentals if you are a beginner."
                action={<Link href="/learn"><Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold mt-2">Start Learning Now</Button></Link>}
              />
            )}
          </section>

          {/* Weekly XP Chart */}
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Weekly Activity</h2>
            <div className="bg-black/40 border border-surface-deep/50 rounded-xl p-6 backdrop-blur-md h-[300px]">
              <WeeklyXPChart data={weeklyData} />
            </div>
          </section>
        </div>

        {/* Right Column: Achievements & Activity */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Achievements</h2>
              <Link href="/profile" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                View All &rarr;
              </Link>
            </div>
            
            {achievements.length > 0 ? (
              <div className="flex overflow-x-auto snap-x pb-6 -mx-2 px-2 gap-4 hide-scrollbar">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {achievements.map((ach: any) => (
                  <div key={ach._id} className="snap-start shrink-0 w-[260px] flex flex-col gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-amber-500/30 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {ach.icon}
                      </div>
                      <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        +{ach.xpReward} XP
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{ach.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Trophy} 
                title="No achievements yet" 
                description="Complete lessons, maintain streaks, and score well on quizzes to earn achievements!"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
