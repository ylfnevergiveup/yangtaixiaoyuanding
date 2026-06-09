"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import PlantEditor from "@/components/admin/PlantEditor";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";
import { categoryLabels } from "@/lib/utils";

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlant, setEditingPlant] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchAdminData("plants");
      setPlants(data);
    } catch {
      // fallback is handled inside fetchAdminData
    }
    setLoading(false);
  };

  const handleSave = async (data: any, status: "draft" | "published") => {
    setSaveMsg("");
    setSaveError("");

    // 先更新本地状态（即时响应）
    const updated = plants.filter((p) => p.id !== data.id);
    updated.push(data);

    // 调用 CMS API 保存
    const result = await saveToCMS("plants", [data]);

    if (result.success) {
      setPlants(updated);
      if (status === "published") {
        setEditingPlant(null);
        setShowAdd(false);
      }
      setSaveMsg(status === "published" ? "✅ 发布成功！正在自动部署..." : "📝 草稿已保存");
      if (status === "published") (window as any).__triggerDeploy?.();
      setTimeout(() => setSaveMsg(""), 5000);
    } else {
      setSaveError(`❌ ${result.message}`);
      // 即使 API 失败，本地也已经更新（下次加载会重新同步）
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;

    const result = await deleteFromCMS("plants", id);
    if (result.success) {
      setPlants(plants.filter((p) => p.id !== id));
      setSaveMsg("✅ 删除成功");
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveError(`❌ ${result.message}`);
    }
  };

  // 搜索过滤
  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) return plants;
    const q = searchQuery.trim().toLowerCase();
    return plants.filter((p) => {
      if (p.name?.toLowerCase().includes(q)) return true;
      if (p.scientificName?.toLowerCase().includes(q)) return true;
      if (p.id?.toLowerCase().includes(q)) return true;
      if (p.slug?.toLowerCase().includes(q)) return true;
      if (p.category && (categoryLabels[p.category] || p.category)?.toLowerCase().includes(q)) return true;
      if (p.difficulty && (p.difficulty === "easy" ? "新手" : p.difficulty === "medium" ? "进阶" : "高手").includes(q)) return true;
      if (p.season && Array.isArray(p.season) && p.season.some((s: string) => s.includes(q))) return true;
      return false;
    });
  }, [plants, searchQuery]);

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">🌱 植物百科</h1>
          <p className="text-sm text-gray-400 mt-1">共 {plants.length} 种植物{searchQuery.trim() && `，筛选出 ${filteredPlants.length} 种`}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> 新增植物
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索植物名称、学名、分类、难度..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-green-800/50 dark:bg-[#1a2e22]/80 dark:text-green-100 dark:placeholder:text-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {saveMsg && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{saveMsg}</div>
      )}
      {saveError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{saveError}</div>
      )}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-green-900/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">分类</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">难度</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">光照</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    {searchQuery.trim() ? "没有找到匹配的植物" : "暂无植物数据"}
                  </td>
                </tr>
              ) : (
                filteredPlants.map((plant) => (
                <tr key={plant.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-green-100">
                      {plant.name}
                      {plant.status === "draft" && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">草稿</span>}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{plant.scientificName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{categoryLabels[plant.category] || plant.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{plant.difficulty === "easy" ? "🌱 新手" : plant.difficulty === "medium" ? "🌿 进阶" : plant.difficulty === "hard" ? "🌳 高手" : plant.difficulty}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{plant.sunlight === "full" ? "☀️ 全日照" : plant.sunlight === "partial" ? "🌤️ 半阴" : plant.sunlight === "shade" ? "🌥️ 耐阴" : plant.sunlight}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditingPlant(plant)} className="text-primary hover:text-primary-dark text-sm">编辑</button>
                      <button onClick={() => handleDelete(plant.id)} className="text-red-400 hover:text-red-500 text-sm">删除</button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {(editingPlant || showAdd) && (
        <PlantEditor plant={editingPlant} onSave={handleSave} onClose={() => { setEditingPlant(null); setShowAdd(false); }} />
      )}
    </AdminLayout>
  );
}
