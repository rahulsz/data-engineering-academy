import { getDashboardData, getWeeklyXPData } from "@/features/dashboard/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, BookOpen, Layers, Trophy } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { WeeklyXPChart } from "./_components/WeeklyXPChart";
import { getXPForNextLevel } from "@/lib/xp";

export const revalidate = 0; // Disable caching for dashboard

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-surface-deep/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total XP</CardTitle>
            <div className="p-2 bg-amber-500/20 rounded-md">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalXP}</div>
            <p className="text-xs text-slate-400 mt-1">{xpNeeded - stats.totalXP} XP to Level {stats.level + 1}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-surface-deep/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <div className="p-2 bg-orange-500/20 rounded-md">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.currentStreak} Days</div>
            <p className="text-xs text-slate-400 mt-1">Longest streak: {user.longestStreak || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-surface-deep/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lessons Completed</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-md">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.lessonsCompleted}</div>
            <p className="text-xs text-slate-400 mt-1">Keep learning!</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-surface-deep/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Modules Started</CardTitle>
            <div className="p-2 bg-emerald-500/20 rounded-md">
              <Layers className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.modulesStarted}</div>
            <p className="text-xs text-slate-400 mt-1">Out of {stats.totalModules} available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: XP Progress, Continue Learning & Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Level Progress */}
          <section className="bg-black/40 border border-surface-deep/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Level {stats.level}</h3>
                <p className="text-sm text-slate-400">Data Engineer Initiate</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-400">{stats.totalXP}</span>
                <span className="text-slate-500"> / {xpNeeded} XP</span>
              </div>
            </div>
            <div className="h-4 w-full bg-surface-deep rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${xpProgress}%` }}
              />
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
                  <div key={prog._id} className="flex items-center gap-4 p-4 rounded-xl border border-surface-deep/30 bg-black/20 hover:bg-surface-deep/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl shrink-0">
                      {prog.moduleId?.icon || "📖"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{prog.lessonId?.title || "Lesson"}</h4>
                      <p className="text-sm text-slate-400 truncate">{prog.moduleId?.title || "Module"}</p>
                    </div>
                    <Link href={`/learn/${prog.moduleId?.slug}/${prog.lessonId?.slug}`}>
                      <Button variant="outline" className="shrink-0 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20">
                        Resume
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
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {achievements.map((ach: any) => (
                  <div key={ach._id} className="flex gap-4 p-4 rounded-xl border border-surface-deep/50 bg-black/40 backdrop-blur-md items-start">
                    <div className="text-3xl shrink-0 leading-none">{ach.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white">{ach.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{ach.description}</p>
                      <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                        +{ach.xpReward} XP
                      </span>
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
