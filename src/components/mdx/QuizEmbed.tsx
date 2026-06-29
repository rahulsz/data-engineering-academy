'use client';

import React, { useState, useEffect } from 'react';
import { QuizUI } from '@/features/quiz/components/QuizUI';
import { AlertCircle } from 'lucide-react';

interface QuizEmbedProps {
  quizId: string;
  nextLessonSlug?: string;
}

export function QuizEmbed({ quizId, nextLessonSlug }: QuizEmbedProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) {
          throw new Error('Quiz not found');
        }
        const data = await res.json();
        setQuiz(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 my-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-white/5 rounded-2xl animate-pulse mb-6" />
        <div className="w-48 h-6 bg-white/5 rounded animate-pulse mb-4" />
        <div className="w-full max-w-md h-4 bg-white/5 rounded animate-pulse mb-2" />
        <div className="w-full max-w-sm h-4 bg-white/5 rounded animate-pulse mb-8" />
        <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-8 my-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center min-h-[200px]">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-400 mb-2">Quiz Load Error</h3>
        <p className="text-red-300/70 text-sm">
          {error || 'Unable to load this quiz module. It may have been moved or deleted.'}
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <QuizUI quiz={quiz} nextLessonSlug={nextLessonSlug} />
    </div>
  );
}
