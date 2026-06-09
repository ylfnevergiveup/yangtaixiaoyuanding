"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Leaf, BookOpen, ShoppingCart, PenLine, Plus,
  Clock, ArrowRight, Download, Upload,
} from "lucide-react";
import { fetchAdminData, getCMSApiUrl, saveToCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

interface StatCard {
  label: string;
  count: number;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullData, setFullData] = useState<Record<string, any[]>>({});
  const [ioMsg, setIoMsg] = useState("");
  const [ioError, setIoError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [plants, guides, diary, products] = await Promise.all([
        fetchAdminData("plants").catch(() => []),
        fetchAdminData("guides").catch(() => []),
        fetchAdminData("diary").catch(() => []),
        fetchAdminData("products").catch(() => []),
      ]);

      setStats([
        { label: "植物百科", count: plants.length, icon: Leaf, href: "/admin/plants", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        { label: "种植指南", count: guides.length, icon: BookOpen, href: "/admin/guides", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { label: "园丁日记", count: diary.length, icon: PenLine, href: "/admin/diary", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { label: "商品推荐", count: products.length, icon: ShoppingCart, href: "/admin/products", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
      ]);

      // 收集最近更新的内容（取各类型最新2条）
      type RecentItem = { type: string; typeLabel: string; icon: string; title: string; id: string; date: string; href: string };
      const allRecent: RecentItem[] = [
        ...plants.slice(0, 2).map((p: any) => ({ type: "plants", typeLabel: "植物", icon: "🌱", title: p.name, id: p.id, date: p._updatedAt || p.date || "", href: `/admin/plants` })),
        ...guides.slice(0, 2).map((g: any) => ({ type: "guides", typeLabel: "指南", icon: "📖", title: g.title, id: g.id, date: g._updatedAt || g.date || "", href: `/admin/guides` })),
        ...diary.slice(0, 2).map((d: any) => ({ type: "diary", typeLabel: "日记", icon: "📝", title: d.title, id: d.id, date: d._updatedAt || d.date || "", href: `/admin/diary` })),
        ...products.slice(0, 2).map((p: any) => ({ type: "products", typeLabel: "商品", icon: "🛒", title: p.name, id: p.id, date: p._updatedAt || p.date || "", href: `/admin/products` })),
      ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

      setRecentItems(allRecent);
      setFullData({ plants, guides, diary, products });

      // 加载访问统计
      try {
        const apiBase = getCMSApiUrl();
        if (apiBase) {
          const res = await fetch(`${apiBase}/analytics`);
          const json = await res.json();
          if (json.code === 0 && json.data) setAnalytics(json.data);
        }
      } catch {}
    } catch {}
    setLoading(false);
  };

  const handleExport = () => {
    setIoMsg("");
    setIoError("");

    try {
      const exportData: Record<string, any[]> = {};
      let totalExported = 0;
      const collections = ["plants", "guides", "diary", "products"];

      for (const col of collections) {
        const items = fullData[col] || [];
        // 去掉内部字段
        exportData[col] = items.map(({ _id, _updatedAt, _createdAt, _openid, ...rest }: any) => rest);
        totalExported += exportData[col].length;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const now = new Date().toISOString().slice(0, 10);
      a.download = `yangtaixiaoyuanding-backup-${now}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setIoMsg(`✅ 导出成功！${totalExported} 条数据已保存为 JSON 文件`);
      setTimeout(() => setIoMsg(""), 5000);
    } catch (err: any) {
      setIoError(`导出失败: ${err.message}`);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult("");
    setIoError("");

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // 校验格式
      const collections = ["plants", "guides", "diary", "products"];
      let totalImported = 0;
      let totalFailed = 0;

      for (const col of collections) {
        if (data[col] && Array.isArray(data[col]) && data[col].length > 0) {
          const records = data[col].slice(0, 100); // 每集合上限100条
          const result = await saveToCMS(col, records);
          if (result.success) {
            totalImported += records.length;
          } else {
            totalFailed += records.length;
          }
        }
      }

      setImportResult(`✅ 导入完成：${totalImported} 条成功${totalFailed > 0 ? `，${totalFailed} 条失败` : ""}。页面将刷新...`);
      setTimeout(() => {
        setImportResult("");
        loadDashboard();
      }, 2000);
    } catch (err: any) {
      setIoError(`导入失败：${err.message || "JSON 格式错误"}`);
    }

    setImporting(false);
    // 重置 file input
    e.target.value = "";
  };

  const totalCount = stats.reduce((sum, s) => sum + s.count, 0);

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">📊 管理仪表盘</h1>
        <p className="text-sm text-gray-400 mt-1">
          共管理 <span className="font-semibold text-primary">{totalCount}</span> 条内容
        </p>
      </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Link
                  key={stat.href}
                  href={stat.href}
                  className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
                </Link>
              ))}
            </div>

            {/* Analytics */}
            {analytics && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400">📈 网站流量</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <div className="text-2xl font-bold text-primary">{(analytics.totalPV || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">总访问量 (PV)</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <div className="text-2xl font-bold text-blue-600">{(analytics.totalUV || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">独立访客 (UV)</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <div className="text-2xl font-bold text-amber-600">
                      {(() => { const today = new Date().toISOString().slice(0, 10); return ((analytics.daily || {})[today] || 0).toLocaleString(); })()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">今日访问</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <div className="text-2xl font-bold text-green-600">{Object.keys(analytics.pages || {}).length}</div>
                    <div className="text-xs text-gray-500 mt-1">被访问页面数</div>
                  </div>
                </div>
                {/* Top Pages */}
                {analytics.pages && Object.keys(analytics.pages).length > 0 && (
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <p className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">🔥 热门页面 Top 8</p>
                    <div className="space-y-1">
                      {Object.entries(analytics.pages as Record<string, number>)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([path, count]) => (
                          <div key={path} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 truncate dark:text-gray-400">{path}</span>
                            <span className="text-gray-900 font-medium ml-2 flex-shrink-0 dark:text-green-100">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400">⚡ 快捷操作</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/plants" className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40">
                  <Plus className="h-4 w-4" /> 新增植物
                </Link>
                <Link href="/admin/guides" className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40">
                  <Plus className="h-4 w-4" /> 写种植指南
                </Link>
                <Link href="/admin/diary" className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40">
                  <Plus className="h-4 w-4" /> 写园丁日记
                </Link>
                <Link href="/admin/products" className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40">
                  <Plus className="h-4 w-4" /> 添加商品
                </Link>
                <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                  👀 预览网站
                </Link>
              </div>
            </div>

            {/* Data Backup */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400">💾 数据备份</h2>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-black/5 hover:bg-gray-50 transition-colors dark:bg-[#1a2e22]/80 dark:text-green-200 dark:ring-white/5 dark:hover:bg-green-900/30"
                >
                  <Download className="h-4 w-4" /> 导出全部数据
                </button>
                <label className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-black/5 transition-colors cursor-pointer ${importing ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#1a2e22]/80 dark:text-green-200 dark:ring-white/5 dark:hover:bg-green-900/30"}`}>
                  <Upload className="h-4 w-4" />
                  {importing ? "导入中..." : "从备份恢复"}
                  <input type="file" accept=".json" onChange={handleImport} disabled={importing} className="hidden" />
                </label>
              </div>
              {ioMsg && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{ioMsg}</p>}
              {importResult && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{importResult}</p>}
              {ioError && <p className="mt-3 text-sm text-red-500">{ioError}</p>}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                导出整个网站数据为一个 JSON 文件，备份或迁移时使用。恢复功能支持上传之前导出的备份文件。
              </p>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-4 w-4" /> 最近内容
              </h2>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
                {recentItems.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-gray-400">
                    <span className="text-4xl block mb-2">📭</span>
                    暂无内容
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-green-900/20">
                    {recentItems.map((item, i) => (
                      <Link
                        key={`${item.type}-${item.id}-${i}`}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors dark:hover:bg-green-900/10"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate dark:text-green-100">{item.title}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {item.typeLabel}
                            {item.date && <> · {new Date(item.date).toLocaleDateString("zh-CN")}</>}
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 flex items-center gap-1 dark:text-gray-600">
                          查看 <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
    </AdminLayout>
  );
}
