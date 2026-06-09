"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf, BookOpen, ShoppingCart, PenLine, LogOut, Rocket,
  LayoutDashboard, Image, Megaphone, Layout, Tags,
  MessageCircle, HelpCircle, Users,
} from "lucide-react";
import { setCMSApi } from "@/lib/api";
import ImageErrorHandler from "@/components/ImageErrorHandler";

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/plants", label: "植物百科", icon: Leaf },
  { href: "/admin/guides", label: "种植指南", icon: BookOpen },
  { href: "/admin/products", label: "商品推荐", icon: ShoppingCart },
  { href: "/admin/diary", label: "园丁日记", icon: PenLine },
  { href: "/admin/images", label: "图片库", icon: Image },
  { href: "/admin/announcements", label: "公告管理", icon: Megaphone },
  { href: "/admin/homepage", label: "首页配置", icon: Layout },
  { href: "/admin/categories", label: "分类标签", icon: Tags },
  { href: "/admin/comments", label: "评论管理", icon: MessageCircle },
  { href: "/admin/qa", label: "问答管理", icon: HelpCircle },
  { href: "/admin/users", label: "用户管理", icon: Users },
];

interface Props {
  children: React.ReactNode;
}

const DEPLOY_DAEMON = "http://127.0.0.1:3456";

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const [deploying, setDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState("");

  const triggerDeploy = useCallback(async () => {
    setDeploying(true);
    setDeployMsg("部署中...");
    try {
      const res = await fetch(`${DEPLOY_DAEMON}/deploy`, { method: "POST" });
      const json = await res.json();
      if (json.status === "started" || json.status === "already_running") {
        setDeployMsg("🚀 部署已触发，约2分钟后生效");
        setTimeout(() => { setDeploying(false); setDeployMsg(""); }, 5000);
      } else {
        setDeployMsg("⚠️ 守护进程未启动，请运行 npm run daemon");
        setDeploying(false);
      }
    } catch {
      setDeployMsg("⚠️ 守护进程未启动，请在终端运行: npm run daemon");
      setDeploying(false);
    }
  }, []);

  // Expose triggerDeploy globally so admin pages can call it after saving
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__triggerDeploy = triggerDeploy;
    }
  }, [triggerDeploy]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!document.cookie.includes("admin_token=authenticated")) {
      window.location.href = "/admin/login";
      return;
    }

    // 从 cookie 恢复 CMS API 地址到全局变量
    const apiMatch = document.cookie.match(/cms_api=([^;]+)/);
    if (apiMatch) {
      setCMSApi(decodeURIComponent(apiMatch[1]));
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_token=;max-age=0;path=/";
    document.cookie = "cms_password=;max-age=0;path=/";
    document.cookie = "cms_api=;max-age=0;path=/";
    window.location.href = "/admin/login";
  };

  // 判断当前激活的导航项
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1a14]">
      <ImageErrorHandler />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-[#1a2e22] dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-primary">
              ← 返回网站
            </Link>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-primary-dark dark:text-green-200">
              后台管理
            </span>
          </div>
          <div className="flex items-center gap-3">
            {deployMsg && (
              <span className={`text-xs ${deployMsg.startsWith("🚀") ? "text-green-600" : "text-amber-600"}`}>{deployMsg}</span>
            )}
            <button
              onClick={triggerDeploy}
              disabled={deploying}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                deploying
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-accent/10 text-accent hover:bg-accent/20"
              }`}
            >
              <Rocket className={`h-4 w-4 ${deploying ? "animate-pulse" : ""}`} />
              {deploying ? "部署中..." : "部署"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" /> 退出
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="hidden md:flex flex-col gap-1 w-48 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-green-900/30"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** 管理员页面：加载中状态 */
export function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1a14]">
      <span className="text-4xl animate-pulse">⏳</span>
    </div>
  );
}
