"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, BookOpen, Layers, Search } from "lucide-react";

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

export function CourseCatalog({ initialCourses }: { initialCourses: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "beginner" | "intermediate" | "advanced">("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "alphabetical">("popular");

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...initialCourses];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q)
      );
    }

    // Filter by difficulty
    if (activeFilter !== "All") {
      result = result.filter(c => c.level === activeFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "recent") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else {
        // Most popular (using order for now as a proxy, or ideally user enrollments)
        return a.order - b.order;
      }
    });

    return result;
  }, [initialCourses, searchQuery, activeFilter, sortBy]);

  const sortLabel = {
    popular: "Most Popular",
    recent: "Recently Added",
    alphabetical: "Alphabetical"
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 border border-border p-4 rounded-2xl backdrop-blur-md shadow-lg">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..." 
            className="pl-10 bg-black/20 border-border focus-visible:ring-cyan-500 rounded-xl"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          {["All", "beginner", "intermediate", "advanced"].map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter as any)}
              className={`rounded-full capitalize shrink-0 transition-colors ${
                activeFilter === filter 
                  ? "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold border-transparent" 
                  : "bg-white/5 border-border text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="shrink-0 w-full md:w-auto flex justify-end">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-border text-slate-300 hover:bg-white/10 hover:text-white rounded-xl px-4 py-2 w-full md:w-auto appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="popular" className="bg-[#0f172a] text-slate-300">Most Popular</option>
            <option value="recent" className="bg-[#0f172a] text-slate-300">Recently Added</option>
            <option value="alphabetical" className="bg-[#0f172a] text-slate-300">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {filteredAndSortedCourses.length > 0 ? (
          filteredAndSortedCourses.map((course: any, idx: number) => (
            <Link key={course._id} href={`/learn/${course.slug}`}>
              <Card className={`group h-full bg-white/5 border-border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 overflow-hidden shadow-lg ${idx === 0 && sortBy === "popular" && activeFilter === "All" && !searchQuery ? 'lg:col-span-2' : ''}`}>
                <div className="h-56 relative flex items-center justify-center border-b border-border overflow-hidden">
                  {/* Glowing backdrop */}
                  <div className={`absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70 ${
                    idx % 3 === 0 ? 'bg-gradient-to-br from-cyan-600 to-indigo-900' :
                    idx % 3 === 1 ? 'bg-gradient-to-br from-indigo-600 to-purple-900' :
                    'bg-gradient-to-br from-emerald-600 to-teal-900'
                  }`} />
                  <div className="w-24 h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative">
                    {getCourseIcon(course.slug) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={getCourseIcon(course.slug)!} alt={course.title} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-8xl">{course.icon}</span>
                    )}
                  </div>
                  {/* Deep shadow at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                </div>
                
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-sm">
                      {course.title}
                    </h3>
                    <Badge variant="outline" className={`px-3 py-1 font-semibold tracking-wider text-xs border uppercase rounded-full shadow-inner ${
                      course.level === "beginner" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]" :
                      course.level === "intermediate" ? "text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]" :
                      "text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_10px_rgba(243,33,113,0.2)]"
                    }`}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <p className={`text-slate-400 mb-8 leading-relaxed ${idx === 0 && sortBy === "popular" && activeFilter === "All" && !searchQuery ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'}`}>
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 text-xs font-medium text-slate-400 mt-auto pt-6 border-t border-border group-hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-border group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 group-hover:text-cyan-400 transition-all">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span>{course.estimatedHours} Hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-border group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span>{course.totalLessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-border group-hover:bg-purple-500/10 group-hover:border-purple-500/20 group-hover:text-purple-400 transition-all">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span>Comprehensive hands-on coverage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center">
            <div className="inline-flex w-16 h-16 bg-white/5 border border-border rounded-full items-center justify-center text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </>
  );
}
