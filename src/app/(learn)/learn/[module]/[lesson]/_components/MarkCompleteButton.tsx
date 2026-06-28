"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { markLessonComplete, getUserProgressForLesson } from "@/features/learn/actions";
import { CheckCircle2, Loader2, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MarkCompleteButton({ lessonId }: { lessonId: string }) {
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    getUserProgressForLesson(lessonId).then(p => {
      setIsCompleted(!!(p && p.status === "completed"));
      setInitialLoad(false);
    });
  }, [lessonId]);

  const handleComplete = async () => {
    if (isCompleted) return;
    
    setLoading(true);
    try {
      const result = await markLessonComplete(lessonId);
      
      // Fire confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#4f46e5', '#10b981']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#4f46e5', '#10b981']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Lesson Completed!
          </span>
          <span className="text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> +{result.xpEarned} XP Earned
          </span>
        </div>
      );

      if (result.leveledUp) {
        toast.success("Level Up! 🌟", {
          description: "You've reached a new level in Data Engineering!",
          duration: 5000,
        });
      }
      
      if (result.newAchievements?.length > 0) {
        result.newAchievements.forEach((ach: any) => {
          toast.success(`Achievement Unlocked: ${ach.title} ${ach.icon}`);
        });
      }

      router.refresh(); // Refresh to update sidebar and status
    } catch (error) {
      toast.error("Failed to mark lesson complete.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      size="lg" 
      onClick={handleComplete}
      disabled={isCompleted || loading || initialLoad}
      className={
        initialLoad
          ? "bg-surface-deep text-slate-500 w-full md:w-auto"
          : isCompleted 
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 w-full md:w-auto"
          : "bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto shadow-[0_0_20px_rgba(79,70,229,0.3)]"
      }
    >
      {initialLoad ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading...</>
      ) : loading ? (
        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Completing...</>
      ) : isCompleted ? (
        <><CheckCircle2 className="w-5 h-5 mr-2" /> Completed</>
      ) : (
        "Mark as Complete"
      )}
    </Button>
  );
}
