"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Pin, ChevronRight, CalendarDays } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { diaryEntries as localDiary, diaryCategories } from "@/data/diary";
import { loadJSON } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function DiaryPage() {
  const [category, setCategory] = useState("all");
  const [diaryEntries, setDiaryEntries] = useState(localDiary);

  useEffect(() => {
    loadJSON<any>("diary").then((items) => {
      if (items.length > 0) setDiaryEntries(items);
    }).catch(() => {});
  }, []);

  const filtered = category === "all" ? diaryEntries : diaryEntries.filter((d: any) => d.category === category);
  // 置顶优先
  const sorted = [...filtered].sort((a: any, b: any) => (a.pinned ? -1 : b.pinned ? 1 : 0));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              📝 园丁日记
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              实战经验分享、避坑指南、花园展示——真实场景下的种植记录
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {diaryCategories.map((cat) => (
              <button key={cat.value} onClick={() => setCategory(cat.value)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-all", category === cat.value ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30")}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sorted.map((entry) => (
              <Link key={entry.id} href={`/diary/${entry.slug}`} className="group block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-light/30 to-sky-100/30 dark:from-green-800/20 dark:to-sky-900/20 text-3xl overflow-hidden">
                    {(entry as any).image ? (
                      <CoverImage src={(entry as any).image} alt={entry.title} position={(entry as any).imagePosition} />
                    ) : (
                      <>{entry.category === "practice" ? "🌱" : entry.category === "pitfall" ? "⚠️" : "📸"}</>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
                      {entry.pinned && <span className="text-primary dark:text-green-300 flex items-center gap-1"><Pin className="h-3 w-3" />置顶</span>}
                      <span>{diaryCategories.find((c) => c.value === entry.category)?.label}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{entry.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{entry.readTime}分钟</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary transition-colors">{entry.title}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{entry.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="hidden sm:block h-5 w-5 flex-shrink-0 text-gray-300 group-hover:text-primary transition-colors dark:text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
