"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  MessageCircle,
  CheckCircle2,
  Send,
  User,
  Loader2,
  LogIn,
} from "lucide-react";
import { questions as localQuestions, Question, Answer } from "@/data/questions";
import { loadJSON, submitAnswer } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

function QuestionDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const defaultQuestion = localQuestions.find((q) => q.id === id);
  const [question, setQuestion] = useState<Question | null>(
    defaultQuestion || null
  );
  const { user } = useAuth();
  const [loading, setLoading] = useState(!defaultQuestion);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    loadJSON<Question>("qa")
      .then((items) => {
        // Try to find from CMS first
        const found = items.find(
          (q) => q.id === id
        );
        if (found) {
          setQuestion(found);
          // Increment view count locally
          setQuestion((prev) =>
            prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
          );
        } else if (defaultQuestion) {
          setQuestion(defaultQuestion);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!defaultQuestion) setLoading(false);
      });
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!user) return;
    if (!answerContent.trim()) {
      setErr("请填写回答内容");
      return;
    }
    if (answerContent.trim().length < 2) {
      setErr("回答内容至少2个字");
      return;
    }
    setErr("");
    setSubmitting(true);

    const result = await submitAnswer(id!, {
      author: user.username,
      content: answerContent.trim(),
    });

    if (result.success && result.data) {
      setAnswerContent("");
      setMsg("✅ 回答已提交，审核通过后展示");
      setTimeout(() => setMsg(""), 3000);
      // Optimistically add answer
      setQuestion((prev) => {
        if (!prev) return prev;
        const newAnswer: Answer = {
          id: result.data.id,
          content: answerContent.trim(),
          author: user!.username,
          date: new Date().toISOString().slice(0, 10),
          status: "draft",
        };
        return {
          ...prev,
          answers: [...(Array.isArray(prev.answers) ? prev.answers : []), newAnswer],
        };
      });
    } else {
      setErr(`❌ ${result.message}`);
    }
    setSubmitting(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1a14]">
        <div className="text-center text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  // 404 state
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1a14]">
        <div className="text-center">
          <span className="text-5xl">🔍</span>
          <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            未找到该问题
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            该问题可能已被删除或不存在
          </p>
          <Link
            href="/community"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Link>
        </div>
      </div>
    );
  }

  const publishedAnswers = Array.isArray(question.answers)
    ? question.answers.filter((a) => a.status !== "draft")
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/community"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回社区
        </Link>

        {/* Question */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          {/* Status + meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                question.isResolved
                  ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300"
              )}
            >
              {question.isResolved ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : null}
              {question.isResolved ? "已解决" : "待回答"}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {question.views} 次浏览
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-green-100">
            {question.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={"/profile?user=" + encodeURIComponent(question.author)}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-light to-leaf flex items-center justify-center text-white text-xs font-medium hover:opacity-80 transition-opacity"
            >
              {question.author[0]}
            </Link>
            <div>
              <Link
                href={"/profile?user=" + encodeURIComponent(question.author)}
                className="text-sm font-medium text-gray-900 hover:text-primary dark:text-green-100 dark:hover:text-green-300 transition-colors"
              >
                {question.author}
              </Link>
              <div className="text-xs text-gray-400">{question.date}</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {question.content}
          </div>

          {question.tags && question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-primary dark:text-green-300" />
            <h2 className="text-lg font-bold text-primary-dark dark:text-green-200">
              回答
            </h2>
            <span className="text-sm text-gray-400">
              {publishedAnswers.length > 0 ? `${publishedAnswers.length} 条` : ""}
            </span>
          </div>

          {publishedAnswers.length === 0 ? (
            <div className="text-center py-8 rounded-2xl bg-white ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                暂无回答，来写第一条吧 💬
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {publishedAnswers.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={"/profile?user=" + encodeURIComponent(a.author)}
                      className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-light to-leaf flex items-center justify-center text-white text-xs font-medium hover:opacity-80 transition-opacity"
                    >
                      {a.author[0]}
                    </Link>
                    <div>
                      <Link
                        href={"/profile?user=" + encodeURIComponent(a.author)}
                        className="text-sm font-medium text-gray-900 hover:text-primary dark:text-green-100 dark:hover:text-green-300 transition-colors"
                      >
                        {a.author}
                      </Link>
                      <span className="ml-2 text-xs text-gray-400">{a.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer form — require login */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          <h3 className="text-base font-semibold text-primary-dark dark:text-green-200 mb-4">
            ✍️ 写回答
          </h3>

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

          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
                  {user.username[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-green-200">
                  {user.username}
                </span>
              </div>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="写下你的回答..."
                rows={4}
                maxLength={1000}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                提交回答
              </button>
            </div>
          ) : (
            <div className="text-center py-6 rounded-xl bg-green-50/50 dark:bg-green-900/10">
              <LogIn className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                登录后即可回答
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <User className="h-4 w-4" />
                登录 / 注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestionDetailClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1a14]">
          <div className="text-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      }
    >
      <QuestionDetailInner />
    </Suspense>
  );
}
