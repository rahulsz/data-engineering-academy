import React from "react";
import { HelpCircle } from "lucide-react";

export function QuizEmbed({ id }: { id: string }) {
  return (
    <div className="my-8 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-emerald-500/20 rounded-2xl mb-4 relative z-10">
        <HelpCircle className="w-8 h-8 text-emerald-400" />
      </div>
      <h4 className="text-lg font-display font-semibold text-white mb-2 relative z-10">
        Knowledge Check: Quiz {id}
      </h4>
      <p className="text-slate-400 max-w-md relative z-10">
        Test your understanding of the concepts covered in this lesson. (Coming in Sprint 4)
      </p>
      <button className="mt-6 px-6 py-2 bg-emerald-500/20 text-emerald-300 rounded-full font-medium border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors relative z-10 cursor-not-allowed">
        Start Quiz (Locked)
      </button>
    </div>
  );
}
