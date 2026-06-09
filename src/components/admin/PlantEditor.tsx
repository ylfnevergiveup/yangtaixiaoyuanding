"use client";

import { useState, useRef } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import RichTextEditor, { contentToHtml } from "@/components/admin/RichTextEditor";
import { useCategories } from "@/lib/useCategories";
import { slugify } from "@/lib/utils";

interface PlantForm {
  id: string;
  image: string;
  imagePosition: string;
  name: string;
  scientificName: string;
  category: string;
  difficulty: string;
  season: string;
  sunlight: string;
  water: string;
  harvestDays: number;
  description: string;
  tips: string;
  balconyFit: string;
  suitableOrientations: string;
  minPotDepth: number;
  suitablePot: string;
  minTemp: number;
  status: string;
  featured: boolean;
}

interface Props {
  plant?: any;
  onSave: (data: any, status: "draft" | "published") => void;
  onClose: () => void;
  markDirty?: () => void;
}

const emptyForm: PlantForm = {
  id: "",
  image: "",
  imagePosition: "50% 50%",
  name: "",
  scientificName: "",
  category: "vegetable",
  difficulty: "easy",
  season: "春、夏",
  sunlight: "full",
  water: "medium",
  harvestDays: 30,
  description: "",
  tips: "",
  balconyFit: "",
  suitableOrientations: "south",
  minPotDepth: 15,
  suitablePot: "",
  minTemp: 10,
  status: "published",
  featured: false,
};

export default function PlantEditor({ plant, onSave, onClose, markDirty }: Props) {
  const cats = useCategories();
  const [form, setForm] = useState<PlantForm>(() => {
    if (!plant) return emptyForm;
    return {
      id: plant.id || "",
      image: plant.image || "",
      imagePosition: plant.imagePosition || "50% 50%",
      name: plant.name || "",
      scientificName: plant.scientificName || "",
      category: plant.category || "vegetable",
      difficulty: plant.difficulty || "easy",
      season: Array.isArray(plant.season) ? plant.season.join("、") : (plant.season || ""),
      sunlight: plant.sunlight || "full",
      water: plant.water || "medium",
      harvestDays: plant.harvestDays || 30,
      description: contentToHtml(plant.description),
      tips: contentToHtml(plant.tips),
      balconyFit: contentToHtml(plant.balconyFit),
      suitableOrientations: Array.isArray(plant.suitableOrientations) ? plant.suitableOrientations.join(",") : (plant.suitableOrientations || ""),
      minPotDepth: plant.minPotDepth || 15,
      suitablePot: plant.suitablePot || "",
      minTemp: plant.minTemp || 10,
      status: plant.status || "published",
      featured: plant.featured || false,
    };
  });

  const handleSubmit = (status: "draft" | "published") => {
    const data = {
      id: form.id || slugify(form.name) || form.name.toLowerCase().replace(/\s+/g, "-"),
      image: form.image || undefined,
      imagePosition: form.imagePosition,
      name: form.name,
      scientificName: form.scientificName,
      category: form.category,
      difficulty: form.difficulty,
      season: form.season.split(/[、,，]/).map((s) => s.trim()).filter(Boolean),
      sunlight: form.sunlight,
      water: form.water,
      harvestDays: Number(form.harvestDays),
      description: form.description,
      tips: form.tips,
      balconyFit: form.balconyFit,
      suitableOrientations: form.suitableOrientations.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      minPotDepth: Number(form.minPotDepth),
      suitablePot: form.suitablePot,
      minTemp: Number(form.minTemp),
      status: status || "published",
      featured: form.featured,
    };
    onSave(data, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10">
      <div className="w-full max-w-4xl mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-primary-dark dark:text-green-200">
              {plant ? "编辑植物" : "新增植物"}
            </h2>
            {form.status === "draft" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">📝 草稿</span>}
            {form.status === "published" && plant && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">✅ 已发布</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {/* 图片上传 */}
          <ImageUpload value={form.image} onChange={(url) => { setForm({ ...form, image: url }); markDirty?.(); }} label="植物图片" />
          {form.image && (
            <FocalPointPicker
              value={form.imagePosition}
              onChange={(pos) => { setForm({ ...form, imagePosition: pos }); markDirty?.(); }}
            />
          )}

          {/* 名称 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">名称 *</label>
              <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">学名</label>
              <input value={form.scientificName} onChange={(e) => { setForm({ ...form, scientificName: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
            </div>
          </div>

          {/* 分类和难度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">分类</label>
              <select value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                {cats.plantCategory.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">难度</label>
              <select value={form.difficulty} onChange={(e) => { setForm({ ...form, difficulty: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                {cats.difficulty.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* 光照、水分、收获天数 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">光照</label>
              <select value={form.sunlight} onChange={(e) => { setForm({ ...form, sunlight: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                {cats.sunlight.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">水分</label>
              <select value={form.water} onChange={(e) => { setForm({ ...form, water: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                {cats.water.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">收获天数</label>
              <input type="number" value={form.harvestDays} onChange={(e) => { setForm({ ...form, harvestDays: Number(e.target.value) }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
            </div>
          </div>

          {/* 阳台环境 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">种植季节（用顿号分隔）</label>
            <input value={form.season} onChange={(e) => { setForm({ ...form, season: e.target.value }); markDirty?.(); }} placeholder="春、夏、秋" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">适合朝向（用逗号分隔）</label>
            <input value={form.suitableOrientations} onChange={(e) => { setForm({ ...form, suitableOrientations: e.target.value }); markDirty?.(); }} placeholder="south,east,west,north" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">最小盆深(cm)</label>
              <input type="number" value={form.minPotDepth} onChange={(e) => { setForm({ ...form, minPotDepth: Number(e.target.value) }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">最低温度(°C)</label>
              <input type="number" value={form.minTemp} onChange={(e) => { setForm({ ...form, minTemp: Number(e.target.value) }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">适合花盆</label>
            <input value={form.suitablePot} onChange={(e) => { setForm({ ...form, suitablePot: e.target.value }); markDirty?.(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
          </div>

          {/* 描述 - 富文本 */}
          <RichTextEditor value={form.description} onChange={(val) => { setForm({ ...form, description: val }); markDirty?.(); }} label="描述" />

          {/* 阳台适配 - 富文本 */}
          <RichTextEditor value={form.balconyFit} onChange={(val) => { setForm({ ...form, balconyFit: val }); markDirty?.(); }} label="阳台适配描述" />

          {/* 种植技巧 - 富文本 */}
          <RichTextEditor value={form.tips} onChange={(val) => { setForm({ ...form, tips: val }); markDirty?.(); }} label="种植技巧" />

          {/* 推荐 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => { setForm({ ...form, featured: e.target.checked }); markDirty?.(); }} className="rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700 dark:text-green-200">推荐到首页</span>
          </label>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-green-900/30">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">
            取消
          </button>
          <button onClick={() => handleSubmit("draft")} className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">📝 保存草稿</button>
          <button onClick={() => handleSubmit("published")} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">✅ 发布</button>
        </div>
      </div>
    </div>
  );
}
