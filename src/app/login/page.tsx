"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, User, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login, register } = useAuth();
  const initialTab = (searchParams.get("tab") as "login" | "register") || "login";
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // 已登录则跳转
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!username.trim()) {
      setErr("请填写用户名");
      return;
    }
    if (!password) {
      setErr("请填写密码");
      return;
    }
    if (username.trim().length < 2) {
      setErr("用户名至少2个字符");
      return;
    }
    if (password.length < 6) {
      setErr("密码至少6位");
      return;
    }

    if (tab === "register") {
      if (password !== confirmPassword) {
        setErr("两次密码不一致");
        return;
      }
    }

    setLoading(true);

    if (tab === "login") {
      const result = await login(username.trim(), password);
      if (result.success) {
        router.push("/");
      } else {
        setErr(result.message);
      }
    } else {
      const result = await register(username.trim(), password);
      if (result.success) {
        setMsg("注册成功！请登录");
        setTab("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErr(result.message);
      }
    }
    setLoading(false);
  };

  // Auth loading or already logged in
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-leaf text-white shadow-lg">
              <Leaf className="h-6 w-6" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-primary-dark dark:text-green-200">
            阳台小园丁
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            登录后参与留言和社区讨论
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl bg-white p-1 ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          <button
            type="button"
            onClick={() => { setTab("login"); setErr(""); setMsg(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              tab === "login"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setErr(""); setMsg(""); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              tab === "register"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            注册
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5 space-y-4"
        >
          {err && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {err}
            </div>
          )}
          {msg && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
              {msg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1.5">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="2-20个字符"
                maxLength={20}
                className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1.5">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
                className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1.5">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {tab === "login" ? "登录" : "注册"}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
