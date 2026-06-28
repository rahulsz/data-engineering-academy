import { connectDB } from "./db";
import { User } from "@/models/User";
import { Achievement } from "@/models/Achievement";
import { Progress } from "@/models/Progress";
import { QuizAttempt } from "@/models/QuizAttempt";
import mongoose from "mongoose";

// Calculate level from total XP (exponential curve)
export function getLevelFromXP(xp: number): number {
  return Math.floor(1 + Math.sqrt(xp / 50));
}

// XP needed for next level
export function getXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 50;
}

// Award XP to user, handle level-up logic
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function awardXP(userId: string, amount: number, _reason: string): Promise<{ newXP: number, newLevel: number, leveledUp: boolean }> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const oldLevel = getLevelFromXP(user.xp);
  const newXP = user.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  user.xp = newXP;
  if (leveledUp) {
    user.level = newLevel;
  }
  await user.save();

  // Create an XP transaction/log if needed (can be implemented later, for now just update user)

  return { newXP, newLevel, leveledUp };
}

// Update streak — call on every lesson completion
export async function updateStreak(userId: string): Promise<{ streak: number, isNewRecord: boolean }> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const now = new Date();
  const lastActive = user.lastActive || new Date(0);
  
  // Normalize dates to start of day in UTC for accurate streak calculation
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  
  const diffTime = Math.abs(today.getTime() - lastActiveDay.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = user.streak;
  if (diffDays === 1) {
    // Consecutive day
    newStreak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    newStreak = 1;
  } else if (diffDays === 0) {
    // Already active today, streak remains the same
  }

  const isNewRecord = newStreak > (user.longestStreak || 0);

  user.streak = newStreak;
  user.lastActive = now;
  if (isNewRecord) {
    user.longestStreak = newStreak;
  }

  await user.save();

  return { streak: newStreak, isNewRecord };
}

// Check and unlock achievements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkAchievements(userId: string): Promise<any[]> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newlyUnlocked: any[] = [];
  
  // Get all existing achievements for user
  const existingAchievements = await Achievement.find({ userId });
  const existingTypes = new Set(existingAchievements.map(a => a.type));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unlock = async (type: any, title: string, description: string, icon: string, xpReward: number) => {
    if (!existingTypes.has(type)) {
      const achievement = await Achievement.create({
        userId,
        type,
        title,
        description,
        icon,
        xpReward,
      });
      await awardXP(userId, xpReward, `Achievement unlocked: ${title}`);
      newlyUnlocked.push(achievement);
      existingTypes.add(type);
    }
  };

  // Check XP Achievements
  if (user.xp >= 100) await unlock("xp_100", "Century Club", "Earn your first 100 XP.", "💯", 25);
  if (user.xp >= 1000) await unlock("xp_1000", "XP Millionaire", "Earn 1000 XP.", "💎", 100);

  // Check Streak Achievements
  if (user.streak >= 7) await unlock("streak_7", "7-Day Streak", "Learn for 7 consecutive days.", "🔥", 50);
  if (user.streak >= 30) await unlock("streak_30", "Unstoppable", "Learn for 30 consecutive days.", "🌋", 200);

  // Check Lesson Achievements
  const completedLessons = await Progress.countDocuments({ userId, status: "completed" });
  if (completedLessons >= 1) {
    await unlock("first_lesson", "First Steps", "Complete your first lesson.", "🎯", 10);
  }

  // Check Quiz Achievements
  if (mongoose.models.QuizAttempt) {
      const perfectQuizzes = await QuizAttempt.countDocuments({ userId, score: 100 });
      if (perfectQuizzes >= 1) {
        await unlock("quiz_perfect", "Flawless Victory", "Get 100% on a quiz.", "🏆", 50);
      }
  }

  return newlyUnlocked;
}
