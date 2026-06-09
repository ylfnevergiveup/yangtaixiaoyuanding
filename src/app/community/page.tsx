"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Eye, CheckCircle2, Plus, Search, Loader2 } from "lucide-react";
import { questions as localQuestions, Question } from "@/data/questions";
import { loadJSON } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>(localQuestions);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("全部");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJSON<Question>("qa").then((items) => {
      if (items.length > 0) {
        // Merge CMS data with local: CMS data wins, local as fallback for missing
        const merged = [...items];
        // Add local questions not in CMS
        for (const lq of localQuestions) {
          if (!merged.find((m) => m.id === lq.id)) {
            merged.push(lq);
          }
        }
        setQuestions(merged);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Build tag list dynamically from data + defaults
  const allTags = new Set<string>();
  const defaults = ["全部", "番茄", "多肉", "花卉", "播种", "病虫害", "养护", "阳台环境"];
  defaults.forEach((t) => allTags.add(t));
  questions.forEach((q) => q.tags?.forEach((t) => allTags.add(t)));
  const tags = Array.from(allTags);

  const answerCount = (q: Question) => {
    if (Array.isArray(q.answers)) {
      return q.answers.filter((a) => a.status !== "draft").length;
    }
    return typeof q.answers === "number" ? q.answers : 0;
  };

  const filtered = questions.filter((q) => {
    if (q.status === "draft") return false;
    if (activeTag !== "全部" && !q.tags?.includes(activeTag)) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      return (
        q.title.toLowerCase().includes(s) ||
        q.content.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
                💬 社区问答
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                和花友们一起交流种植心得，互帮互助
              </p>
            </div>
            <Link
              href="/community/ask"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              提问题
            </Link>
          </div>

          {/* 搜索 */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索问题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-green-200/60 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-[#1a2e22]/80 dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 标签筛选 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeTag === tag
                    ? "bg-primary text-white"
                    : "bg-white text-gray-500 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              加载中...
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                共 {filtered.length} 个问题
              </div>

              <div className="space-y-3">
                {filtered.map((q) => (
                  <Link
                    key={q.id}
                    href={`/community/question?id=${q.id}`}
                    className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-white/5"
                  >
                    <div className="flex items-start gap-4">
                      {/* 状态 */}
                      <div className="hidden sm:flex flex-col items-center gap-1 min-w-[60px]">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold",
                            q.isResolved
                              ? "bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-300"
                              : "bg-amber-100 text-amber-600 dark:bg-amber-800/30 dark:text-amber-300"
                          )}
                        >
                          {q.isResolved ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            "?"
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            q.isResolved
                              ? "text-green-600 dark:text-green-400"
                              : "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {q.isResolved ? "已解决" : "待答"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-base font-semibold text-gray-900 hover:text-primary transition-colors dark:text-green-100 dark:hover:text-green-300">
                          {q.title}
                        </span>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {q.content}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                          <Link
                            href={"/profile?user=" + encodeURIComponent(q.author)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 hover:text-primary dark:hover:text-green-300 transition-colors"
                          >
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary-light to-leaf flex items-center justify-center text-[10px] text-white font-medium">
                              {q.author[0]}
                            </div>
                            <span>{q.author}</span>
                          </Link>
                          <span>{q.date}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {answerCount(q)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {q.views}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {q.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 移动端状态 */}
                      <div className="sm:hidden flex-shrink-0">
                        <div
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            q.isResolved
                              ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300"
                          )}
                        >
                          {q.isResolved ? "已解决" : "待答"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl">🔍</span>
              <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                {search.trim() ? "没有找到匹配的问题" : "暂无问题"}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {search.trim() ? "试试其他关键词" : "来提第一个问题吧"}
              </p>
              {!search.trim() && (
                <Link
                  href="/community/ask"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4" />
                  提问题
                </Link>
              )}
            </div>
          )}

          {/* 发帖引导 */}
          {!loading && filtered.length > 0 && (
            <div className="mt-10 text-center rounded-2xl bg-gradient-to-br from-green-50 to-white p-8 ring-1 ring-green-200/50 dark:from-[#1a2e22]/80 dark:to-[#0f1a14] dark:ring-green-900/30">
              <span className="text-4xl">🌱</span>
              <h3 className="mt-4 text-lg font-semibold text-primary-dark dark:text-green-200">
                遇到种植难题了？
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                在社区提问，热心的花友们会很快来帮你
              </p>
              <Link
                href="/community/ask"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
              >
                发布问题
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
