import 'server-only'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

// Mongoose cold-start registration
import { User } from '@/models/User'
import { Course } from '@/models/Course'
import { Module } from '@/models/Module'
import { Lesson } from '@/models/Lesson'
import { Progress } from '@/models/Progress'
import { Achievement } from '@/models/Achievement'
import { Quiz } from '@/models/Quiz'
import { QuizAttempt } from '@/models/QuizAttempt'
import { Flashcard } from '@/models/Flashcard'
import { Challenge } from '@/models/Challenge'
import { InterviewQuestion } from '@/models/InterviewQuestion'

export async function GET(req: Request, { params }: { params: Promise<{ quizId: string }> | { quizId: string } }) {
  await connectDB()
  try {
    const resolvedParams = await params
    const quiz = await Quiz.findById(resolvedParams.quizId)
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    return NextResponse.json(quiz)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
