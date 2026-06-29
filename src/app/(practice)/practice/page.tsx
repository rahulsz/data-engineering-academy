'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, BookOpen, Layers, CheckCircle2, ChevronRight, X, Play, RefreshCcw } from 'lucide-react';
import { FlashcardDeck } from '@/features/flashcards/components/FlashcardDeck';

type Tab = 'challenges' | 'flashcards' | 'quiz';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<Tab>('challenges');
  
  return (
    <div className="min-h-screen bg-background text-slate-300 font-sans pb-20">
      
      {/* Header */}
      <div className="bg-card border-b border-border pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Practice Center</h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">
            Sharpen your data engineering skills with interactive SQL challenges, flashcards, and quizzes.
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('challenges')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors
                ${activeTab === 'challenges' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Database className="w-4 h-4" /> SQL Challenges
            </button>
            <button 
              onClick={() => setActiveTab('flashcards')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors
                ${activeTab === 'flashcards' ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> Flashcards
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors
                ${activeTab === 'quiz' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Zap className="w-4 h-4" /> Quick Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {activeTab === 'challenges' && (
            <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ChallengesTab />
            </motion.div>
          )}
          {activeTab === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FlashcardsTab />
            </motion.div>
          )}
          {activeTab === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center text-slate-500 py-20 bg-white/5 rounded-2xl border border-border">
                <Zap className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Quick Quiz Selection</h3>
                <p>Select a module to start a 10-question rapid-fire quiz. (Coming soon)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}

function ChallengesTab() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [diffFilter, setDiffFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  
  const [activeChallenge, setActiveChallenge] = useState<any>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch('/api/challenges');
        const data = await res.json();
        if (Array.isArray(data)) setChallenges(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  const filtered = challenges.filter(c => {
    if (diffFilter !== 'All' && c.difficulty !== diffFilter.toLowerCase()) return false;
    if (catFilter !== 'All' && c.category !== catFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-border">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
            <button 
              key={d} 
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${diffFilter === d ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-border">
          {['All', 'Joins', 'Aggregations', 'Window Functions', 'CTEs', 'Subqueries'].map(c => (
            <button 
              key={c} 
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${catFilter === c ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white/5 border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(c => (
            <div key={c._id} className="bg-card border border-border rounded-2xl p-6 flex flex-col group hover:border-indigo-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded
                    ${c.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' : 
                      c.difficulty === 'advanced' ? 'bg-red-500/10 text-red-400' : 
                      'bg-amber-500/10 text-amber-400'}`}
                  >
                    {c.difficulty}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 px-2 py-1 rounded">
                    {c.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded">
                  +{c.xpReward || 25} XP
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">{c.description}</p>
              
              <button 
                onClick={() => setActiveChallenge(c)}
                className="w-full py-3 bg-white/5 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-600"
              >
                Solve Challenge <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-border">
              No challenges match these filters.
            </div>
          )}
        </div>
      )}

      {/* Challenge Modal placeholder */}
      <AnimatePresence>
        {activeChallenge && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm p-6"
          >
            <div className="flex-1 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
              <div className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
                <div className="font-bold text-white flex items-center gap-3">
                  <Database className="w-5 h-5 text-indigo-500" />
                  {activeChallenge.title}
                </div>
                <button onClick={() => setActiveChallenge(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 flex overflow-hidden">
                <div className="w-1/3 border-r border-border p-6 overflow-y-auto bg-background">
                  <h3 className="font-bold text-white mb-2">Problem Statement</h3>
                  <div className="text-sm text-slate-300 leading-relaxed mb-6">{activeChallenge.description}</div>
                  
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                    <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2">Hints</div>
                    <ul className="list-disc pl-4 text-sm text-indigo-200 space-y-1">
                      {activeChallenge.hints?.map((h: string, i: number) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-card flex flex-col relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-4">
                    <Database className="w-12 h-12 opacity-20" />
                    <p className="max-w-xs text-center text-sm">Mini SQL Playground goes here.<br/>(Use full Playground for now to execute queries)</p>
                    <button onClick={() => setActiveChallenge(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlashcardsTab() {
  const [moduleSlug, setModuleSlug] = useState('sql-basics');
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      try {
        const res = await fetch(`/api/flashcards/${moduleSlug}`);
        const data = await res.json();
        if (Array.isArray(data)) setCards(data);
        else setCards([]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [moduleSlug]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-border">
          {[
            { id: 'sql-basics', label: 'SQL Basics' },
            { id: 'advanced-sql', label: 'Advanced SQL' },
            { id: 'python', label: 'Python for DE' },
            { id: 'spark', label: 'Apache Spark' }
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setModuleSlug(m.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${moduleSlug === m.id ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="max-w-3xl mx-auto h-[400px] bg-white/5 rounded-3xl border border-border animate-pulse flex items-center justify-center text-slate-500">
          <RefreshCcw className="w-8 h-8 animate-spin" />
        </div>
      ) : cards.length > 0 ? (
        <FlashcardDeck cards={cards} />
      ) : (
        <div className="text-center text-slate-500 py-20 bg-white/5 rounded-2xl border border-border max-w-3xl mx-auto">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p>No flashcards found for this module yet.</p>
        </div>
      )}
    </div>
  );
}
