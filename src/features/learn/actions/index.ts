"use server";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Progress } from "@/models/Progress";
import { Lesson } from "@/models/Lesson";
import { Module } from "@/models/Module";
import { Bookmark } from "@/models/Bookmark";
import { auth, currentUser } from "@clerk/nextjs/server";
import { awardXP, updateStreak, checkAchievements } from "@/lib/xp";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(lessonId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await connectDB();
  
  const user = await User.findOne({ clerkId });
  if (!user) throw new Error("User not found");

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  // Check if already completed
  let progress = await Progress.findOne({ userId: user._id, lessonId });
  
  if (!progress) {
    progress = new Progress({
      userId: user._id,
      lessonId: lesson._id,
      moduleId: lesson.moduleId,
      courseId: lesson.courseId,
      status: "completed",
      xpEarned: lesson.xpReward,
      completedAt: new Date(),
      attempts: 1,
    });
  } else {
    if (progress.status === "completed") {
      return { xpEarned: 0, leveledUp: false, newAchievements: [] }; // Already completed
    }
    progress.status = "completed";
    progress.xpEarned = lesson.xpReward;
    progress.completedAt = new Date();
    progress.attempts += 1;
  }
  
  await progress.save();

  // 1. Award XP
  const { leveledUp } = await awardXP(user._id.toString(), lesson.xpReward, "Completed lesson: " + lesson.title);
  
  // 2. Update Streak
  await updateStreak(user._id.toString());
  
  // 3. Check Achievements
  const newAchievements = await checkAchievements(user._id.toString());

  // Revalidate Dashboard and Learning paths
  revalidatePath("/dashboard");
  revalidatePath("/learn");

  return {
    xpEarned: lesson.xpReward,
    leveledUp,
    newAchievements: JSON.parse(JSON.stringify(newAchievements)),
  };
}

export async function getLessonBySlug(moduleSlug: string, lessonSlug: string) {
  await connectDB();
  
  const moduleDoc = await Module.findOne({ slug: moduleSlug });
  if (!moduleDoc) return null;
  
  const lesson = await Lesson.findOne({ moduleId: moduleDoc._id, slug: lessonSlug });
  return lesson ? JSON.parse(JSON.stringify(lesson)) : null;
}

export async function getModuleWithProgress(moduleSlug: string) {
  const { userId: clerkId } = await auth();
  
  await connectDB();
  const moduleDoc = await Module.findOne({ slug: moduleSlug });
  if (!moduleDoc) return null;

  const lessons = await Lesson.find({ moduleId: moduleDoc._id }).sort({ order: 1 }).lean();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let userProgress: any[] = [];
  if (clerkId) {
    let user = await User.findOne({ clerkId });
    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = await User.create({
          clerkId: clerkId,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          avatar: clerkUser.imageUrl || "",
        });
      }
    }
    
    if (user) {
      userProgress = await Progress.find({ userId: user._id, moduleId: moduleDoc._id }).lean();
    }
  }

  return {
    module: JSON.parse(JSON.stringify(moduleDoc)),
    lessons: JSON.parse(JSON.stringify(lessons)),
    progress: JSON.parse(JSON.stringify(userProgress)),
  };
}

export async function getAdjacentLessons(lessonId: string) {
  await connectDB();
  const currentLesson = await Lesson.findById(lessonId);
  if (!currentLesson) return { prev: null, next: null };

  const prev = await Lesson.findOne({ 
    moduleId: currentLesson.moduleId, 
    order: { $lt: currentLesson.order } 
  }).sort({ order: -1 }).lean();

  const next = await Lesson.findOne({ 
    moduleId: currentLesson.moduleId, 
    order: { $gt: currentLesson.order } 
  }).sort({ order: 1 }).lean();

  return {
    prev: prev ? JSON.parse(JSON.stringify(prev)) : null,
    next: next ? JSON.parse(JSON.stringify(next)) : null,
  };
}

export async function bookmarkLesson(lessonId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await connectDB();
  const user = await User.findOne({ clerkId });
  if (!user) throw new Error("User not found");

  const existing = await Bookmark.findOne({ userId: user._id, resourceId: lessonId, resourceType: "lesson" });
  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
  } else {
    await Bookmark.create({
      userId: user._id,
      resourceId: lessonId,
      resourceType: "lesson",
    });
  }
}

export async function getUserBookmarks() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await connectDB();
  const user = await User.findOne({ clerkId });
  if (!user) return [];

  const bookmarks = await Bookmark.find({ userId: user._id }).lean();
  return JSON.parse(JSON.stringify(bookmarks));
}

// ---- NEW SSG ACTIONS ----

export async function getStaticModules() {
  await connectDB();
  const modules = await Module.find({}).select('slug').lean();
  return JSON.parse(JSON.stringify(modules));
}

export async function getStaticLessons() {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lessons = await Lesson.find({}).populate('moduleId', 'slug').lean() as any[];
  return JSON.parse(JSON.stringify(lessons));
}

export async function getModuleContent(moduleSlug: string) {
  await connectDB();
  const moduleDoc = await Module.findOne({ slug: moduleSlug }).lean();
  if (!moduleDoc) return null;
  const lessons = await Lesson.find({ moduleId: moduleDoc._id }).sort({ order: 1 }).lean();
  return {
    module: JSON.parse(JSON.stringify(moduleDoc)),
    lessons: JSON.parse(JSON.stringify(lessons)),
  };
}

export async function getUserProgressForModule(moduleSlug: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];
  
  await connectDB();
  const user = await User.findOne({ clerkId });
  if (!user) return [];
  
  const moduleDoc = await Module.findOne({ slug: moduleSlug });
  if (!moduleDoc) return [];
  
  const progress = await Progress.find({ userId: user._id, moduleId: moduleDoc._id }).lean();
  return JSON.parse(JSON.stringify(progress));
}

export async function getUserProgressForLesson(lessonId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  
  await connectDB();
  const user = await User.findOne({ clerkId });
  if (!user) return null;
  
  const progress = await Progress.findOne({ userId: user._id, lessonId }).lean();
  return JSON.parse(JSON.stringify(progress));
}
