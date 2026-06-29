"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const getCourseIcon = (slug: string) => {
  const icons: Record<string, string> = {
    'sql': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg',
    'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
    'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    'db-fundamentals': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
    'data-warehousing': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
    'etl': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg',
    'elt': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/d3js/d3js-original.svg',
    'spark': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg',
    'kafka': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg',
    'airflow': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg',
    'snowflake': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg',
    'aws-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    'azure-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    'gcp-de': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  };
  return icons[slug] || null;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ModuleProgressGrid({ modules }: { modules: any[] }) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
    >
      {modules.map((module) => {
        const progress = Math.min((module.completedLessons / module.totalLessons) * 100, 100) || 0;
        const isCompleted = progress === 100;
        const isInProgress = progress > 0 && progress < 100;
        
        return (
          <motion.div key={module._id} variants={item}>
            <Link href={`/learn/${module.slug}`}>
              <Card className={`h-full bg-white/5 border-border backdrop-blur-xl hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden group`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {getCourseIcon(module.slug) ? (
                        <img src={getCourseIcon(module.slug)!} alt={module.title} className="w-7 h-7 object-contain" />
                      ) : (
                        <span className="text-2xl">{module.icon}</span>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      isCompleted ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                      isInProgress ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" :
                      "text-slate-400 border-slate-500/30 bg-slate-500/10"
                    }`}>
                      {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-1">{module.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{module.completedLessons} / {module.totalLessons} Lessons</p>
                  
                  <div className="h-1.5 w-full bg-surface-deep rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function ActivityTimeline({ timeline }: { timeline: any[] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center p-8 bg-white/5 border border-border rounded-xl backdrop-blur-sm">
        <p className="text-slate-400">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-border space-y-8 py-4">
      {timeline.map((item, idx) => (
        <motion.div 
          key={item.id + idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-surface-deep border border-white/20 flex items-center justify-center text-[10px] shadow-lg">
            {item.icon}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">{item.title}</h4>
            <p className="text-slate-400 text-xs mt-1">{item.description}</p>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-2">
              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
