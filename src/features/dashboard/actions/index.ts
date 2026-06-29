"use server";

import { connectDB } from "@/lib/db";
// Mongoose cold-start registration
import { User } from "@/models/User";
import { Progress } from "@/models/Progress";
import { Achievement } from "@/models/Achievement";
import { Lesson } from "@/models/Lesson";
import { Module } from "@/models/Module";
import { Course } from "@/models/Course";
import { Quiz } from "@/models/Quiz";
import { QuizAttempt } from "@/models/QuizAttempt";
import { Roadmap } from "@/models/Roadmap";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getDashboardData() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await connectDB();
  
  let user = await User.findOne({ clerkId });
  
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not found in Clerk");
    
    const email = clerkUser.emailAddresses[0].emailAddress;
    
    user = await User.findOneAndUpdate(
      { $or: [{ clerkId }, { email }] },
      { 
        $set: { 
          clerkId, 
          email,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          avatar: clerkUser.imageUrl || ""
        } 
      },
      { upsert: true, returnDocument: 'after' }
    );
  }

  if (!user) throw new Error("Failed to create or retrieve user from database");

  const userId = user._id;

  // 1. Get recent progress (last 3 in-progress lessons)
  const recentProgressRaw = await Progress.find({ userId, status: "in_progress" })
    .sort({ updatedAt: -1 })
    .limit(3)
    .populate("lessonId")
    .populate("moduleId")
    .lean();
    
  // Transform to plain objects to pass from server to client
  const recentProgress = JSON.parse(JSON.stringify(recentProgressRaw));

  // 2. Get stats
  const completedLessonsCount = await Progress.countDocuments({ userId, status: "completed" });
  
  // Count distinct modules started
  const modulesStarted = await Progress.distinct("moduleId", { userId, status: { $in: ["in_progress", "completed"] } });
  const modulesStartedCount = modulesStarted.length;
  
  // Total modules in platform (hardcoded to 15 based on spec, or dynamically fetch)
  const totalModulesCount = 15;
  const totalLessonsInPlatform = 250; // Approximated

  const stats = {
    totalXP: user.xp,
    level: user.level,
    currentStreak: user.streak,
    lessonsCompleted: completedLessonsCount,
    totalLessons: totalLessonsInPlatform,
    modulesStarted: modulesStartedCount,
    totalModules: totalModulesCount,
  };

  // 3. Get achievements (last 3 unlocked)
  const achievementsRaw = await Achievement.find({ userId })
    .sort({ unlockedAt: -1 })
    .limit(3)
    .lean();
  const achievements = JSON.parse(JSON.stringify(achievementsRaw));
  
  // 4. Get all Courses (modules) and progress
  const coursesRaw = await Course.find({ published: true }).sort({ order: 1 }).lean();
  const progressAggregation = await Progress.aggregate([
    { $match: { userId: userId, status: "completed" } },
    { $group: { _id: "$courseId", completedLessons: { $sum: 1 } } }
  ]);
  
  const progressMap = new Map(progressAggregation.map(p => [p._id?.toString(), p.completedLessons]));
  
  const modules = coursesRaw.map(course => ({
    ...course,
    completedLessons: progressMap.get(course._id.toString()) || 0
  }));

  // 5. Activity Timeline
  const recentAchievementsForTimeline = await Achievement.find({ userId }).sort({ unlockedAt: -1 }).limit(10).lean();
  const recentCompletedLessons = await Progress.find({ userId, status: "completed" })
    .sort({ completedAt: -1 })
    .limit(10)
    // @ts-ignore - populated fields
    .populate("lessonId", "title")
    .lean();
    
  const timeline = [
    ...recentAchievementsForTimeline.map(a => ({
      type: 'achievement',
      id: a._id.toString(),
      title: a.title,
      description: a.description,
      date: a.unlockedAt,
      icon: a.icon
    })),
    ...recentCompletedLessons.map(p => ({
      type: 'lesson',
      id: p._id.toString(),
      // @ts-ignore - populated fields
      title: `Completed: ${p.lessonId?.title || 'Lesson'}`,
      description: `Earned ${p.xpEarned || 10} XP`,
      date: p.completedAt || (p as any).updatedAt || new Date(),
      icon: '✅'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  
  // 6. Recommended Topics (from SQL course)
  let recommended: any[] = [];
  const sqlCourse = await Course.findOne({ slug: 'sql' }).lean();
  if (sqlCourse) {
    const completedSqlLessons = await Progress.find({ userId, courseId: sqlCourse._id, status: "completed" }).lean();
    const completedSqlLessonIds = completedSqlLessons.map(p => p.lessonId?.toString());
    recommended = await Lesson.find({ 
      courseId: sqlCourse._id, 
      _id: { $nin: completedSqlLessonIds } 
    }).limit(4).lean();
  }

  return {
    user: JSON.parse(JSON.stringify(user)),
    recentProgress,
    stats,
    achievements,
    modules: JSON.parse(JSON.stringify(modules)),
    timeline: JSON.parse(JSON.stringify(timeline)),
    recommended: JSON.parse(JSON.stringify(recommended)),
  };
}

export async function getWeeklyXPData(_userId: string) {
  // This is a mockup since we don't store individual XP transactions yet in the DB model.
  // In a real app, you would aggregate from an XPTransaction or Activity collection.
  // For now, return a placeholder data array representing last 7 days.
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday
  
  // Rotate days so today is last
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    let index = today - i;
    if (index <= 0) index += 7;
    // Map 1-7 to Mon-Sun (0-6 in our array)
    last7Days.push(days[index === 7 ? 6 : index - 1]);
  }
  
  return last7Days.map(day => ({
    day,
    xp: Math.floor(Math.random() * 50) * 10 // Mock data between 0 and 500 XP
  }));
}

export async function getModuleProgress(userId: string) {
  await connectDB();
  
  // Aggregate progress grouped by module
  const progressAggregation = await Progress.aggregate([
    { $match: { userId: userId, status: "completed" } },
    { $group: { _id: "$moduleId", completedLessons: { $sum: 1 } } }
  ]);
  
  return JSON.parse(JSON.stringify(progressAggregation));
}

export async function updateProfile(data: {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await connectDB();
  
  const user = await User.findOneAndUpdate(
    { clerkId },
    { 
      $set: {
        ...(data.username && { username: data.username }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.bio && { bio: data.bio }),
        'socialLinks.github': data.github || "",
        'socialLinks.linkedin': data.linkedin || ""
      }
    },
    { returnDocument: 'after' }
  );

  if (!user) throw new Error("User not found");

  return JSON.parse(JSON.stringify(user));
}
