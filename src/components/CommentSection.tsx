"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Send, User, MessageCircle, Loader2, LogIn } from "lucide-react";
import { loadJSON, submitToCMS } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface Comment {
  id: string;
  targetType: string;
  targetId: string;
  author: string;
  content: string;
  date: string;
  status: string;
}

interface Props {
  targetType: "plant" | "guide" | "diary";
  targetId: string;
}

export default function CommentSection({ targetType, targetId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const loadComments = useCallback(async () => {
    try {
      const all = await loadJSON<Comment>("comments");
      const filtered = all.filter(
        (c) => c.targetType === targetType && c.targetId === targetId
      );
      // newest first
      filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setComments(filtered);
    } catch {
      // silent fallback
    }
    setLoading(false);
  }, [targetType, targetId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!content.trim()) {
      setErr("请填写评论内容");
      return;
    }
    if (content.trim().length < 2) {
      setErr("评论内容至少2个字");
      return;
    }
    setErr("");
    setSubmitting(true);
    const record = {
      id:
        "comment-" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6),
      targetType,
      targetId,
      author: user.username,
      content: content.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: "published",
    };
    const result = await submitToCMS("comments", record);
    if (result.success) {
      setContent("");
      setMsg("✅ 留言成功！");
      setTimeout(() => setMsg(""), 3000);
      // optimistically add to list
      setComments((prev) => [record as Comment, ...prev]);
    } else {
      setErr(`❌ ${result.message}`);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary dark:text-green-300" />
        <h3 className="text-lg font-bold text-primary-dark dark:text-green-200">
          留言
        </h3>
        <span className="text-sm text-gray-400">
          {comments.length > 0 ? `${comments.length} 条` : ""}
        </span>
      </div>

      {msg && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
          {msg}
        </div>
      )}
      {err && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {err}
        </div>
      )}

      {/* Comment form — require login */}
      {user ? (
        <div className="mb-6 rounded-xl bg-green-50/50 p-4 dark:bg-green-900/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
              {user.username[0]}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-green-200">
              {user.username}
            </span>
          </div>
          <div className="flex gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你的留言..."
              rows={3}
              maxLength={500}
              className="flex-1 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 resize-none dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-shrink-0 self-end flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              发送
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-green-50/50 p-6 text-center dark:bg-green-900/10">
          <LogIn className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            登录后即可留言
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-all"
          >
            <User className="h-4 w-4" />
            登录 / 注册
          </Link>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          加载中...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无留言，来写第一条吧 🌱</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0f1a14]/50"
            >
              {c.author ? (
                <Link
                  href={"/profile?user=" + encodeURIComponent(c.author)}
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  {c.author[0]}
                </Link>
              ) : (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {c.author ? (
                    <Link
                      href={"/profile?user=" + encodeURIComponent(c.author)}
                      className="text-sm font-medium text-gray-900 hover:text-primary dark:text-green-100 dark:hover:text-green-300 transition-colors"
                    >
                      {c.author}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-gray-900 dark:text-green-100">
                      匿名
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
