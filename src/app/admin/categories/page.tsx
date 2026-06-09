"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X } from "lucide-react";
import { fetchAdminData, saveToCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

interface CategoryItem {
  value: string;
  label: string;
}

interface CategoryGroup {
  key: string;
  label: string;
  items: CategoryItem[];
  usedBy: string;
}

const defaultGroups: CategoryGroup[] = [
  { key: "plantCategory", label: "植物分类", usedBy: "植物百科编辑器",
    items: [
      { value: "vegetable", label: "蔬菜" }, { value: "herb", label: "香草" },
      { value: "succulent", label: "多肉" }, { value: "flower", label: "花卉" },
      { value: "fruit", label: "水果" },
    ]},
  { key: "difficulty", label: "种植难度", usedBy: "植物百科编辑器",
    items: [
      { value: "easy", label: "新手友好" }, { value: "medium", label: "稍有挑战" },
      { value: "hard", label: "进阶玩家" },
    ]},
  { key: "sunlight", label: "光照需求", usedBy: "植物百科编辑器",
    items: [
      { value: "full", label: "喜阳" }, { value: "partial", label: "半阴" },
      { value: "shade", label: "耐阴" },
    ]},
  { key: "water", label: "水分需求", usedBy: "植物百科编辑器",
    items: [
      { value: "low", label: "少水" }, { value: "medium", label: "中水" },
      { value: "high", label: "多水" },
    ]},
  { key: "guideCategory", label: "指南分类", usedBy: "种植指南编辑器",
    items: [
      { value: "beginner", label: "入门" }, { value: "seasonal", label: "时令" },
      { value: "diy", label: "DIY" }, { value: "technique", label: "技巧" },
    ]},
  { key: "diaryCategory", label: "日记分类", usedBy: "园丁日记编辑器",
    items: [
      { value: "practice", label: "实战记录" }, { value: "pitfall", label: "避坑指南" },
    ]},
  { key: "productCategory", label: "商品分类", usedBy: "商品推荐编辑器",
    items: [
      { value: "花盆", label: "花盆" }, { value: "土壤", label: "土壤" },
      { value: "工具", label: "工具" }, { value: "种子", label: "种子" },
      { value: "肥料", label: "肥料" },
    ]},
];

export default function AdminCategoriesPage() {
  const [groups, setGroups] = useState<CategoryGroup[]>(defaultGroups);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    try {
      const data = await fetchAdminData("settings");
      const catConfig = data.find((d: any) => d.id === "categories");
      if (catConfig?.groups) {
        const merged = defaultGroups.map(def => {
          const saved = (catConfig.groups as CategoryGroup[]).find((g: CategoryGroup) => g.key === def.key);
          return saved || def;
        });
        setGroups(merged);
      }
    } catch {}
    setLoading(false);
  };

  const updateItem = (groupKey: string, index: number, field: "value" | "label", val: string) => {
    setGroups(prev => prev.map(g => {
      if (g.key !== groupKey) return g;
      const newItems = [...g.items];
      newItems[index] = { ...newItems[index], [field]: val };
      return { ...g, items: newItems };
    }));
  };

  const addItem = (groupKey: string) => {
    setGroups(prev => prev.map(g => {
      if (g.key !== groupKey) return g;
      return { ...g, items: [...g.items, { value: "", label: "" }] };
    }));
  };

  const removeItem = (groupKey: string, index: number) => {
    setGroups(prev => prev.map(g => {
      if (g.key !== groupKey) return g;
      return { ...g, items: [...g.items.slice(0, index), ...g.items.slice(index + 1)] };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    setErr("");

    const cleanGroups = groups.map(g => ({
      ...g,
      items: g.items.filter(it => it.value.trim() && it.label.trim()),
    }));

    const data = {
      id: "categories",
      groups: cleanGroups,
      _updatedAt: new Date().toISOString(),
    };

    const result = await saveToCMS("settings", [data]);
    if (result.success) {
      setMsg("✅ 分类配置已保存！编辑器中会看到更新后的选项");
      setTimeout(() => setMsg(""), 4000);
    } else {
      setErr(`❌ ${result.message}`);
    }
    setSaving(false);
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">🗂 分类标签管理</h1>
          <p className="text-sm text-gray-400 mt-1">统一管理全站下拉选项，保存后编辑器即时生效</p>
        </div>
      </div>

      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.key} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-green-900/30 bg-gray-50/50 dark:bg-green-900/10">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">{group.label}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">标识: {group.key} · 用于: {group.usedBy}</p>
              </div>
              <button onClick={() => addItem(group.key)} className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 dark:bg-green-800/30 dark:text-green-300">
                <Plus className="h-3 w-3" /> 添加
              </button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-green-900/20">
              {group.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-5 py-2.5">
                  <input
                    value={item.value}
                    onChange={e => updateItem(group.key, idx, "value", e.target.value)}
                    placeholder="值 (英文)"
                    className="w-40 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100"
                  />
                  <input
                    value={item.label}
                    onChange={e => updateItem(group.key, idx, "label", e.target.value)}
                    placeholder="显示名称 (中文)"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100"
                  />
                  <button onClick={() => removeItem(group.key, idx)} className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors" title="删除">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {group.items.length === 0 && (
                <div className="px-5 py-4 text-center text-sm text-gray-400">暂无选项，点击右上角「添加」</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark disabled:opacity-50 transition-all">
        <Save className="h-4 w-4" /> {saving ? "保存中..." : "保存分类配置"}
      </button>
    </AdminLayout>
  );
}

export const dynamicCategoryConfig = defaultGroups;
