'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit: number | null;
  questions: Question[];
  passingScore: number;
  xpReward: number;
}

export function QuizUI({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    fetch(`/api/quiz/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        if (data.timeLimit) {
          setTimeLeft(data.timeLimit);
        }
        setAnswers(new Array(data.questions.length).fill(-1));
        setLoading(false);
        startTimeRef.current = Date.now();
      });
  }, [quizId]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isFinished]);

  const handleSelectOption = (optIndex: number) => {
    if (showExplanation || isFinished) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers, timeSpent })
      });
      const data = await res.json();
      setResult(data);
      
      if (data.attempt?.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#3b82f6']
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse bg-white/5 rounded-2xl border border-border" />;
  if (!quiz) return <div>Quiz not found</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-black/40 border border-border rounded-2xl p-8 backdrop-blur-xl">
        {submitting ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-white/60">Grading your assessment...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6"
          >
            {result?.attempt?.passed ? (
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <XCircle className="w-10 h-10 text-rose-400" />
              </div>
            )}
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {result?.attempt?.passed ? 'Assessment Passed!' : 'Assessment Failed'}
              </h2>
              <p className="text-white/60">
                You scored <span className="text-white font-medium">{result?.attempt?.score.toFixed(0)}%</span> (Passing: {quiz.passingScore}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="bg-white/5 border border-border rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-semibold text-white">{result?.correctCount}/{result?.totalQuestions}</span>
                <span className="text-xs text-white/50 uppercase tracking-wider">Correct</span>
              </div>
              <div className="bg-white/5 border border-border rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-semibold text-white">{formatTime(result?.attempt?.timeSpent || 0)}</span>
                <span className="text-xs text-white/50 uppercase tracking-wider">Time</span>
              </div>
            </div>

            {result?.xpResult && (
              <div className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-center gap-3 mt-4 text-indigo-400">
                <Award className="w-5 h-5" />
                <span>Earned <strong>{quiz.xpReward} XP</strong></span>
              </div>
            )}

            <button 
              onClick={() => router.refresh()}
              className="mt-6 w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-border"
            >
              Continue Learning
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.questions.length) * 100;
  const isCorrect = answers[currentIndex] === currentQ.correct;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-black/40 border border-border p-4 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Question {currentIndex + 1} of {quiz.questions.length}</span>
          <div className="w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {timeLeft !== null && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border",
            timeLeft < 60 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-white/5 border-border text-white/80"
          )}>
            <Clock className="w-4 h-4" />
            <span className="font-medium font-mono text-sm">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-black/60 border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-xl flex flex-col gap-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="flex flex-col gap-3">
          {currentQ.options.map((opt, i) => {
            const isSelected = answers[currentIndex] === i;
            const isRightOption = i === currentQ.correct;
            
            let stateClass = "bg-white/5 border-border hover:bg-white/10 text-white/90";
            if (showExplanation) {
              if (isRightOption) stateClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
              else if (isSelected) stateClass = "bg-rose-500/10 border-rose-500/30 text-rose-400";
              else stateClass = "bg-white/5 border-border text-white/50 opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                disabled={showExplanation}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group",
                  stateClass
                )}
              >
                <span>{opt}</span>
                {showExplanation && isRightOption && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {showExplanation && isSelected && !isRightOption && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="flex flex-col gap-4 mt-2 overflow-hidden"
            >
              <div className={cn(
                "p-4 rounded-xl border text-sm",
                isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-100" : "bg-rose-500/10 border-rose-500/20 text-rose-100"
              )}>
                <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                <p className="opacity-90 leading-relaxed">{currentQ.explanation}</p>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
              >
                {currentIndex === quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
