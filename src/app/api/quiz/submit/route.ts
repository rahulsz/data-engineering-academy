import 'server-only'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

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

import { awardXP, updateStreak, checkAchievements } from '@/lib/xp'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await req.json()
    const { quizId, answers, timeSpent } = body

    await connectDB()
    const quiz = await Quiz.findById(quizId)
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    let correctCount = 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quiz.questions.forEach((q: any, i: number) => {
      const points = q.points || 1
      totalPoints += points
      if (answers[i] === q.correct) {
        earnedPoints += points
        correctCount++
      }
    })

    const score = (earnedPoints / totalPoints) * 100
    const passed = score >= quiz.passingScore

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      score,
      answers,
      passed,
      timeUsed: timeSpent || 0,
      xpEarned: passed ? quiz.xpReward : 0,
      completedAt: new Date()
    })

    const pastAttempts = await QuizAttempt.find({ userId, quizId, passed: true })
    
    let xpResult = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let achievements: any[] = []
    
    // Only award XP if passed and it's their first time passing
    if (passed && pastAttempts.length === 1) { 
      xpResult = await awardXP(userId, quiz.xpReward, `Passed quiz: ${quiz.title}`)
      await updateStreak(userId)
      achievements = await checkAchievements(userId)
    }

    return NextResponse.json({ attempt, xpResult, achievements, correctCount, totalQuestions: quiz.questions.length })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
