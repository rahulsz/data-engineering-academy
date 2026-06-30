"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/features/blog/actions";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2 } from "lucide-react";

export function CommentSection({ slug, title, initialComments }: { slug: string; title: string; initialComments: any[] }) {
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(initialComments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await addComment(slug, title, content);
      if (res.success) {
        toast.success("Comment added!");
        setContent("");
        // In a real app we might fetch the new comment list or prepend a local state version
        // For now, revalidatePath handles refreshing the page on next load
      } else {
        toast.error(res.error || "Failed to add comment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-cyan-400" />
        Discussion
      </h3>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-12 relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px] bg-white/5 border-border focus:border-cyan-500 focus:ring-cyan-500/20 resize-none pr-16"
          />
          <Button 
            type="submit" 
            disabled={loading || !content.trim()} 
            size="icon"
            className="absolute bottom-3 right-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      ) : (
        <div className="bg-white/5 border border-border rounded-xl p-6 text-center mb-12">
          <p className="text-slate-400 mb-4">Join the conversation with other data engineers.</p>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            Sign in to Comment
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-black/40 border border-border/50 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 overflow-hidden text-cyan-400 font-bold">
                {comment.userId?.avatarUrl ? (
                  <img src={comment.userId.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  comment.userId?.firstName?.[0] || 'U'
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-white">{comment.userId?.firstName} {comment.userId?.lastName}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
