"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function SparkModuleProgress() {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(22);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we fetch from /api/progress/spark
    // For now, mock a progress fetch
    const fetchProgress = async () => {
      try {
        // const res = await fetch('/api/progress/spark');
        // const data = await res.json();
        const mockData = { completed: 0, total: 22 };
        setCompleted(mockData.completed);
        setTotal(mockData.total);
        setProgress((mockData.completed / mockData.total) * 100);
      } catch (e) {
        console.error("Failed to fetch progress", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <div className="h-20 animate-pulse bg-white/5 rounded-2xl w-full max-w-md mt-8 border border-border" />;
  }

  return (
    <div className="w-full max-w-md mt-8 bg-black/20 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Your Progress</h3>
          <p className="text-xs text-slate-400 mt-1">{completed} of {total} lessons completed</p>
        </div>
        <span className="text-xl font-display font-bold text-amber-400">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6 bg-white/10" />
      
      <Link href="/learn/spark/spark-intro" className="block w-full">
        <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2">
          {completed > 0 ? "Continue Learning" : "Start Learning"}
          <Play className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
