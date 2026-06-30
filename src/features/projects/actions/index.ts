"use server";
import "server-only";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

// Mongoose cold-start registration
import { User } from '@/models/User';
import { Course } from '@/models/Course';
import { Module } from '@/models/Module';
import { Lesson } from '@/models/Lesson';
import { Progress } from '@/models/Progress';
import { Achievement } from '@/models/Achievement';
import { Quiz } from '@/models/Quiz';
import { QuizAttempt } from '@/models/QuizAttempt';
import { Flashcard } from '@/models/Flashcard';
import { Challenge } from '@/models/Challenge';
import { InterviewQuestion } from '@/models/InterviewQuestion';
import { Project, IProject } from '@/models/Project';
import { BlogPost } from '@/models/BlogPost';
import { Comment } from '@/models/Comment';
import { Bookmark } from '@/models/Bookmark';

export async function getAllProjects() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ difficulty: 1, estimatedHours: 1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    await connectDB();
    const project = await Project.findOne({ slug }).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function markProjectStarted(projectId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    await connectDB();
    
    // We use Bookmark model for tracking projects started
    await Bookmark.findOneAndUpdate(
      { clerkId: userId, itemId: projectId, itemType: 'project' },
      { $set: { clerkId: userId, itemId: projectId, itemType: 'project', createdAt: new Date() } },
      { upsert: true, new: true }
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error marking project started:", error);
    return { success: false, error: "Internal server error" };
  }
}
