'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, ThumbsUp, ChevronRight, CheckCircle2, Eye, EyeOff, LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [topicFilter, setTopicFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (topicFilter !== 'All') params.append('topic', topicFilter.toLowerCase());
        
        const res = await fetch(`/api/interview-questions?${params.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [topicFilter]);

  const filtered = questions.filter(q => {
    if (diffFilter !== 'All' && q.difficulty !== diffFilter.toLowerCase()) return false;
    if (companyFilter !== 'All' && !q.companies?.includes(companyFilter)) return false;
    return true;
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSet = new Set(bookmarked);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setBookmarked(newSet);
  };

  return (
    <div className="min-h-screen bg-background text-slate-300 font-sans flex flex-col overflow-hidden h-screen">
      
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-border bg-card flex items-center px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <LayoutPanelLeft className="w-6 h-6 text-indigo-500" />
          Interview Prep
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              className="bg-white/5 border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Filters */}
        <div className="w-64 shrink-0 border-r border-border bg-card p-4 flex flex-col gap-8 overflow-y-auto hidden md:flex">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Topic</h3>
            <div className="flex flex-col gap-1">
              {['All', 'SQL', 'Python', 'Spark', 'Kafka', 'Airflow', 'System Design'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${topicFilter === t ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Difficulty</h3>
            <div className="flex flex-col gap-1">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button 
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${diffFilter === d ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Company</h3>
            <div className="flex flex-col gap-1">
              {['All', 'Google', 'Meta', 'Amazon', 'Netflix', 'Uber'].map(c => (
                <button 
                  key={c}
                  onClick={() => setCompanyFilter(c)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${companyFilter === c ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Question List */}
        <div className="flex-1 bg-background flex flex-col border-r border-border overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-card/50 flex items-center justify-between text-sm text-slate-400 shrink-0">
            <span>Showing {filtered.length} questions</span>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Sort: Popular
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              [1,2,3,4,5].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl border border-border animate-pulse" />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-500">No questions match these filters.</div>
            ) : (
              filtered.map((q) => (
                <div 
                  key={q._id}
                  onClick={() => { setSelectedQuestion(q); setShowAnswer(false); }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col gap-3
                    ${selectedQuestion?._id === q._id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-card border-border/50 hover:border-white/20'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mt-1
                      ${q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' : 
                        q.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 
                        'bg-amber-500/10 text-amber-400'}`}
                    >
                      {q.difficulty}
                    </span>
                    <h4 className={`font-bold line-clamp-2 ${selectedQuestion?._id === q._id ? 'text-indigo-100' : 'text-white'}`}>
                      {q.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pl-14">
                    <div className="flex items-center gap-2">
                      {q.companies?.slice(0, 3).map((c: string) => (
                        <span key={c} className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> {q.upvotes || 124}
                      </span>
                      <button 
                        onClick={(e) => toggleBookmark(q._id, e)}
                        className={`transition-colors ${bookmarked.has(q._id) ? 'text-indigo-400' : 'hover:text-indigo-400'}`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked.has(q._id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right - Detail Panel */}
        {selectedQuestion ? (
          <div className="w-[450px] shrink-0 bg-card flex flex-col overflow-hidden shadow-2xl z-10 hidden lg:flex">
            <div className="p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded
                  ${selectedQuestion.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' : 
                    selectedQuestion.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 
                    'bg-amber-500/10 text-amber-400'}`}
                >
                  {selectedQuestion.difficulty}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 px-2 py-1 rounded">
                  {selectedQuestion.topic}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">{selectedQuestion.title}</h2>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {selectedQuestion.companies?.map((c: string) => (
                  <span key={c} className="text-xs text-slate-400 bg-white/5 border border-border px-2 py-1 rounded-md">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Problem Statement</h3>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedQuestion.description || "Explain this concept in detail, providing examples where necessary."}
                </div>
              </div>

              {!showAnswer ? (
                <div className="border border-indigo-500/30 bg-indigo-500/5 rounded-xl p-6 text-center">
                  <p className="text-sm text-indigo-200/70 mb-4">Take a moment to formulate your answer before revealing the solution.</p>
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <Eye className="w-4 h-4" /> Reveal Answer
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Solution</h3>
                    <button onClick={() => setShowAnswer(false)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hide
                    </button>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed border-l-2 border-emerald-500/50 pl-4 py-2 bg-emerald-500/5 rounded-r-xl whitespace-pre-wrap">
                    {selectedQuestion.answer || "This is a detailed placeholder for the answer, usually rendered with MDX. It explains the core concepts, provides code snippets if relevant, and details common pitfalls."}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-background shrink-0 flex items-center gap-3">
              <button 
                className="flex-1 py-2.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 border border-border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Reviewed
              </button>
              <button 
                onClick={(e) => toggleBookmark(selectedQuestion._id, e)}
                className={`flex-1 py-2.5 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors
                  ${bookmarked.has(selectedQuestion._id) ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-border hover:bg-white/10 text-slate-300'}`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked.has(selectedQuestion._id) ? 'fill-current' : ''}`} /> 
                {bookmarked.has(selectedQuestion._id) ? 'Saved' : 'Bookmark'}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[450px] shrink-0 bg-card flex flex-col items-center justify-center text-slate-500 hidden lg:flex border-l border-border/50">
            <LayoutPanelLeft className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a question to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
