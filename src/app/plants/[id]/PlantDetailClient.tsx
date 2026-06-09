"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import CoverImage from "@/components/CoverImage";
import Link from "next/link";
import { ArrowLeft, Sun, Droplets, CalendarDays, Clock, Thermometer, Flower2, Compass, Ruler, Package } from "lucide-react";
import { plants as localPlants } from "@/data/plants";
import { categoryLabels } from "@/lib/utils";
import { loadJSON } from "@/lib/api";
import CommentSection from "@/components/CommentSection";
import { findRelatedContent, type RelatedItem } from "@/lib/relatedContent";
import RelatedContent from "@/components/RelatedContent";

/** 渲染内容：支持 HTML，兼容旧版纯文本/数组格式 */
function renderContent(content: any): string {
  if (!content) return "";
  if (Array.isArray(content)) return content.join("<br />");
  return content; // 已经是 HTML 字符串
}

const orientLabels: Record<string, string> = {
  south: "朝南 ☀️", east: "朝东 🌅", west: "朝西 🌇", north: "朝北 🌥️",
};

export default function PlantDetailClient() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<{ guides: RelatedItem[]; diaries: RelatedItem[] }>({ guides: [], diaries: [] });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // 同时从 CMS 加载植物、教程、日记
        // CMS 数据优先于本地静态数据，确保后台修改能实时生效
        const [cmsItems, cmsGuides, cmsDiaries] = await Promise.all([
          loadJSON<any>("plants").catch(() => []),
          loadJSON<any>("guides").catch(() => []),
          loadJSON<any>("diary").catch(() => []),
        ]);
        if (cancelled) return;

        // 优先用 CMS 数据，回退到本地静态数据
        const cmsPlant = cmsItems.find((p: any) => p.id === id || p.slug === id);
        const local = localPlants.find((p) => p.id === id);
        const found = cmsPlant || local;
        if (found) {
          setPlant(found);
          setRelated(findRelatedContent(found.id || id, found.name, cmsGuides, cmsDiaries));
        }
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🔍</span>
          <p className="mt-4 text-gray-500">未找到该植物</p>
          <Link href="/plants" className="mt-4 inline-block text-primary hover:underline">返回植物百科</Link>
        </div>
      </div>
    );
  }

  const hasBalconyInfo = plant.balconyFit || plant.suitableOrientations || plant.suitablePot || plant.minPotDepth || plant.minTemp;

  return (
    <div className="min-h-screen">
      {/* 顶图 */}
      <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-800/30 overflow-hidden">
        {(plant as any).image ? (
          <CoverImage src={(plant as any).image} alt={plant.name} position={(plant as any).imagePosition} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-7xl opacity-40">
              {plant.category === "vegetable" ? "🥬" : plant.category === "herb" ? "🌿" : plant.category === "succulent" ? "🌵" : plant.category === "flower" ? "🌸" : plant.category === "fruit" ? "🍓" : plant.category === "foliage" ? "🪴" : plant.category === "bulb" ? "🌷" : plant.category === "aquatic" ? "🪷" : plant.category === "mushroom" ? "🍄" : "🌱"}
            </span>
          </div>
        )}
        {/* 底部渐变遮罩 */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent dark:from-[#0f1a14]/90" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* 返回 */}
        <Link href="/plants" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> 返回植物百科
        </Link>

        {/* 标题卡片 */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
              {categoryLabels[plant.category] || plant.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {plant.difficulty === "easy" ? "🌱 新手友好" : plant.difficulty === "medium" ? "🌿 稍有挑战" : "🌳 进阶玩家"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark dark:text-green-200">{plant.name}</h1>
          <p className="mt-1 text-sm text-gray-400 italic dark:text-gray-500">{plant.scientificName}</p>
          {plant.description && <div className="mt-4 text-gray-600 leading-relaxed dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: renderContent(plant.description) }} />}
        </div>

        {/* 基础信息卡片 */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Sun, label: "光照需求", value: plant.sunlight === "full" ? "充足直射光" : plant.sunlight === "partial" ? "散射光即可" : "耐阴" },
            { icon: Droplets, label: "浇水频率", value: plant.water === "low" ? "少量" : plant.water === "medium" ? "适中" : "较多" },
            { icon: CalendarDays, label: "种植季节", value: Array.isArray(plant.season) ? plant.season.join("、") : (plant.season || "-") },
            { icon: Clock, label: plant.harvestDays > 0 ? "收获周期" : "类型", value: plant.harvestDays > 0 ? `约 ${plant.harvestDays} 天` : "观赏植物" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <item.icon className="h-5 w-5 text-primary mb-2" />
              <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
              <div className="text-sm font-medium text-gray-800 mt-0.5 dark:text-green-100">{item.value}</div>
            </div>
          ))}
        </div>

        {/* 阳台适配信息 */}
        {hasBalconyInfo && (
          <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-dark mb-5 dark:text-green-200">
              <Flower2 className="h-5 w-5" /> 阳台适配指南
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plant.balconyFit && (
                <div className="sm:col-span-2 rounded-xl bg-green-50/50 p-4 dark:bg-green-900/10">
                  <div className="text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">🏡 阳台适配</div>
                  <div className="text-sm text-gray-700 leading-relaxed dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: renderContent(plant.balconyFit) }} />
                </div>
              )}
              {plant.suitableOrientations && plant.suitableOrientations.length > 0 && (
                <div className="rounded-xl bg-sky-50/50 p-4 dark:bg-sky-900/10">
                  <Compass className="h-5 w-5 text-sky-500 mb-2" />
                  <div className="text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">适合朝向</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(plant.suitableOrientations) ? plant.suitableOrientations : []).map((o: string) => (
                      <span key={o} className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:bg-[#1a2e22] dark:text-green-200">
                        {orientLabels[o] || o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {plant.minTemp != null && (
                <div className="rounded-xl bg-amber-50/50 p-4 dark:bg-amber-900/10">
                  <Thermometer className="h-5 w-5 text-amber-500 mb-2" />
                  <div className="text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">最低耐受温度</div>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{plant.minTemp}°C</p>
                </div>
              )}
              {plant.minPotDepth && (
                <div className="rounded-xl bg-purple-50/50 p-4 dark:bg-purple-900/10">
                  <Ruler className="h-5 w-5 text-purple-500 mb-2" />
                  <div className="text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">最小盆深</div>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{plant.minPotDepth} cm</p>
                </div>
              )}
              {plant.suitablePot && (
                <div className="rounded-xl bg-teal-50/50 p-4 dark:bg-teal-900/10">
                  <Package className="h-5 w-5 text-teal-500 mb-2" />
                  <div className="text-xs font-medium text-gray-500 mb-1 dark:text-gray-400">适合花盆</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{plant.suitablePot}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 种植技巧 */}
        {plant.tips && (Array.isArray(plant.tips) ? plant.tips.length > 0 : String(plant.tips).trim()) && (
          <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <h2 className="text-lg font-semibold text-primary-dark mb-4 dark:text-green-200">💡 种植小贴士</h2>
            {Array.isArray(plant.tips) ? (
              <ul className="space-y-3">
                {plant.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary dark:bg-green-800/30 dark:text-green-300">{i + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: tip }} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: renderContent(plant.tips) }} />
            )}
          </div>
        )}

        {/* 相关种植指南和园丁日记 */}
        <RelatedContent guides={related.guides} diaries={related.diaries} />

        <CommentSection targetType="plant" targetId={id} />

        <div className="h-16" />
      </div>
    </div>
  );
}
