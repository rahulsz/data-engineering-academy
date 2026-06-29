import 'server-only'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'

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

export async function GET(req: Request, { params }: { params: Promise<{ moduleSlug: string }> | { moduleSlug: string } }) {
  await connectDB()
  try {
    const resolvedParams = await params
    const moduleObj = await Module.findOne({ slug: resolvedParams.moduleSlug })
    if (!moduleObj) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

    const flashcards = await Flashcard.find({ moduleId: moduleObj._id }).sort({ order: 1 })
    return NextResponse.json(flashcards)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
