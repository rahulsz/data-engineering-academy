import 'server-only'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { InterviewQuestion } from '@/models/InterviewQuestion'

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
import { Challenge } from '@/models/Challenge'

export async function GET(req: Request) {
  await connectDB()
  try {
    const { searchParams } = new URL(req.url)
    const topic = searchParams.get('topic')
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}
    if (topic) filter.topic = topic
    
    const questions = await InterviewQuestion.find(filter).sort({ order: 1 })
    return NextResponse.json(questions)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
