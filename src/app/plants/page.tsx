"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sun, Droplets, CalendarDays } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { plants as localPlants, categories, difficulties } from "@/data/plants";
import { categoryLabels, cn } from "@/lib/utils";
import { loadJSON } from "@/lib/api";

export default function PlantsPage() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [search, setSearch] = useState("");
  const [plants, setPlants] = useState(localPlants);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJSON<any>("plants").then((items) => {
      if (items.length > 0) setPlants(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = plants.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (difficulty !== "all" && p.difficulty !== difficulty) return false;
    if (search && !p.name.includes(search) && !p.description.includes(search))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              🌱 植物百科
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              探索适合阳台种植的各类植物
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="搜索植物名称..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-green-200/60 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-[#1a2e22]/80 dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    category === cat.value ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30"
                  )}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="w-full text-center">
              <div className="inline-flex rounded-full bg-white p-0.5 ring-1 ring-green-200/50 dark:bg-[#1a2e22]/80 dark:ring-green-800/50">
                {difficulties.map((d) => (
                  <button key={d.value} onClick={() => setDifficulty(d.value)}
                    className={cn("rounded-full px-4 py-1 text-xs font-medium transition-all",
                      difficulty === d.value ? "bg-leaf text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            共找到 {filtered.length} 种植物
          </div>
          {loading ? (
            <div className="text-center py-20"><span className="text-4xl">⏳</span><p className="mt-4 text-gray-500">加载中...</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><span className="text-6xl">🔍</span><p className="mt-4 text-gray-500 dark:text-gray-400">没有找到匹配的植物</p></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((plant: any) => (
                <Link key={plant.id} href={`/plants/${plant.id}`}
                  className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                  <div className="relative -mx-5 -mt-5 mb-4 h-32 overflow-hidden rounded-t-2xl bg-gradient-to-br from-green-100/80 via-emerald-50 to-green-200/60 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-800/30 flex items-center justify-center">
                    {(plant as any).image ? (
                      <CoverImage src={(plant as any).image} alt={plant.name} position={(plant as any).imagePosition} />
                    ) : (
                      <span className="text-5xl opacity-60 select-none">
                        {plant.category === "vegetable" ? "🥬" : plant.category === "herb" ? "🌿" : plant.category === "succulent" ? "🌵" : plant.category === "flower" ? "🌸" : "🍓"}
                      </span>
                    )}
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
                      {categoryLabels[plant.category] || plant.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {plant.difficulty === "easy" ? "🌱 新手" : plant.difficulty === "medium" ? "🌿 进阶" : "🌳 高手"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary transition-colors">{plant.name}</h3>
                  <p className="mt-1 text-xs text-gray-400 italic dark:text-gray-500">{plant.scientificName}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{plant.description?.replace(/<[^>]*>/g, "")}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <Sun className="h-3 w-3" />{plant.sunlight === "full" ? "喜阳" : plant.sunlight === "partial" ? "半阴" : "耐阴"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      <Droplets className="h-3 w-3" />{plant.water === "low" ? "少水" : plant.water === "medium" ? "中水" : "多水"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      <CalendarDays className="h-3 w-3" />{plant.harvestDays > 0 ? `${plant.harvestDays}天收获` : "观赏"}
                    </span>
                    {plant.season && plant.season.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-1 text-xs text-pink-600 dark:bg-pink-900/20 dark:text-pink-300">
                        {plant.season.map((s: string) => s === "春" ? "🌱" : s === "夏" ? "☀️" : s === "秋" ? "🍂" : "❄️").join(" ")}
                        {" "}{plant.season.join("/") + "播"}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
