"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Leaf, BookOpen, CalendarDays, Wrench, MessageCircle, ChevronRight, Sprout, Sun, Droplets, MapPin, PenLine, Sparkles, Compass, ShoppingCart, Search,
} from "lucide-react";
import { plants as localPlants } from "@/data/plants";
import { guides as localGuides } from "@/data/guides";
import { diaryEntries as localDiary } from "@/data/diary";
import CoverImage from "@/components/CoverImage";
import { categoryLabels } from "@/lib/utils";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchDialog from "@/components/SearchDialog";
import { loadJSON } from "@/lib/api";

// 默认全部显示
const defaultVisible: Record<string, boolean> = {
  hero: true, nav: true, featuredPlants: true,
  diaryPreview: true, guidePreview: true, qaPreview: true, cta: true,
};

export default function Home() {
  const [visible, setVisible] = useState(defaultVisible);
  const [searchOpen, setSearchOpen] = useState(false);
  const [plants, setPlants] = useState(localPlants);
  const [guides, setGuides] = useState(localGuides);
  const [diaryEntries, setDiaryEntries] = useState(localDiary);
  const [qaItems, setQAItems] = useState<any[]>([]);

  useEffect(() => {
    // 加载首页板块配置
    loadJSON<any>("homepage").then((data) => {
      if (data && data.length > 0 && data[0].sections) {
        const cfg: Record<string, boolean> = { ...defaultVisible };
        for (const s of data[0].sections) {
          cfg[s.key] = s.visible;
        }
        setVisible(cfg);
      }
    }).catch(() => {});

    // 加载 CMS 数据
    loadJSON<any>("plants").then((items) => { if (items.length > 0) setPlants(items); }).catch(() => {});
    loadJSON<any>("guides").then((items) => { if (items.length > 0) setGuides(items); }).catch(() => {});
    loadJSON<any>("diary").then((items) => { if (items.length > 0) setDiaryEntries(items); }).catch(() => {});
    loadJSON<any>("qa").then((items) => { if (items.length > 0) setQAItems(items); }).catch(() => {});
  }, []);

  const show = (key: string) => visible[key] !== false;

  const shuffle = useCallback((arr: any[]) => [...arr].sort(() => Math.random() - 0.5), []);

  // 推荐植物：置顶优先，非置顶随机打乱
  const [displayPlants, setDisplayPlants] = useState<any[]>([]);
  const [displayDiary, setDisplayDiary] = useState<any[]>([]);
  const [displayGuides, setDisplayGuides] = useState<any[]>([]);
  const [displayQA, setDisplayQA] = useState<any[]>([]);

  useEffect(() => {
    // 植物：置顶优先 + 随机
    const featured = plants.filter((p: any) => p.featured);
    const nonFeatured = plants.filter((p: any) => !p.featured);
    if (featured.length === 0) {
      setDisplayPlants(shuffle(plants).slice(0, 6));
    } else if (featured.length >= 6) {
      setDisplayPlants(shuffle(featured).slice(0, 6));
    } else {
      setDisplayPlants([...featured, ...shuffle(nonFeatured)].slice(0, 6));
    }
  }, [plants, shuffle]);

  useEffect(() => {
    // 园丁日记：置顶优先 + 随机
    const pinned = diaryEntries.filter((d: any) => d.pinned);
    const nonPinned = diaryEntries.filter((d: any) => !d.pinned);
    if (pinned.length >= 2) {
      setDisplayDiary(shuffle(pinned).slice(0, 2));
    } else if (pinned.length > 0) {
      setDisplayDiary([...pinned, ...shuffle(nonPinned)].slice(0, 2));
    } else {
      setDisplayDiary(shuffle(diaryEntries).slice(0, 2));
    }
  }, [diaryEntries, shuffle]);

  useEffect(() => {
    // 种植指南：随机选取 3 篇
    setDisplayGuides(shuffle(guides).slice(0, 3));
  }, [guides, shuffle]);

  useEffect(() => {
    // 社区问答：随机选取 3 条
    setDisplayQA(shuffle(qaItems.length > 0 ? qaItems : []).slice(0, 3));
  }, [qaItems, shuffle]);

  return (
    <div className="flex flex-col">
      <AnnouncementBar />

      {/* ===== Hero ===== */}
      {show("hero") && (
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-green-50/30 dark:from-[#0f1a14] dark:via-[#0f1a14] dark:to-[#0f1a14]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green-200/20 blur-3xl dark:bg-green-800/10" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-leaf-light/20 blur-3xl dark:bg-green-700/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">
          {/* 站内搜索 */}
          <button
            onClick={() => setSearchOpen(true)}
            className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-full border border-green-200/60 bg-white/70 px-4 py-2.5 text-sm shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:bg-white hover:shadow dark:border-green-800/50 dark:bg-[#1a2e22]/60 dark:hover:border-green-600/50 dark:hover:bg-[#1a2e22]"
          >
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 dark:text-gray-500">搜索植物、教程、日记...</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded-md border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-500">
              ⌘K
            </span>
          </button>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary dark:bg-green-800/30 dark:text-green-300 mb-6">
                <Sparkles className="h-4 w-4" />
                60000+阳台园艺爱好者的专属营地
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl lg:text-5xl dark:text-green-200">
                在阳台
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2">种下你的绿色生活</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-xl">
                先测阳台再种菜 🌱 输入你家阳台的朝向和城市，3秒找到最适合你的种植方案。
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/assessment" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl">
                  <Compass className="h-5 w-5" />
                  开始测评你的阳台
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/plants" className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/5 dark:border-green-700/50 dark:text-green-300 dark:hover:border-green-600">
                  浏览植物百科
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3">
                {["🌱", "🌿", "🍅", "🌻", "🌵", "🪴", "🌸", "🥬", "🍓"].map((emoji, i) => (
                  <div key={i} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm dark:bg-[#1a2e22]/80" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-2xl">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== 核心功能导航（重点突出阳台测评） ===== */}
      {show("nav") && (
      <section className="relative -mt-6 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Link href="/assessment" className="group rounded-2xl bg-accent p-4 sm:p-5 shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:-translate-y-1 text-white">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">阳台测评</h3>
              <p className="mt-1 text-xs text-white/70">3秒找到适合方案</p>
            </Link>
            <Link href="/guide" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-leaf to-primary text-white shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">场景指南</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">按城市/朝向分类</p>
            </Link>
            <Link href="/plants" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">植物百科</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">500+植物数据库</p>
            </Link>
            <Link href="/diary" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-sm">
                <PenLine className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">园丁日记</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">实战经验分享</p>
            </Link>
            <Link href="/guides" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">种植教程</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">从入门到精通</p>
            </Link>
            <Link href="/tools" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-sm">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">好物推荐</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">阳台好物评测</p>
            </Link>
            <Link href="/community" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-sm">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">社区问答</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">花友互助交流</p>
            </Link>
            <Link href="/calendar" className="group rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-green-100">种植日历</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">跟着时节种</p>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ===== 热门植物推荐 ===== */}
      {show("featuredPlants") && (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl dark:text-green-200">🌱 推荐植物</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">最适合阳台种植的热门选择</p>
            </div>
            <Link href="/plants" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark dark:text-green-300">浏览全部 <ChevronRight className="h-4 w-4" /></Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayPlants.map((plant) => (
              <Link key={plant.id} href={`/plants/${plant.id}`} className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5 overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-green-100/80 via-emerald-50 to-green-200/60 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-800/30 flex items-center justify-center">
                  {(plant as any).image ? (
                    <CoverImage src={(plant as any).image} alt={plant.name} position={(plant as any).imagePosition} />
                  ) : (
                    <span className="text-5xl opacity-60 select-none">
                      {plant.category === "vegetable" ? "🥬" : plant.category === "herb" ? "🌿" : plant.category === "succulent" ? "🌵" : plant.category === "flower" ? "🌸" : "🍓"}
                    </span>
                  )}
                  {/* 左上角分类标签 */}
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-black/50 dark:text-green-300">
                    {categoryLabels[plant.category] || plant.category}
                  </span>
                  {/* 右上角难度 */}
                  <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-xs text-gray-600 shadow-sm backdrop-blur dark:bg-black/50 dark:text-gray-300">
                    {plant.difficulty === "easy" ? "🌱 新手" : plant.difficulty === "medium" ? "🌿 进阶" : "🌳 高手"}
                  </span>
                </div>
                <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary transition-colors">{plant.name}</h3>
                <p className="mt-1 text-xs text-gray-400 italic dark:text-gray-500">{plant.scientificName}</p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{plant.description?.replace(/<[^>]*>/g, "")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <Sun className="h-3 w-3" /> {plant.sunlight === "full" ? "喜阳" : plant.sunlight === "partial" ? "半阴" : "耐阴"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    <Droplets className="h-3 w-3" /> {plant.water === "low" ? "少水" : plant.water === "medium" ? "中水" : "多水"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <CalendarDays className="h-3 w-3" /> {plant.harvestDays > 0 ? `${plant.harvestDays}天收获` : "观赏"}
                  </span>
                  {plant.season && plant.season.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-1 text-xs text-pink-600 dark:bg-pink-900/20 dark:text-pink-300">
                      {plant.season.map((s: string) => s === "春" ? "🌱" : s === "夏" ? "☀️" : s === "秋" ? "🍂" : "❄️").join(" ")}
                      {" "}{plant.season.join("/") + "播"}
                    </span>
                  )}
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===== 园丁日记预览 ===== */}
      {show("diaryPreview") && (
      <section className="py-16 bg-gradient-to-b from-white to-green-50/50 dark:from-[#0f1a14] dark:to-[#0f1a14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl dark:text-green-200">📝 园丁日记</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">真实的种植经验分享，帮你少走弯路</p>
            </div>
            <Link href="/diary" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark dark:text-green-300">查看全部 <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {displayDiary.map((entry) => (
              <Link key={entry.id} href={`/diary/${entry.slug}`} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300 mb-3">
                  {entry.category === "practice" ? "🌱 实战记录" : entry.category === "pitfall" ? "⚠️ 避坑指南" : "📸 花园展示"}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary transition-colors">{entry.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{entry.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-primary dark:bg-green-900/20 dark:text-green-300">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===== 最新指南 ===== */}
      {show("guidePreview") && (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl dark:text-green-200">📖 种植指南</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">系统学习阳台种植知识</p>
            </div>
            <Link href="/guides" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark dark:text-green-300">查看全部 <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {displayGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                <div className="mb-4 h-36 rounded-xl bg-gradient-to-br from-leaf-light/30 to-sky-100/30 dark:from-green-800/20 dark:to-sky-900/20 flex items-center justify-center overflow-hidden">
                  {(guide as any).image ? (
                    <CoverImage src={(guide as any).image} alt={guide.title} position={(guide as any).imagePosition} />
                  ) : (
                    <span className="text-4xl">{guide.category === "beginner" ? "🌱" : guide.category === "seasonal" ? "🌸" : guide.category === "diy" ? "🔧" : "🌿"}</span>
                  )}
                </div>
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>{guide.readTime}分钟阅读</span><span>·</span><span>{guide.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-green-100 group-hover:text-primary">{guide.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{guide.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===== 社区预览 ===== */}
      {show("qaPreview") && (
      <section className="py-16 bg-gradient-to-b from-green-50/50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl dark:text-green-200">💬 热门问答</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">花友们正在讨论的问题</p>
            </div>
            <Link href="/community" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark dark:text-green-300">去社区 <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3">
            {displayQA.length > 0 ? displayQA.map((item: any) => (
              <Link key={item.id} href={`/community/question?id=${item.id}`} className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-white/5">
                <div className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${item.isResolved ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300"}`}>
                  {item.isResolved ? "已解决" : "待解答"}
                </div>
                <p className="flex-1 text-sm font-medium text-gray-800 dark:text-green-100 group-hover:text-primary">{item.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400"><span>{(item.answers?.length || 0)} 回答</span><span>{item.views || 0} 浏览</span></div>
              </Link>
            )) : (
              // CMS 数据加载前显示本地兜底数据
              [
                { id: "1", title: "番茄叶子发黄卷曲是什么原因？", answers: [{}, {}, {}], views: 156, isResolved: true },
                { id: "3", title: "封闭阳台适合种什么开花植物？", answers: Array(8), views: 412, isResolved: false },
                { id: "5", title: "蚜虫爆发了，不想用农药有什么好办法？", answers: Array(6), views: 198, isResolved: false },
              ].map((item) => (
                <Link key={item.id} href={`/community/question?id=${item.id}`} className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-white/5">
                  <div className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${item.isResolved ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300"}`}>
                    {item.isResolved ? "已解决" : "待解答"}
                  </div>
                  <p className="flex-1 text-sm font-medium text-gray-800 dark:text-green-100 group-hover:text-primary">{item.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400"><span>{item.answers.length} 回答</span><span>{item.views} 浏览</span></div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* ===== CTA ===== */}
      {show("cta") && (
      <section className="py-20 bg-gradient-to-br from-primary-dark via-primary to-leaf relative overflow-hidden dark:from-[#0a1a10] dark:via-[#0f1a14] dark:to-[#1a2e22]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🌱</div>
          <div className="absolute top-20 right-20 text-5xl">🌿</div>
          <div className="absolute bottom-10 left-1/3 text-6xl">🍅</div>
          <div className="absolute bottom-20 right-10 text-5xl">🌸</div>
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">今天就开始你的阳台花园吧</h2>
          <p className="mt-4 text-lg text-green-100/80">先测阳台再种菜，让每一个阳台都变成绿色小天地。</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/assessment" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
              <Compass className="h-5 w-5" />
              开始测评你的阳台
            </Link>
            <Link href="/diary" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10">
              阅读园丁日记
            </Link>
          </div>
        </div>
      </section>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
