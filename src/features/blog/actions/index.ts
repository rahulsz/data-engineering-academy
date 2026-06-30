"use server";
import "server-only";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
import { Project } from '@/models/Project';
import { BlogPost } from '@/models/BlogPost';
import { Comment } from '@/models/Comment';

async function getOrCreateBlogPostId(slug: string, title: string) {
  let post = await BlogPost.findOne({ slug });
  if (!post) {
    post = await BlogPost.create({ slug, title, published: true });
  }
  return post._id;
}

export async function getComments(slug: string) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug });
    if (!post) return [];

    const comments = await Comment.find({ postId: post._id, parentId: { $exists: false } })
      .populate('userId', 'firstName lastName avatarUrl clerkId')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function addComment(slug: string, title: string, content: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    await connectDB();
    const user = await User.findOne({ clerkId });
    if (!user) return { success: false, error: "User not found in DB" };

    const postId = await getOrCreateBlogPostId(slug, title);

    await Comment.create({
      postId,
      userId: user._id,
      content
    });

    revalidatePath(`/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}
