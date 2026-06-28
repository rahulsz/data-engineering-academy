"use server";

import { connectDB } from "@/lib/db";
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
    if (!clerkUser) throw new Error("User not found");
    
    user = await User.create({
      clerkId: clerkId,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      avatar: clerkUser.imageUrl || "",
    });
  }

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

  return {
    user: JSON.parse(JSON.stringify(user)),
    recentProgress,
    stats,
    achievements,
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
