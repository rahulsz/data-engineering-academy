import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ProfileForm } from "./_components/ProfileForm";
import { getDashboardData } from "@/features/dashboard/actions";
import { getXPForNextLevel } from "@/lib/xp";
import { Zap, Trophy, Target, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 0;

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  await connectDB();
  const dbUser = await User.findOne({ clerkId: clerkUser.id }).lean();
  
  if (!dbUser) return null;

  const dashboardData = await getDashboardData();
  const { stats, achievements } = dashboardData;
  const xpNeeded = getXPForNextLevel(stats.level);
  const xpProgress = Math.min((stats.totalXP / xpNeeded) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Your Profile</h1>
        <p className="text-slate-400">Manage your public profile and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-border rounded-2xl p-8 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <img 
                src={clerkUser.imageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-cyan-500/20 object-cover shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{dbUser.firstName} {dbUser.lastName}</h2>
                <p className="text-slate-400 mt-1">{dbUser.email}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-500/20">
                    Level {stats.level}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                    <Target className="w-3 h-3" /> {stats.currentStreak} Day Streak
                  </span>
                </div>
              </div>
            </div>

            <ProfileForm user={JSON.parse(JSON.stringify(dbUser))} />
          </div>
        </div>

        {/* Right Column: Stats & Achievements */}
        <div className="space-y-6">
          {/* XP Level Card */}
          <div className="bg-white/5 border border-border rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-border flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Level {stats.level}</h3>
                <p className="text-xs text-slate-400">{stats.totalXP} / {xpNeeded} XP</p>
              </div>
            </div>
            
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/5 border-border backdrop-blur-xl shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="mx-auto w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.lessonsCompleted}</div>
                <p className="text-xs text-slate-400">Lessons</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-border backdrop-blur-xl shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="mx-auto w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white">{achievements.length}</div>
                <p className="text-xs text-slate-400">Achievements</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Showcase */}
          <div className="bg-white/5 border border-border rounded-2xl p-6 backdrop-blur-xl shadow-lg">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Recent Achievements
            </h3>
            
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 3).map((ach: any) => (
                  <div key={ach._id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{ach.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No achievements unlocked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
