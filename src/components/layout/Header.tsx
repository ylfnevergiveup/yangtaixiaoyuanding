"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Leaf, Menu, X, Compass, BookOpen, CalendarDays, ShoppingCart, MessageCircle, MapPin, PenLine, User, LogOut, ChevronDown, Search } from "lucide-react";
import SearchDialog from "@/components/SearchDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { href: "/", label: "首页", icon: Leaf },
  { href: "/assessment", label: "阳台测评", icon: Compass, highlight: true },
  { href: "/plants", label: "植物百科", icon: BookOpen },
  { href: "/guide", label: "场景指南", icon: MapPin },
  { href: "/guides", label: "种植教程", icon: CalendarDays },
  { href: "/tools", label: "好物推荐", icon: ShoppingCart },
  { href: "/diary", label: "园丁日记", icon: PenLine },
  { href: "/community", label: "社区问答", icon: MessageCircle },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cmd+K / Ctrl+K 快捷键打开搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-200/50 bg-white/80 backdrop-blur-md dark:bg-[#0f1a14]/80 dark:border-green-900/30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-leaf text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary-dark dark:text-green-300 hidden sm:inline">
            阳台小园丁
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-2.5 py-2 text-sm font-medium transition-colors rounded-lg",
                link.highlight
                  ? "text-white bg-primary hover:bg-primary-dark shadow-sm"
                  : "text-gray-600 hover:text-primary hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-300 dark:hover:bg-green-900/30"
              )}
            >
              {link.highlight && <Compass className="h-3.5 w-3.5 inline mr-1" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop: Search + User section */}
        <div className="hidden lg:flex items-center gap-2 ml-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:text-primary hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            aria-label="搜索"
          >
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-green-50 dark:text-green-200 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
                  {(user.nickname || user.username)[0]}
                </div>
                <span className="max-w-[80px] truncate">{user.nickname || user.username}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-[#1a2e22] dark:ring-white/5 py-1 overflow-hidden">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    我的主页
                  </Link>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-green-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-green-50 dark:border-green-800/50 dark:text-green-300 dark:hover:bg-green-900/30 transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              登录
            </Link>
          )}
        </div>

        {/* Mobile trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-primary dark:hover:bg-green-900/30"
            aria-label="搜索"
          >
            <Search className="h-5 w-5" />
          </button>
          {/* Mobile user indicator */}
          {user ? (
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
              {(user.nickname || user.username)[0]}
            </div>
          ) : (
            <Link href="/login" className="text-gray-500 p-1">
              <User className="h-5 w-5" />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-primary lg:hidden dark:hover:bg-green-900/30"
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn("lg:hidden overflow-hidden transition-all duration-300 ease-in-out", mobileOpen ? "max-h-[40rem] border-t border-green-200/50 dark:border-green-900/30" : "max-h-0")}>
        <nav className="grid grid-cols-2 gap-1 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                link.highlight
                  ? "text-white bg-primary"
                  : "text-gray-600 hover:bg-green-50 dark:text-gray-400 dark:hover:bg-green-900/30"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          {/* Mobile auth links */}
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-green-50 dark:text-gray-400 dark:hover:bg-green-900/30"
              >
                <User className="h-4 w-4" />
                我的主页 ({user.nickname || user.username})
              </Link>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-green-50 dark:text-gray-400 dark:hover:bg-green-900/30"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/30"
            >
              <User className="h-4 w-4" />
              登录 / 注册
            </Link>
          )}
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
