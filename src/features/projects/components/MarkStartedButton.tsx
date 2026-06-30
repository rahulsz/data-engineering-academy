"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2, Check } from "lucide-react";
import { markProjectStarted } from "@/features/projects/actions";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export function MarkStartedButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const { isSignedIn } = useAuth();

  const handleStart = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save your progress.");
      return;
    }

    setLoading(true);
    try {
      const res = await markProjectStarted(projectId);
      if (res.success) {
        setStarted(true);
        toast.success("Project marked as started! Added to your dashboard.");
      } else {
        toast.error(res.error || "Failed to mark as started");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (started) {
    return (
      <Button variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default">
        <Check className="w-4 h-4 mr-2" />
        Started
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleStart} 
      disabled={loading}
      className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bookmark className="w-4 h-4 mr-2" />}
      Mark as Started
    </Button>
  );
}
