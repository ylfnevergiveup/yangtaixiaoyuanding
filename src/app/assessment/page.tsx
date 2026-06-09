"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sun, Droplets, Clock, Compass, ArrowLeft, Sparkles, Sprout, Thermometer, Ruler, Search, MapPin } from "lucide-react";
import { plants, cities, balconyTypes, searchCities } from "@/data/plants";
import { categoryLabels, cn } from "@/lib/utils";

type Step = "balcony-type" | "enclosed" | "city" | "size" | "goal" | "result";
type GoalType = "vegetable" | "herb" | "succulent" | "flower" | "any";

const goalOptions: { value: GoalType; emoji: string; label: string; desc: string }[] = [
  { value: "vegetable", emoji: "🥬", label: "种蔬菜", desc: "能吃的，收获成就感" },
  { value: "herb", emoji: "🌿", label: "种香草", desc: "泡茶做菜，实用为主" },
  { value: "succulent", emoji: "🌵", label: "种多肉", desc: "好养不操心" },
  { value: "flower", emoji: "🌸", label: "种花卉", desc: "好看，美化阳台" },
  { value: "any", emoji: "🌱", label: "都行", desc: "推荐最适合的" },
];

export default function AssessmentPage() {
  const [step, setStep] = useState<Step>("balcony-type");
  const [selectedOrientation, setSelectedOrientation] = useState("");
  const [isEnclosed, setIsEnclosed] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [balconySize, setBalconySize] = useState<"small" | "medium" | "large">("medium");
  const [goal, setGoal] = useState<GoalType>("any");
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // 点击外部关闭城市下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCities = citySearch.trim() ? searchCities(citySearch.trim()).slice(0, 30) : cities.slice(0, 30);
  const selectedCityData = cities.find((c) => c.id === selectedCity);

  const steps = [
    { key: "balcony-type", label: "朝向" },
    { key: "enclosed", label: "封闭" },
    { key: "city", label: "城市" },
    { key: "size", label: "大小" },
    { key: "goal", label: "目标" },
    { key: "result", label: "方案" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  const goNext = () => {
    const map: Record<Step, Step> = { "balcony-type": "enclosed", "enclosed": "city", "city": "size", "size": "goal", "goal": "result", "result": "result" };
    setStep(map[step]);
  };
  const goBack = () => {
    const map: Record<Step, Step> = { "result": "goal", "goal": "size", "size": "city", "city": "enclosed", "enclosed": "balcony-type", "balcony-type": "balcony-type" };
    setStep(map[step]);
  };
  const reset = () => {
    setStep("balcony-type"); setSelectedOrientation(""); setIsEnclosed(false); setSelectedCity(""); setBalconySize("medium"); setGoal("any");
  };

  const getResults = () => {
    const orientation = isEnclosed ? "enclosed" : selectedOrientation;
    const balconyType = balconyTypes.find((t) => t.id === orientation);
    const city = cities.find((c) => c.id === selectedCity);
    const currentMonth = new Date().getMonth();

    let matched = plants.filter((p) => {
      // 朝向匹配
      if (p.suitableOrientations.includes(orientation as any)) return true;
      if (isEnclosed && p.suitableOrientations.length > 0) return true;
      return false;
    });

    // 目标筛选
    if (goal !== "any") {
      matched = matched.filter((p) => p.category === goal);
    }

    // 城市加权
    if (city) {
      matched.sort((a, b) => {
        const aScore = city.recommendedPlantIds.includes(a.id) ? -2 : 0;
        const bScore = city.recommendedPlantIds.includes(b.id) ? -2 : 0;
        // 当前季节加分
        const aSeason = a.season.some((s) => ["春","夏","秋","冬"][currentMonth / 3 | 0].includes(s)) ? -1 : 0;
        const bSeason = b.season.some((s) => ["春","夏","秋","冬"][currentMonth / 3 | 0].includes(s)) ? -1 : 0;
        return (aScore + aSeason) - (bScore + bSeason);
      });
    }

    // 空间限制
    if (balconySize === "small") matched = matched.filter((p) => p.minPotDepth <= 20);

    // 难度优先推荐
    matched.sort((a, b) => (a.difficulty === "easy" ? -1 : 0) - (b.difficulty === "easy" ? -1 : 0));

    return { matched: matched.slice(0, 6), balconyType, city };
  };

  // ===== 结果页 =====
  if (step === "result") {
    const { matched, balconyType, city } = getResults();
    const monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const currentMonth = new Date().getMonth();

    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary"><ArrowLeft className="h-4 w-4" /> 修改条件</button>
            <button onClick={reset} className="text-sm text-gray-500 hover:text-primary">重新测评</button>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-leaf p-8 text-white mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6" />
              <h1 className="text-2xl font-bold">你的阳台种植方案</h1>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-sm">
              <div><span className="opacity-70">阳台</span><p className="font-semibold">{balconyType?.emoji} {balconyType?.name}</p></div>
              <div><span className="opacity-70">城市</span><p className="font-semibold">{city?.name || "未选"}</p></div>
              <div><span className="opacity-70">光照</span><p className="font-semibold">{balconyType?.light.split("（")[0]}</p></div>
              <div><span className="opacity-70">目标</span><p className="font-semibold">{goalOptions.find(g => g.value === goal)?.emoji} {goalOptions.find(g => g.value === goal)?.label}</p></div>
              <div><span className="opacity-70">推荐</span><p className="font-semibold">{matched.length}种</p></div>
            </div>
          </div>

          {/* 阳台分析 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 mb-8 dark:bg-[#1a2e22]/80 dark:ring-white/5">
            <h2 className="text-lg font-semibold text-primary-dark dark:text-green-200 mb-3">📋 阳台分析</h2>
            <p className="text-gray-600 text-sm dark:text-gray-400 mb-3">{balconyType?.desc}</p>
            {city && (
              <div className="bg-green-50 rounded-xl p-4 mb-3 dark:bg-green-900/10">
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-primary">📍 {city.name}气候：</strong>{city.feature}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong className="text-primary">💡 建议：</strong>{city.advice}</p>
              </div>
            )}
            {balconyType?.caution && (
              <div className="bg-amber-50 rounded-xl p-3 dark:bg-amber-900/10">
                <p className="text-sm text-amber-700 dark:text-amber-300">⚠️ {balconyType.caution}</p>
              </div>
            )}
          </div>

          {/* 推荐植物 */}
          <h2 className="text-xl font-bold text-primary-dark dark:text-green-200 mb-4">🌱 为你推荐的植物</h2>
          {matched.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm dark:bg-[#1a2e22]/80">
              <span className="text-5xl">😅</span>
              <p className="mt-4 text-gray-500">没有完全匹配的植物，试试调整条件？</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {matched.map((plant) => (
                <div key={plant.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link href={`/plants/${plant.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary dark:text-green-100">{plant.name}</Link>
                      <p className="text-xs text-gray-400">{plant.scientificName}</p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", plant.difficulty === "easy" ? "bg-green-100 text-green-700" : plant.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                      {plant.difficulty === "easy" ? "🌱 新手" : plant.difficulty === "medium" ? "🌿 进阶" : "🌳 高手"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{plant.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      <Clock className="h-3 w-3" /> {plant.harvestDays > 0 ? `${plant.harvestDays}天收获` : "观赏"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      <Droplets className="h-3 w-3" /> {plant.water === "low" ? "少水" : plant.water === "medium" ? "中水" : "多水"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <Sun className="h-3 w-3" /> {plant.sunlight === "full" ? "喜阳" : plant.sunlight === "partial" ? "半阴" : "耐阴"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link href={`/guides?plant=${plant.id}`} className="text-xs text-primary hover:underline">📖 查看种植教程 →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 ring-1 ring-green-200/50 dark:from-[#1a2e22]/80 dark:to-[#0f1a14] dark:ring-green-900/30">
            <p className="text-sm text-gray-500">💡 点击植物名称查看详细种植教程 | 可返回修改条件重新测评</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== 步骤导航页 =====
  const showStep = () => {
    switch (step) {
      // ===== Step 1: 阳台朝向 =====
      case "balcony-type":
        return (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary-dark mb-6 dark:text-green-200">你的阳台是什么朝向？</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {balconyTypes.filter((t) => !t.isSpecial).map((type) => (
                <button key={type.id} onClick={() => { setSelectedOrientation(type.id); }}
                  className={cn("rounded-2xl p-5 text-left transition-all ring-2", selectedOrientation === type.id ? "ring-primary bg-primary/5 dark:bg-green-900/20" : "ring-gray-100 bg-white hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-gray-700")}>
                  <span className="text-3xl mb-2 block">{type.emoji}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-green-100">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.light}</p>
                  <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={goNext} disabled={!selectedOrientation} className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-primary-dark">下一步</button>
          </div>
        );

      // ===== Step 2: 是否封闭 =====
      case "enclosed":
        return (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary-dark mb-6 dark:text-green-200">阳台是封闭的还是开放的？</h2>
            <div className="grid gap-4">
              <button onClick={() => { setIsEnclosed(false); goNext(); }} className="rounded-2xl p-6 text-left ring-2 ring-gray-100 bg-white hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-gray-700">
                <span className="text-4xl mb-3 block">🌤️</span>
                <h3 className="font-semibold text-gray-900 dark:text-green-100">开放阳台</h3>
                <p className="text-sm text-gray-500 mt-1">通风好，阳光直射，温度接近室外</p>
              </button>
              <button onClick={() => { setIsEnclosed(true); goNext(); }} className="rounded-2xl p-6 text-left ring-2 ring-gray-100 bg-white hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-gray-700">
                <span className="text-4xl mb-3 block">🪟</span>
                <h3 className="font-semibold text-gray-900 dark:text-green-100">封闭阳台</h3>
                <p className="text-sm text-gray-500 mt-1">有玻璃封闭，温度稳定但通风较差，紫外线被过滤</p>
              </button>
            </div>
            <button onClick={goBack} className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">上一步</button>
          </div>
        );

      // ===== Step 3: 所在城市 =====
      case "city":
        return (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary-dark mb-2 dark:text-green-200">你在哪个城市？</h2>
            <p className="text-sm text-gray-500 mb-4">覆盖全国 {cities.length} 个城市，输入城市名搜索</p>

            {/* 搜索框 */}
            <div className="relative" ref={cityDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={cityInputRef}
                  type="text"
                  value={citySearch}
                  onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="输入城市名搜索..."
                  className="w-full rounded-xl border border-green-200/60 bg-white py-3 pl-10 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-[#1a2e22]/80 dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-500"
                />
                {citySearch && (
                  <button
                    onClick={() => { setCitySearch(""); setSelectedCity(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 下拉列表 */}
              {showCityDropdown && (
                <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-[#1a2e22] dark:ring-white/5">
                  {filteredCities.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">
                      未找到匹配城市
                    </div>
                  ) : (
                    filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city.id);
                          setCitySearch(city.name);
                          setShowCityDropdown(false);
                          goNext();
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors",
                          selectedCity === city.id && "bg-green-50 dark:bg-green-900/20"
                        )}
                      >
                        <MapPin className="h-4 w-4 text-primary/60 dark:text-green-400/60 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-green-100 truncate">
                            {city.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {city.province} · {city.feature}
                          </div>
                        </div>
                        {selectedCity === city.id && (
                          <span className="text-xs text-primary dark:text-green-300">✓</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 已选城市提示 */}
            {selectedCityData && (
              <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 dark:bg-green-900/10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary dark:text-green-300" />
                  <span className="text-sm font-medium text-primary-dark dark:text-green-200">
                    {selectedCityData.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedCityData.province} · {selectedCityData.zone === "north" ? "北方" : selectedCityData.zone === "south" ? "南方" : selectedCityData.zone === "central" ? "中部" : selectedCityData.zone === "northeast" ? "东北" : "西南"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  🌱 {selectedCityData.advice}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={goBack} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">上一步</button>
              <button onClick={goNext} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark">{selectedCity ? "下一步" : "跳过"}</button>
            </div>
          </div>
        );

      // ===== Step 4: 阳台大小 =====
      case "size":
        return (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary-dark mb-6 dark:text-green-200">阳台有多大？</h2>
            <div className="grid gap-4">
              {[
                { value: "small" as const, emoji: "📏", name: "紧凑型", desc: "小于2㎡", limit: "适合小盆植物" },
                { value: "medium" as const, emoji: "🪴", name: "中等型", desc: "2-5㎡", limit: "大部分植物都能种" },
                { value: "large" as const, emoji: "🌿", name: "宽敞型", desc: "大于5㎡", limit: "空间充足自由选择" },
              ].map((opt) => (
                <button key={opt.value} onClick={() => { setBalconySize(opt.value); goNext(); }}
                  className={cn("rounded-2xl p-5 text-left transition-all ring-2", balconySize === opt.value ? "ring-primary bg-primary/5" : "ring-gray-100 bg-white hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-gray-700")}>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{opt.emoji}</span>
                    <div><h3 className="font-semibold text-gray-900 dark:text-green-100">{opt.name}</h3>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                      <p className="text-xs text-primary mt-1">{opt.limit}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">上一步</button>
            </div>
          </div>
        );

      // ===== Step 5: 种植目标 =====
      case "goal":
        return (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-primary-dark mb-6 dark:text-green-200">你想种什么？</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {goalOptions.map((opt) => (
                <button key={opt.value} onClick={() => { setGoal(opt.value); goNext(); }}
                  className={cn("rounded-2xl p-6 text-left transition-all ring-2", goal === opt.value ? "ring-primary bg-primary/5" : "ring-gray-100 bg-white hover:shadow-md dark:bg-[#1a2e22]/80 dark:ring-gray-700")}>
                  <span className="text-4xl mb-2 block">{opt.emoji}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-green-100">{opt.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">上一步</button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl">🏡</span>
          <h1 className="mt-4 text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">阳台环境测评</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">5个问题，找到最适合你家阳台的种植方案</p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* 进度条 */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.filter(s => s.key !== "result").map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold", i <= currentIdx ? "bg-primary text-white" : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500")}>{i + 1}</div>
                <span className={cn("text-xs hidden sm:inline", i <= currentIdx ? "text-primary font-medium" : "text-gray-400")}>{s.label}</span>
                {i < 4 && <div className={cn("h-0.5 w-4 sm:w-8", i < currentIdx ? "bg-primary" : "bg-gray-200 dark:bg-gray-700")} />}
              </div>
            ))}
          </div>

          {showStep()}

          {/* 底部提示 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">回答越多，推荐越精准 🌱</p>
          </div>
        </div>
      </section>
    </div>
  );
}
