"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CoverImage from "@/components/CoverImage";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { guides as localGuides, guideCategories } from "@/data/guides";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { loadJSON } from "@/lib/api";
import CommentSection from "@/components/CommentSection";

export default function GuideDetailClient() {
  const params = useParams();
  const rawSlug = params.slug as string;
  // useParams 返回 URL 编码的原始值，需要 decode
  const slug = decodeURIComponent(rawSlug);
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 先检查本地数据
        const local = localGuides.find((g) => g.slug === slug);
        if (local) {
          if (!cancelled) { setGuide(local); setLoading(false); }
          return;
        }

        // 从 API/JSON 加载
        const items = await loadJSON<any>("guides");
        if (cancelled) return;

        const found = items.find(
          (g: any) => g.slug === slug || g.id === slug
        );
        if (found) {
          setGuide(found);
        } else {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
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

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">📚</span>
          <p className="mt-4 text-gray-500">未找到该指南</p>
          <Link href="/guides" className="mt-4 inline-block text-primary hover:underline">返回种植指南</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回种植指南
        </Link>

        <article>
          <div className="h-48 sm:h-64 rounded-3xl bg-gradient-to-br from-leaf-light/30 via-sky-100/30 to-green-50 dark:from-green-800/10 dark:via-sky-900/10 dark:to-green-900/10 flex items-center justify-center mb-8 overflow-hidden">
            {(guide as any).image ? (
              <CoverImage src={(guide as any).image} alt={guide.title} position={(guide as any).imagePosition} />
            ) : (
              <span className="text-6xl sm:text-7xl">
                {guide.category === "beginner"
                  ? "🌱"
                  : guide.category === "seasonal"
                  ? "🌸"
                  : guide.category === "diy"
                  ? "🔧"
                  : "🌿"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
              {guideCategories.find((c) => c.value === guide.category)?.label}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.readTime}分钟阅读
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {guide.author}
            </span>
            <span>{guide.date}</span>
          </div>

          <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200 mb-8">
            {guide.title}
          </h1>

          <div className="prose prose-green dark:prose-invert max-w-none">
            <MarkdownRenderer content={guide.content} />
          </div>

          <div className="mt-10 pt-6 border-t border-green-200/50 dark:border-green-900/30">
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(guide.tags) ? guide.tags : []).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-green-50 px-3 py-1 text-sm text-primary dark:bg-green-900/20 dark:text-green-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
        <CommentSection targetType="guide" targetId={slug} />
      </div>
    </div>
  );
}
