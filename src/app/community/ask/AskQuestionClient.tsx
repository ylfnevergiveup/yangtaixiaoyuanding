"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, LogIn, User } from "lucide-react";
import { submitToCMS } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function AskQuestionClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim()) {
      setErr("请填写问题标题");
      return;
    }
    if (!content.trim()) {
      setErr("请填写问题描述");
      return;
    }
    setErr("");
    setSubmitting(true);

    const tagList = tags
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const record = {
      id:
        "qa-" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 4),
      title: title.trim(),
      content: content.trim(),
      author: user.username,
      date: new Date().toISOString().slice(0, 10),
      tags: tagList.length > 0 ? tagList : ["养护"],
      views: 0,
      answers: [],
      isResolved: false,
      status: "draft",
    };

    const result = await submitToCMS("qa", record);
    if (result.success) {
      setMsg("✅ 问题已提交，审核通过后将在社区展示");
      setTimeout(() => router.push("/community"), 1500);
    } else {
      setErr(`❌ 提交失败: ${result.message}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-primary-dark dark:text-green-200">
            ✍️ 提问题
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            描述你遇到的种植问题，花友们会来帮你
          </p>
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

        {/* Form */}
        {user ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                问题标题 *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：番茄叶子发黄是什么原因？"
                maxLength={100}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                详细描述 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="描述你遇到的具体情况：什么植物、什么症状、环境条件等..."
                rows={6}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                  提问者
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 dark:bg-[#0f1a14] dark:border-green-800/50">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-[10px] font-medium">
                    {user.username[0]}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-green-200">
                    {user.username}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                  标签
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="番茄、病害（顿号分隔）"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-green-900/30">
              <Link
                href="/community"
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 text-center dark:border-gray-600 dark:text-gray-400"
              >
                取消
              </Link>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                发布问题
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <div className="text-center py-8 rounded-xl bg-green-50/50 dark:bg-green-900/10">
              <LogIn className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                登录后即可提问题
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                登录后你的问题将关联到你的账号
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <User className="h-4 w-4" />
                登录 / 注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
