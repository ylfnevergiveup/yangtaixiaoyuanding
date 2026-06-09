"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, CalendarDays, PenLine, Loader2 } from "lucide-react";
import { loadJSON } from "@/lib/api";
import { categoryLabels, cn } from "@/lib/utils";

interface SearchResult {
  type: "plant" | "guide" | "diary";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  categoryLabel?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [plants, setPlants] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [diary, setDiary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 打开时加载数据 + 自动聚焦
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);

    let cancelled = false;
    setLoading(true);

    Promise.all([
      loadJSON<any>("plants"),
      loadJSON<any>("guides"),
      loadJSON<any>("diary"),
    ])
      .then(([p, g, d]) => {
        if (cancelled) return;
        setPlants(p);
        setGuides(g);
        setDiary(d);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    // 延迟聚焦，等动画完成
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open]);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.trim();
      const hits: SearchResult[] = [];

      // 搜索植物
      for (const plant of plants) {
        const desc = (plant.description || "").replace(/<[^>]*>/g, "");
        if (
          (plant.name || "").includes(q) ||
          (plant.scientificName || "").includes(q) ||
          desc.includes(q)
        ) {
          hits.push({
            type: "plant",
            id: plant.id,
            title: plant.name,
            subtitle: plant.scientificName || desc.slice(0, 60),
            href: `/plants/${plant.id}`,
            categoryLabel: categoryLabels[plant.category] || plant.category,
          });
        }
      }

      // 搜索指南
      for (const guide of guides) {
        if (
          (guide.title || "").includes(q) ||
          (guide.summary || "").includes(q)
        ) {
          hits.push({
            type: "guide",
            id: guide.id,
            title: guide.title,
            subtitle: guide.summary || "",
            href: `/guides/${guide.slug || guide.id}`,
          });
        }
      }

      // 搜索日记
      for (const entry of diary) {
        if (
          (entry.title || "").includes(q) ||
          (entry.summary || "").includes(q)
        ) {
          hits.push({
            type: "diary",
            id: entry.id,
            title: entry.title,
            subtitle: entry.summary || "",
            href: `/diary/${entry.slug || entry.id}`,
          });
        }
      }

      setResults(hits);
      setSelectedIndex(-1);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, plants, guides, diary]);

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (results.length === 0 && e.key === "ArrowDown") {
        // 无结果时 ignore arrow keys
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? results.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = selectedIndex >= 0 ? selectedIndex : 0;
        if (results[idx]) {
          router.push(results[idx].href);
          onClose();
        }
      }
    },
    [results, selectedIndex, onClose, router]
  );

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    onClose();
  };

  if (!open) return null;

  const plantResults = results.filter((r) => r.type === "plant");
  const guideResults = results.filter((r) => r.type === "guide");
  const diaryResults = results.filter((r) => r.type === "diary");

  const typeIcon = (type: string) => {
    switch (type) {
      case "plant":
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "guide":
        return <CalendarDays className="h-4 w-4 text-orange-500" />;
      case "diary":
        return <PenLine className="h-4 w-4 text-sky-500" />;
      default:
        return null;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "plant":
        return "植物";
      case "guide":
        return "教程";
      case "diary":
        return "日记";
      default:
        return "";
    }
  };

  const ResultItem = ({
    result,
    index,
  }: {
    result: SearchResult;
    index: number;
  }) => (
    <button
      onClick={() => handleResultClick(result)}
      onMouseEnter={() => setSelectedIndex(index)}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors",
        index === selectedIndex
          ? "bg-green-100 dark:bg-green-800/40"
          : "hover:bg-green-50 dark:hover:bg-green-900/20"
      )}
    >
      {/* 图标 */}
      <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
        {typeIcon(result.type)}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-green-100 truncate">
            {result.title}
          </span>
          {result.categoryLabel && (
            <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-px text-[10px] font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
              {result.categoryLabel}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
          {result.subtitle}
        </p>
      </div>

      {/* 类型标签 */}
      <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-1">
        {typeLabel(result.type)}
      </span>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1a2e22] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 搜索输入区 */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-green-900/30">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索植物、教程、日记..."
            className="flex-1 text-base outline-none bg-transparent text-gray-900 dark:text-green-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* 结果区 */}
        <div className="overflow-y-auto flex-1 px-2 pb-2">
          {/* 初始状态 */}
          {!query.trim() && (
            <div className="text-center py-12">
              <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                输入关键词搜索全站内容
              </p>
            </div>
          )}

          {/* 加载中 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}

          {/* 无结果 */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                未找到 &quot;<strong className="text-gray-700 dark:text-gray-200">{query.trim()}</strong>&quot; 相关内容
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                试试其他关键词
              </p>
            </div>
          )}

          {/* 植物结果 */}
          {plantResults.length > 0 && (
            <div className="mb-2">
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-sm px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-green-900/20">
                <span>🌱</span>
                <span>植物百科</span>
                <span className="ml-auto text-xs text-gray-400">
                  {plantResults.length} 个结果
                </span>
              </div>
              <div className="pt-1">
                {plantResults.slice(0, 8).map((r, i) => {
                  const globalIndex = results.indexOf(r);
                  return (
                    <ResultItem key={`plant-${r.id}`} result={r} index={globalIndex} />
                  );
                })}
                {plantResults.length > 8 && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    还有 {plantResults.length - 8} 个结果，请缩小搜索范围
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 指南结果 */}
          {guideResults.length > 0 && (
            <div className="mb-2">
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-sm px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-green-900/20">
                <span>📖</span>
                <span>种植指南</span>
                <span className="ml-auto text-xs text-gray-400">
                  {guideResults.length} 个结果
                </span>
              </div>
              <div className="pt-1">
                {guideResults.slice(0, 8).map((r, i) => {
                  const globalIndex = results.indexOf(r);
                  return (
                    <ResultItem key={`guide-${r.id}`} result={r} index={globalIndex} />
                  );
                })}
                {guideResults.length > 8 && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    还有 {guideResults.length - 8} 个结果，请缩小搜索范围
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 日记结果 */}
          {diaryResults.length > 0 && (
            <div className="mb-2">
              <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-sm px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-green-900/20">
                <span>📝</span>
                <span>园丁日记</span>
                <span className="ml-auto text-xs text-gray-400">
                  {diaryResults.length} 个结果
                </span>
              </div>
              <div className="pt-1">
                {diaryResults.slice(0, 8).map((r, i) => {
                  const globalIndex = results.indexOf(r);
                  return (
                    <ResultItem key={`diary-${r.id}`} result={r} index={globalIndex} />
                  );
                })}
                {diaryResults.length > 8 && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    还有 {diaryResults.length - 8} 个结果，请缩小搜索范围
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部快捷键提示 */}
        <div className="border-t border-gray-100 dark:border-green-900/30 px-4 py-2.5 flex items-center gap-5 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono">↑↓</kbd>
            {" "}导航
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
            {" "}打开
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd>
            {" "}关闭
          </span>
        </div>
      </div>
    </div>
  );
}
