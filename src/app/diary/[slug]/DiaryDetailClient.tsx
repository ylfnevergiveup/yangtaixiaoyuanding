"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CoverImage from "@/components/CoverImage";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, Pin } from "lucide-react";
import { diaryEntries as localDiary, diaryCategories } from "@/data/diary";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { loadJSON } from "@/lib/api";
import CommentSection from "@/components/CommentSection";

export default function DiaryDetailClient() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const local = localDiary.find((d) => d.slug === slug);
        if (local) { if (!cancelled) { setEntry(local); setLoading(false); } return; }
        const items = await loadJSON<any>("diary");
        if (cancelled) return;
        const found = items.find((d: any) => d.slug === slug || d.id === slug);
        if (found) setEntry(found);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">📝</span>
          <p className="mt-4 text-gray-500">未找到该日记</p>
          <Link href="/diary" className="mt-4 inline-block text-primary hover:underline">返回园丁日记</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/diary" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回园丁日记
        </Link>

        <article>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
            {entry.pinned && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300 flex items-center gap-1">
                <Pin className="h-3 w-3" /> 置顶
              </span>
            )}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
              {diaryCategories.find((c) => c.value === entry.category)?.label}
            </span>
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{entry.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{entry.readTime}分钟阅读</span>
          </div>

          {(entry as any).image && (
            <div className="h-48 sm:h-64 rounded-3xl bg-gradient-to-br from-leaf-light/30 via-sky-100/30 to-green-50 dark:from-green-800/10 dark:via-sky-900/10 dark:to-green-900/10 overflow-hidden mb-8">
              <CoverImage src={(entry as any).image} alt={entry.title} position={(entry as any).imagePosition} />
            </div>
          )}
          <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200 mb-8">{entry.title}</h1>

          <div className="prose prose-green dark:prose-invert max-w-none">
            <MarkdownRenderer content={entry.content} />
          </div>

          <div className="mt-10 pt-6 border-t border-green-200/50 dark:border-green-900/30">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(entry.tags) ? entry.tags : []).map((tag: string) => (
                <span key={tag} className="rounded-full bg-green-50 px-3 py-1 text-sm text-primary dark:bg-green-900/20 dark:text-green-300">#{tag}</span>
              ))}
            </div>
          </div>
        </article>
        <CommentSection targetType="diary" targetId={slug} />
      </div>
    </div>
  );
}
