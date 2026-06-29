import 'server-only'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Challenge } from '@/models/Challenge'

// cold starts
import { User } from '@/models/User'
import { Course } from '@/models/Course'
import { Module } from '@/models/Module'
import { Lesson } from '@/models/Lesson'
import { Progress } from '@/models/Progress'
import { Achievement } from '@/models/Achievement'
import { Quiz } from '@/models/Quiz'
import { QuizAttempt } from '@/models/QuizAttempt'
import { Flashcard } from '@/models/Flashcard'
import { InterviewQuestion } from '@/models/InterviewQuestion'

export async function GET() {
  await connectDB()
  try {
    const challenges = await Challenge.find({}).sort({ order: 1 })
    return NextResponse.json(challenges)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
