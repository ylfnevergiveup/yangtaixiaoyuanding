"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Clock, Droplets, Compass, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { balconyTypes, cities, getProvinces, getCitiesByProvince } from "@/data/plants";
import { plants } from "@/data/plants";
import { cn } from "@/lib/utils";

type TabType = "orientation" | "city";

const PROVINCES = getProvinces();
const ITEMS_PER_PAGE = 12;

export default function GuidePage() {
  const [tab, setTab] = useState<TabType>("orientation");
  const [selectedProvince, setSelectedProvince] = useState<string>("全部");
  const [page, setPage] = useState(0);

  const provinceCities = selectedProvince === "全部" ? cities : getCitiesByProvince(selectedProvince);
  const totalPages = Math.ceil(provinceCities.length / ITEMS_PER_PAGE);
  const pagedCities = provinceCities.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              🗺️ 场景化种植指南
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              根据你的阳台环境和所在城市，找到最适合的种植方案
            </p>
          </div>
          {/* Tab切换 */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-green-200/50 dark:bg-[#1a2e22]/80 dark:ring-green-800/50">
              <button onClick={() => setTab("orientation")} className={cn("rounded-full px-6 py-2 text-sm font-medium transition-all", tab === "orientation" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400")}>
                <Compass className="h-4 w-4 inline mr-1" />
                按阳台朝向
              </button>
              <button onClick={() => setTab("city")} className={cn("rounded-full px-6 py-2 text-sm font-medium transition-all", tab === "city" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400")}>
                <MapPin className="h-4 w-4 inline mr-1" />
                按所在城市
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 按阳台朝向 */}
          {tab === "orientation" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {balconyTypes.map((type) => {
                const suitable = plants.filter((p) =>
                  p.suitableOrientations.includes(type.id as any) || (type.isSpecial && p.suitableOrientations.length > 0)
                ).slice(0, 4);
                return (
                  <div key={type.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{type.emoji}</span>
                      <div>
                        <h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{type.name}</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{type.light}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{type.desc}</p>
                    {type.caution && (
                      <div className="bg-amber-50 rounded-xl p-3 mb-4 dark:bg-amber-900/10">
                        <p className="text-xs text-amber-700 dark:text-amber-300">⚠️ {type.caution}</p>
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-700 dark:text-green-200 mb-2">推荐植物：</p>
                    <div className="space-y-2">
                      {suitable.map((p) => (
                        <Link key={p.id} href={`/plants/${p.id}`} className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm hover:bg-green-100 transition-colors dark:bg-green-900/10 dark:hover:bg-green-900/20">
                          <span className="text-gray-800 dark:text-green-100">{p.name}</span>
                          <span className={cn(
                            "text-xs rounded-full px-2 py-0.5",
                            p.difficulty === "easy" ? "text-green-600" :
                            p.difficulty === "medium" ? "text-amber-600" : "text-red-600"
                          )}>
                            {p.difficulty === "easy" ? "🌱 新手" : p.difficulty === "medium" ? "🌿 进阶" : "🌳 高手"}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/assessment" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark dark:text-green-300">
                      去测评你的阳台 →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* 按城市 */}
          {tab === "city" && (
            <div>
              {/* 省份筛选 */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedProvince("全部"); setPage(0); }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                    selectedProvince === "全部"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-500 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50"
                  )}
                >
                  全部 ({cities.length})
                </button>
                {PROVINCES.map((prov) => {
                  const count = getCitiesByProvince(prov).length;
                  return (
                    <button
                      key={prov}
                      onClick={() => { setSelectedProvince(prov); setPage(0); }}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                        selectedProvince === prov
                          ? "bg-primary text-white"
                          : "bg-white text-gray-500 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50"
                      )}
                    >
                      {prov} ({count})
                    </button>
                  );
                })}
              </div>

              {/* 城市卡片 */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pagedCities.map((city) => {
                  const recPlants = city.recommendedPlantIds.map((id) => plants.find((p) => p.id === id)).filter(Boolean) as typeof plants;
                  return (
                    <div key={city.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{city.name}</h2>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{city.province}</p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
                          {city.zone === "north" ? "北方" : city.zone === "south" ? "南方" : city.zone === "central" ? "中部" : city.zone === "northeast" ? "东北" : "西南"}
                        </span>
                      </div>
                      <div className="flex gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>🌡️ 年均温 {city.avgTemp}°C</span>
                        <span>❄️ 最低 {city.minWinterTemp}°C</span>
                        <span>☀️ 最高 {city.maxSummerTemp}°C</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{city.feature}</p>
                      <div className="bg-green-50 rounded-xl p-3 mb-4 dark:bg-green-900/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong className="text-primary dark:text-green-300">建议：</strong>{city.advice}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-green-200 mb-2">推荐种植：</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recPlants.map((p) => (
                          <Link key={p.id} href={`/plants/${p.id}`} className="rounded-full bg-green-50 px-3 py-1 text-xs text-primary hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300">{p.name}</Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-600 dark:text-gray-400"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-600 dark:text-gray-400"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
