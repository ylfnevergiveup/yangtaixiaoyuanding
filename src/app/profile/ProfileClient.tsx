"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Edit3,
  Save,
  Loader2,
  MessageCircle,
  MessageSquare,
  Calendar,
  Eye,
  LogIn,
  X,
} from "lucide-react";
import { loadJSON } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { updateProfile } from "@/lib/api";
import { Question } from "@/data/questions";
import { cn } from "@/lib/utils";

interface CommentData {
  id: string;
  targetType: string;
  targetId: string;
  author: string;
  content: string;
  date: string;
  status: string;
}

interface UserInfo {
  username: string;
  nickname: string;
  bio: string;
  createdAt: string;
}

function ProfileInner() {
  const searchParams = useSearchParams();
  const targetUser = searchParams.get("user") || "";
  const { user, updateUser } = useAuth();
  const isOwnProfile = !targetUser || targetUser === user?.username;

  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<UserInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeTab, setActiveTab] = useState<"questions" | "comments">("questions");
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 加载目标用户信息
      if (targetUser) {
        // 如果是当前登录用户自己，直接使用 context 数据
        if (targetUser === user?.username && user) {
          setProfileUser({
            username: user.username,
            nickname: user.nickname,
            bio: user.bio,
            createdAt: user.createdAt,
          });
        } else {
          // 尝试从 users 集合加载该用户
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcloudbaseapp.com/v2/api/cms"}/users`
            );
            const json = await response.json();
            if (json.code === 0 && json.data) {
              const found = json.data.find(
                (u: { username: string; nickname?: string; bio?: string; createdAt?: string }) => u.username === targetUser
              );
              if (found) {
                setProfileUser({
                  username: found.username,
                  nickname: found.nickname || found.username,
                  bio: found.bio || "",
                  createdAt: found.createdAt || "",
                });
              }
            }
          } catch {
            // 如果加载失败，设为 null（显示不存在状态）
          }
        }
      } else if (user) {
        // 自己的主页
        setProfileUser({
          username: user.username,
          nickname: user.nickname,
          bio: user.bio,
          createdAt: user.createdAt,
        });
      }

      // 加载内容数据
      const searchAuthor = targetUser || user?.username || "";
      if (searchAuthor) {
        try {
          const [qaItems, commentItems] = await Promise.all([
            loadJSON<Question>("qa"),
            loadJSON<CommentData>("comments"),
          ]);
          setQuestions(
            qaItems.filter(
              (q) => q.author === searchAuthor && q.status !== "draft"
            )
          );
          setComments(
            commentItems.filter(
              (c) => c.author === searchAuthor && c.status !== "draft"
            )
          );
        } catch {
          // 静默失败
        }
      }

      setLoading(false);
    }
    load();
  }, [targetUser, user]);

  const handleEdit = useCallback(() => {
    if (!profileUser) return;
    setEditNickname(profileUser.nickname);
    setEditBio(profileUser.bio);
    setEditing(true);
    setMsg("");
    setErr("");
  }, [profileUser]);

  const handleSave = useCallback(async () => {
    if (!editNickname.trim()) {
      setErr("昵称不能为空");
      return;
    }
    setErr("");
    setSaving(true);
    const result = await updateProfile({
      nickname: editNickname.trim(),
      bio: editBio.trim(),
    });
    if (result.success) {
      updateUser({ nickname: editNickname.trim(), bio: editBio.trim() });
      setProfileUser((prev) =>
        prev
          ? { ...prev, nickname: editNickname.trim(), bio: editBio.trim() }
          : null
      );
      setMsg("✅ 资料已更新");
      setEditing(false);
    } else {
      setErr(`❌ ${result.message}`);
    }
    setSaving(false);
  }, [editNickname, editBio, updateUser]);

  const targetTypeLabel = (type: string) => {
    switch (type) {
      case "plant":
        return "植物";
      case "guide":
        return "指南";
      case "diary":
        return "日记";
      default:
        return type;
    }
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

  // Not logged in + no target user
  if (!profileUser && !targetUser && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <div className="text-center py-8">
              <LogIn className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                查看个人主页
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                登录后即可查看和管理你的个人主页
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
        </div>
      </div>
    );
  }

  // User not found
  if (!profileUser && targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Link>
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5 text-center">
            <span className="text-5xl">🔍</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              用户不存在
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              该用户可能尚未注册，或使用了不同的用户名
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={targetUser && targetUser !== user?.username ? "/community" : "/"}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {targetUser && targetUser !== user?.username ? "返回社区" : "返回首页"}
        </Link>

        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-light to-leaf flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {(profileUser.nickname || profileUser.username)[0]}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-green-100">
                  {profileUser.nickname}
                </h1>
                {isOwnProfile && !editing && (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-green-900/20"
                  >
                    <Edit3 className="h-3 w-3" />
                    编辑资料
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-0.5">
                @{profileUser.username}
              </p>
              {profileUser.bio && !editing && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {profileUser.bio}
                </p>
              )}
              {profileUser.createdAt && (
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="h-3 w-3" />
                  注册于 {new Date(profileUser.createdAt).toLocaleDateString("zh-CN")}
                </p>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-green-900/30">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                    昵称
                  </label>
                  <input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    maxLength={30}
                    placeholder="你的昵称"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                    个人签名
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={200}
                    rows={3}
                    placeholder="写一句话介绍自己..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-400 text-right">
                    {editBio.length}/200
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setErr("");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
                  >
                    <X className="h-4 w-4" />
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="mt-6">
          <div className="flex border-b border-gray-200 dark:border-green-900/30">
            <button
              onClick={() => setActiveTab("questions")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "questions"
                  ? "border-primary text-primary dark:border-green-400 dark:text-green-300"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-green-300"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              提问 ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "comments"
                  ? "border-primary text-primary dark:border-green-400 dark:text-green-300"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-green-300"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              留言 ({comments.length})
            </button>
          </div>

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <div className="mt-4 space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-8 rounded-xl bg-white ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    暂无提问
                  </p>
                </div>
              ) : (
                questions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/community/question?id=${q.id}`}
                    className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all dark:bg-[#1a2e22]/80 dark:ring-white/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100 truncate">
                          {q.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {q.content}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                          q.isResolved
                            ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300"
                        )}
                      >
                        {q.isResolved ? "已解决" : "待回答"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {q.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {Array.isArray(q.answers)
                          ? q.answers.filter((a) => a.status !== "draft").length
                          : 0}
                      </span>
                      <span>{q.date}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="mt-4 space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-8 rounded-xl bg-white ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    暂无留言
                  </p>
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300">
                        {targetTypeLabel(c.targetType)}
                      </span>
                      <span className="text-xs text-gray-400">{c.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  return <ProfileInner />;
}
