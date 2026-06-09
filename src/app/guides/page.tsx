"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { guides as localGuides, guideCategories } from "@/data/guides";
import { loadJSON } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GuidesPage() {
  const [category, setCategory] = useState("all");
  const [guides, setGuides] = useState(localGuides);

  useEffect(() => {
    loadJSON<any>("guides").then((items) => {
      if (items.length > 0) setGuides(items);
    }).catch(() => {});
  }, []);

  const filtered =
    category === "all"
      ? guides
      : guides.filter((g: any) => g.category === category);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              📖 种植指南
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              从新手入门到进阶技巧，系统学习阳台种植知识
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {guideCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  category === cat.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">📚</span>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                暂无该分类的指南
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
                >
                  <div className="flex items-start gap-6">
                    <div className="hidden sm:flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-light/30 to-sky-100/30 dark:from-green-800/20 dark:to-sky-900/20 overflow-hidden">
                      {(guide as any).image ? (
                        <CoverImage src={(guide as any).image} alt={guide.title} position={(guide as any).imagePosition} />
                      ) : (
                        <span className="text-3xl">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
                        <span>
                          {guideCategories.find((c) => c.value === guide.category)?.label}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {guide.readTime}分钟阅读
                        </span>
                        <span>·</span>
                        <span>{guide.date}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {guide.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {guide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="hidden sm:block h-5 w-5 flex-shrink-0 text-gray-300 group-hover:text-primary transition-colors dark:text-gray-600" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
