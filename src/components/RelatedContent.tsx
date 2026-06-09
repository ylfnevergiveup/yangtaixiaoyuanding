"use client";

import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";
import type { RelatedItem } from "@/lib/relatedContent";

interface RelatedContentProps {
  guides: RelatedItem[];
  diaries: RelatedItem[];
}

function RelatedCard({ item }: { item: RelatedItem }) {
  return (
    <Link
      href={item.url}
      className="block rounded-xl bg-green-50/50 p-4 hover:bg-green-100/60 transition-colors dark:bg-green-900/10 dark:hover:bg-green-900/20"
    >
      <h3 className="text-sm font-semibold text-gray-800 dark:text-green-100 line-clamp-1">
        {item.title}
      </h3>
      {item.summary ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {item.summary}
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 italic">
          暂无简介
        </p>
      )}
      <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
        {item.categoryLabel}
      </span>
    </Link>
  );
}

export default function RelatedContent({ guides, diaries }: RelatedContentProps) {
  if (guides.length === 0 && diaries.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
      {/* 相关指南 */}
      {guides.length > 0 && (
        <div className={diaries.length > 0 ? "mb-6" : ""}>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-dark dark:text-green-200">
            <BookOpen className="h-5 w-5" />
            相关种植指南
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guides.map((item) => (
              <RelatedCard key={`guide-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* 相关日记 */}
      {diaries.length > 0 && (
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-dark dark:text-green-200">
            <PenLine className="h-5 w-5" />
            相关园丁日记
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diaries.map((item) => (
              <RelatedCard key={`diary-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
