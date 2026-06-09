"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, X, ChevronRight } from "lucide-react";
import { loadJSON } from "@/lib/api";

const colorMap: Record<string, string> = {
  green: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-200",
  blue: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-200",
  amber: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-200",
  red: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-200",
};

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    loadJSON<any>("announcements", { preferCMS: true }).then((items) => {
      const active = items.filter((a: any) => a.active !== false);
      setAnnouncements(active);
    }).catch(() => {});
  }, []);

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  const item = visible[current % visible.length];
  if (!item) return null;

  const colors = colorMap[item.color] || colorMap.green;

  const handleDismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
  };

  const handlePrevNext = () => {
    if (visible.length > 1) {
      setCurrent((prev) => (prev + 1) % visible.length);
    }
  };

  return (
    <div className={`relative border-b ${colors}`}>
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Megaphone className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.text}</span>
          {item.link && (
            <Link
              href={item.link}
              className="ml-1 inline-flex items-center gap-0.5 font-medium underline whitespace-nowrap flex-shrink-0"
            >
              {item.linkText || "查看详情"}
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          {visible.length > 1 && (
            <button
              onClick={handlePrevNext}
              className="rounded-full px-2 py-0.5 text-xs opacity-60 hover:opacity-100"
              title="下一条"
            >
              {current + 1}/{visible.length}
            </button>
          )}
          <button
            onClick={() => handleDismiss(item.id)}
            className="rounded-full p-1 opacity-50 hover:opacity-100 transition-opacity"
            title="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
