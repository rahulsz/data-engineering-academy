'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Play, CheckCircle2, XCircle, ChevronRight, RotateCcw, Target, ListChecks, Award } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  xpReward: number;
  questions: Question[];
}

interface QuizUIProps {
  quiz: Quiz;
  nextLessonSlug?: string;
}

type QuizState = 'idle' | 'in_progress' | 'review' | 'completed';

export function QuizUI({ quiz, nextLessonSlug }: QuizUIProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  
  const [timeUsed, setTimeUsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const startQuiz = () => {
    setState('in_progress');
    setAnswers([]);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTimeUsed(0);
    
    if (quiz.timeLimit) {
      timerRef.current = setInterval(() => {
        setTimeUsed(prev => {
          if (prev >= (quiz.timeLimit || 0) * 60) {
            if (timerRef.current) clearInterval(timerRef.current);
            submitQuiz(answers); // Auto-submit when time is up
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      timerRef.current = setInterval(() => setTimeUsed(p => p + 1), 1000);
    }
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswerRevealed(true);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIdx] = selectedOption;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      submitQuiz(answers);
    }
  };

  const submitQuiz = async (finalAnswers: number[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);
    
    // Optimistically calculate local score
    let earned = 0;
    let total = 0;
    quiz.questions.forEach((q, i) => {
      total += q.points || 1;
      if (finalAnswers[i] === q.correct) earned += q.points || 1;
    });
    const pct = (earned / total) * 100;
    setScore(pct);
    setPassed(pct >= quiz.passingScore);
    
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz._id, answers: finalAnswers, timeSpent: timeUsed })
      });
    } catch (e) {
      console.error('Failed to submit quiz', e);
    }
    
    setIsSubmitting(false);
    setState('completed');
  };

  // Keyboard navigation
  useEffect(() => {
    if (state !== 'in_progress') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswerRevealed) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const opt = parseInt(e.key) - 1;
          if (opt < quiz.questions[currentIdx].options.length) {
            setSelectedOption(opt);
          }
        }
        if (e.key === 'Enter' && selectedOption !== null) {
          handleConfirm();
        }
      } else {
        if (e.key === 'Enter') {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, isAnswerRevealed, selectedOption, currentIdx, quiz.questions, handleConfirm, handleNext]);

  if (state === 'idle') {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <ListChecks className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{quiz.title}</h2>
        <p className="text-slate-400 mb-8">{quiz.description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/50 border border-border/50 p-4 rounded-xl flex flex-col items-center">
            <Target className="w-5 h-5 text-slate-400 mb-2" />
            <span className="text-xl font-bold text-white">{quiz.questions.length}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Questions</span>
          </div>
          <div className="bg-black/50 border border-border/50 p-4 rounded-xl flex flex-col items-center">
            <Clock className="w-5 h-5 text-slate-400 mb-2" />
            <span className="text-xl font-bold text-white">{quiz.timeLimit ? `${quiz.timeLimit}m` : 'None'}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Time Limit</span>
          </div>
          <div className="bg-black/50 border border-border/50 p-4 rounded-xl flex flex-col items-center">
            <Award className="w-5 h-5 text-indigo-400 mb-2" />
            <span className="text-xl font-bold text-indigo-400">+{quiz.xpReward}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">XP Reward</span>
          </div>
        </div>
        
        <button 
          onClick={startQuiz}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Quiz
        </button>
      </div>
    );
  }

  if (state === 'in_progress') {
    const question = quiz.questions[currentIdx];
    
    // Timer calculation
    const timeLimitSecs = quiz.timeLimit ? quiz.timeLimit * 60 : 0;
    const timeRemaining = Math.max(0, timeLimitSecs - timeUsed);
    const progressPct = timeLimitSecs ? (timeUsed / timeLimitSecs) * 100 : 0;
    const isWarning = timeLimitSecs && timeRemaining <= 30;
    const isCritical = timeLimitSecs && timeRemaining <= 10;
    
    return (
      <div className="max-w-3xl mx-auto relative min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-slate-400">Question {currentIdx + 1} of {quiz.questions.length}</div>
          </div>
          
          {quiz.timeLimit && (
            <div className={`flex items-center gap-2 font-mono text-sm px-3 py-1 rounded-full border ${isCritical ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : isWarning ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-border text-slate-300'}`}>
              <Clock className="w-4 h-4" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        
        {/* Progress Bar segments */}
        <div className="flex gap-1 mb-8">
          {quiz.questions.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < currentIdx ? 'bg-indigo-500' : i === currentIdx ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>
        
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-medium text-white mb-8 leading-snug">{question.text}</h3>
            
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = question.correct === i;
                
                let stateClass = 'bg-card border-border text-slate-300 hover:border-white/30 hover:bg-white/5 cursor-pointer';
                
                if (isAnswerRevealed) {
                  if (isCorrect) {
                    stateClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'bg-red-500/10 border-red-500 text-red-400';
                  } else {
                    stateClass = 'bg-card border-border/50 text-slate-600 opacity-50 cursor-default';
                  }
                } else if (isSelected) {
                  stateClass = 'bg-indigo-500/10 border-indigo-500 text-indigo-100';
                }
                
                return (
                  <div 
                    key={i}
                    onClick={() => !isAnswerRevealed && setSelectedOption(i)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${stateClass}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                      ${isAnswerRevealed && isCorrect ? 'bg-emerald-500 text-black' : ''}
                      ${isAnswerRevealed && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                      ${!isAnswerRevealed && isSelected ? 'bg-indigo-500 text-white' : ''}
                      ${!isAnswerRevealed && !isSelected ? 'bg-white/10 text-slate-400 group-hover:bg-white/20' : ''}
                      ${isAnswerRevealed && !isCorrect && !isSelected ? 'bg-white/5 text-slate-600' : ''}
                    `}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                    <span className="text-lg">{opt}</span>
                    
                    {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto shrink-0 text-emerald-500" />}
                    {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto shrink-0 text-red-500" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Footer Controls */}
        <div className="mt-8 pt-6 border-t border-border min-h-[100px] flex items-center">
          <AnimatePresence mode="wait">
            {!isAnswerRevealed ? (
              <motion.button
                key="confirm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                onClick={handleConfirm}
                disabled={selectedOption === null}
                className="ml-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Confirm Answer (Enter)
              </motion.button>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="w-full flex items-start gap-6"
              >
                <div className="flex-1 bg-card border border-border rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Explanation</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all shrink-0 flex items-center gap-2"
                >
                  {currentIdx === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (state === 'completed') {
    const correctAnswers = quiz.questions.filter((q, i) => answers[i] === q.correct).length;
    
    return (
      <div className="bg-card border border-border rounded-2xl p-10 max-w-2xl mx-auto text-center relative overflow-hidden">
        {/* SVG Circle Progress */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke={passed ? "#10b981" : "#ef4444"} 
              strokeWidth="8"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{Math.round(score)}%</span>
          </div>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8 ${passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {passed ? 'Quiz Passed!' : 'Quiz Failed'}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/50 border border-border/50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-white">{correctAnswers} <span className="text-slate-500 text-sm font-normal">/ {quiz.questions.length}</span></div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Correct</div>
          </div>
          <div className="bg-black/50 border border-border/50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-white">{Math.floor(timeUsed / 60)}:{(timeUsed % 60).toString().padStart(2, '0')}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Time Taken</div>
          </div>
        </div>
        
        {passed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8"
          >
            <Trophy className="w-6 h-6 text-indigo-400" />
            <div className="text-left">
              <div className="text-sm text-indigo-200">You earned</div>
              <div className="text-xl font-bold text-indigo-400">+{quiz.xpReward} XP</div>
            </div>
          </motion.div>
        )}
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setState('review')}
            className="w-full py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
          >
            Review Answers
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => { setState('idle'); }}
              className="flex-1 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
            {nextLessonSlug && passed && (
              <Link href={`/learn/${nextLessonSlug}`} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                Next Lesson <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'review') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md p-4 border-b border-border z-10">
          <h2 className="text-xl font-bold text-white">Quiz Review</h2>
          <button 
            onClick={() => setState('completed')}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm font-medium transition-colors"
          >
            Back to Results
          </button>
        </div>
        
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correct;
          
          return (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Question {i + 1}</div>
                  <div className="text-lg text-white font-medium">{q.text}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pl-12">
                <div className="bg-black/50 border border-border/50 rounded-lg p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Your Answer</div>
                  <div className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {userAnswer !== undefined ? q.options[userAnswer] : 'Skipped'}
                  </div>
                </div>
                {!isCorrect && (
                  <div className="bg-black/50 border border-border/50 rounded-lg p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Correct Answer</div>
                    <div className="text-sm font-medium text-emerald-400">{q.options[q.correct]}</div>
                  </div>
                )}
              </div>
              
              <div className="ml-12 bg-white/5 rounded-lg p-4 text-sm text-slate-300 leading-relaxed border-l-2 border-indigo-500">
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
