// cn 工具函数 — 条件拼接 class 名
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  const filtered = classes.filter(Boolean);
  return filtered.join(" ");
}

/** 从中文标题生成安全 URL slug：去除括号/特殊符号，保留中英文和数字 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .replace(/[（）()【】\[\]「」""''《》〈〉]/g, "")
    .replace(/[！!？?。，,、：:；;·]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export const BUILD_FINGERPRINT = "v20260605-001";

// 分类标签中文映射
export const categoryLabels: Record<string, string> = {
  vegetable: "蔬菜",
  herb: "香草",
  succulent: "多肉",
  flower: "花卉",
  fruit: "水果",
  foliage: "观叶",
  bulb: "球根花卉",
  aquatic: "水生植物",
  mushroom: "食用菌",
  all: "全部",
  easy: "新手友好",
  medium: "稍有挑战",
  hard: "进阶玩家",
  beginner: "新手入门",
  seasonal: "时令种植",
  technique: "种植技巧",
  diy: "DIY教程",
};

// 分类图标映射
export const categoryEmojis: Record<string, string> = {
  vegetable: "🥬",
  herb: "🌿",
  succulent: "🌵",
  flower: "🌸",
  fruit: "🍓",
  foliage: "🪴",
  bulb: "🌷",
  aquatic: "🪷",
  mushroom: "🍄",
  easy: "🌱",
  medium: "🌿",
  hard: "🌳",
};

// 阳台朝向中文映射
export const orientationLabels: Record<string, string> = {
  south: "南向",
  east: "东向",
  west: "西晒",
  north: "北向",
  enclosed: "封闭阳台",
};
