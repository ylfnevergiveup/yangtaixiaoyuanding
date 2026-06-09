"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sun, Snowflake, Cloud, Wind } from "lucide-react";

const months = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

const monthData: Record<number, {
  season: string;
  emoji: string;
  color: string;
  tips: string[];
  sow: string[];
  harvest: string[];
}> = {
  0: { season: "冬季", emoji: "❄️", color: "from-blue-100 to-blue-50 dark:from-blue-900/20", tips: ["室内育苗好时机", "注意防寒保暖", "减少浇水频率"], sow: ["小葱（室内）", "生菜（室内）", "草莓（室内）"], harvest: ["菠菜", "香菜"] },
  1: { season: "冬季", emoji: "🌸", color: "from-pink-100 to-pink-50 dark:from-pink-900/20", tips: ["准备春季播种计划", "可开始室内育苗", "检查工具和土壤"], sow: ["番茄（室内）", "辣椒（室内）", "茄子（室内）"], harvest: ["小葱", "生菜（室内）"] },
  2: { season: "春季", emoji: "🌱", color: "from-green-100 to-green-50 dark:from-green-900/20", tips: ["春播正式开始了", "逐步增加浇水量", "注意倒春寒"], sow: ["生菜", "菠菜", "萝卜", "豌豆"], harvest: ["草莓（早熟种）"] },
  3: { season: "春季", emoji: "🌿", color: "from-emerald-100 to-emerald-50 dark:from-emerald-900/20", tips: ["大部分植物可户外种植了", "开始定期施肥", "注意防蚜虫"], sow: ["番茄", "辣椒", "黄瓜", "罗勒", "薄荷"], harvest: ["生菜", "小葱", "草莓"] },
  4: { season: "春季", emoji: "🌸", color: "from-rose-100 to-rose-50 dark:from-rose-900/20", tips: ["生长旺盛期", "及时浇水防止干旱", "开始搭架支撑"], sow: ["空心菜", "苋菜", "豆角", "向日葵"], harvest: ["生菜", "樱桃萝卜", "草莓"] },
  5: { season: "夏季", emoji: "☀️", color: "from-amber-100 to-amber-50 dark:from-amber-900/20", tips: ["注意遮阴防晒", "增加浇水频率", "预防红蜘蛛"], sow: ["耐热生菜", "空心菜"], harvest: ["番茄", "辣椒", "黄瓜", "豆角", "罗勒"] },
  6: { season: "夏季", emoji: "🌻", color: "from-yellow-100 to-yellow-50 dark:from-yellow-900/20", tips: ["高温注意防暑", "早晚浇水为佳", "注意通风"], sow: ["秋播蔬菜育苗"], harvest: ["番茄", "辣椒", "茄子", "黄瓜", "薄荷"] },
  7: { season: "夏季", emoji: "🍅", color: "from-red-100 to-red-50 dark:from-red-900/20", tips: ["收获高峰期", "清理枯叶老叶", "准备秋播"], sow: ["白菜", "萝卜", "莴笋"], harvest: ["番茄（盛产）", "辣椒", "茄子", "罗勒"] },
  8: { season: "秋季", emoji: "🍂", color: "from-orange-100 to-orange-50 dark:from-orange-900/20", tips: ["秋播黄金期", "逐渐减少浇水", "注意温差变化"], sow: ["菠菜", "香菜", "生菜", "大蒜"], harvest: ["秋番茄", "辣椒", "茄子"] },
  9: { season: "秋季", emoji: "🎃", color: "from-amber-100 to-amber-50 dark:from-amber-900/20", tips: ["收获秋菜", "开始防寒准备", "修剪多年生植物"], sow: ["豌豆", "蚕豆"], harvest: ["白菜", "萝卜", "菠菜", "香菜"] },
  10: { season: "秋季", emoji: "🌾", color: "from-stone-100 to-stone-50 dark:from-stone-900/20", tips: ["清理枯枝落叶", "植物入室防寒", "整理花盆"], sow: ["大蒜（越冬）"], harvest: ["白菜", "萝卜", "菠菜"] },
  11: { season: "冬季", emoji: "❄️", color: "from-sky-100 to-sky-50 dark:from-sky-900/20", tips: ["室内保暖为主", "减少施肥", "享受收获的喜悦"], sow: ["小葱（室内）"], harvest: ["大蒜苗", "室内生菜", "香菜"] },
};

export default function CalendarPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());

  const data = monthData[month];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              🗓️ 种植日历
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              跟着时令种植，每个季节都有适合的植物
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* 月份切换 */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
              className="rounded-xl p-2 text-gray-500 hover:bg-green-50 hover:text-primary transition-all dark:hover:bg-green-900/30 dark:hover:text-green-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <span className="text-4xl mr-3">{data.emoji}</span>
              <span className="text-2xl font-bold text-primary-dark dark:text-green-200">
                {months[month]}
              </span>
              <span className="ml-3 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary dark:bg-green-800/30 dark:text-green-300">
                {data.season}
              </span>
            </div>
            <button
              onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
              className="rounded-xl p-2 text-gray-500 hover:bg-green-50 hover:text-primary transition-all dark:hover:bg-green-900/30 dark:hover:text-green-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* 当月提示 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <h3 className="text-lg font-semibold text-primary-dark dark:text-green-200 mb-4">
                💡 本月提示
              </h3>
              <ul className="space-y-3">
                {data.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-0.5 text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* 适合播种 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <h3 className="text-lg font-semibold text-primary-dark dark:text-green-200 mb-4">
                🌱 适合播种
              </h3>
              <ul className="space-y-3">
                {data.sow.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 适合收获 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
              <h3 className="text-lg font-semibold text-primary-dark dark:text-green-200 mb-4">
                🧺 适合收获
              </h3>
              <ul className="space-y-3">
                {data.harvest.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 季节装饰 */}
          <div className={`mt-8 rounded-2xl bg-gradient-to-r ${data.color} p-6 text-center dark:bg-none dark:bg-[#1a2e22]/80`}>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {month >= 2 && month <= 4
                ? "🌸 春回大地，万物生长，是播种希望的最佳时节"
                : month >= 5 && month <= 7
                ? "☀️ 盛夏时节，阳台郁郁葱葱，享受丰收的喜悦"
                : month >= 8 && month <= 10
                ? "🍂 秋高气爽，收获与播种并存的黄金季节"
                : "❄️ 冬日阳台，室内育苗正当时，静待春暖花开"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
