"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save, Eye, EyeOff, ChevronUp, ChevronDown, RotateCcw,
} from "lucide-react";
import { fetchAdminData, saveToCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

interface Section {
  key: string;
  title: string;
  visible: boolean;
  order: number;
}

const defaultSections: Section[] = [
  { key: "hero", title: "主横幅 (Hero)", visible: true, order: 1 },
  { key: "nav", title: "功能导航", visible: true, order: 2 },
  { key: "featuredPlants", title: "推荐植物", visible: true, order: 3 },
  { key: "diaryPreview", title: "园丁日记预览", visible: true, order: 4 },
  { key: "guidePreview", title: "种植指南预览", visible: true, order: 5 },
  { key: "qaPreview", title: "热门问答", visible: true, order: 6 },
  { key: "cta", title: "底部号召 (CTA)", visible: true, order: 7 },
];

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    try {
      const data = await fetchAdminData("homepage");
      if (data && data.length > 0 && data[0].sections) {
        const saved = data[0].sections as Section[];
        const merged = defaultSections.map(def => {
          const found = saved.find((s: Section) => s.key === def.key);
          return found ? { ...def, visible: found.visible, order: found.order } : def;
        });
        merged.sort((a, b) => a.order - b.order);
        setSections(merged);
      }
    } catch {}
    setLoading(false);
  };

  const handleToggle = (key: string) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, visible: !s.visible } : s));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    setSections(prev => {
      const updated = prev.map((s, i) => {
        if (i === index) return { ...s, order: s.order + direction };
        if (i === newIndex) return { ...s, order: s.order - direction };
        return s;
      });
      return [...updated].sort((a, b) => a.order - b.order);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    setErr("");

    const data = {
      id: "homepage-config",
      sections: sections.map((s, i) => ({ ...s, order: i + 1 })),
      _updatedAt: new Date().toISOString(),
    };

    const result = await saveToCMS("homepage", [data]);
    if (result.success) {
      setMsg("✅ 首页配置已保存！刷新网站首页即可看到效果");
      setTimeout(() => setMsg(""), 4000);
    } else {
      setErr(`❌ ${result.message}`);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setSections(defaultSections);
  };

  if (loading) return <AdminLoading />;

  const visibleCount = sections.filter(s => s.visible).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">🏠 首页板块配置</h1>
          <p className="text-sm text-gray-400 mt-1">当前显示 {visibleCount}/{sections.length} 个板块</p>
        </div>
      </div>

      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-green-900/30 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">板块列表</span>
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <RotateCcw className="h-3 w-3" /> 恢复默认
          </button>
        </div>

        {sections.map((section, index) => (
          <div
            key={section.key}
            className={`flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 dark:border-green-900/20 last:border-0 transition-colors ${
              section.visible ? "" : "opacity-50 bg-gray-50/50 dark:bg-gray-900/10"
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="text-gray-300 hover:text-gray-500 disabled:opacity-20 dark:text-gray-600 dark:hover:text-gray-400"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMove(index, 1)}
                disabled={index === sections.length - 1}
                className="text-gray-300 hover:text-gray-500 disabled:opacity-20 dark:text-gray-600 dark:hover:text-gray-400"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-green-100">{section.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">标识: {section.key}</p>
            </div>

            <button
              onClick={() => handleToggle(section.key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                section.visible
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500"
              }`}
            >
              {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {section.visible ? "显示" : "隐藏"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark disabled:opacity-50 transition-all"
        >
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "保存配置"}
        </button>
        <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
          预览首页 →
        </Link>
      </div>
    </AdminLayout>
  );
}
