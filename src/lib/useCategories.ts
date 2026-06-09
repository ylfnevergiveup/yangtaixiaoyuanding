"use client";

import { useState, useEffect } from "react";
import { loadJSON } from "@/lib/api";

// 默认值，编辑器中 import 直接使用
export const defaultCategories = {
  plantCategory: [
    { value: "vegetable", label: "蔬菜" },
    { value: "herb", label: "香草" },
    { value: "succulent", label: "多肉" },
    { value: "flower", label: "花卉" },
    { value: "fruit", label: "水果" },
    { value: "foliage", label: "观叶" },
    { value: "bulb", label: "球根花卉" },
    { value: "aquatic", label: "水生植物" },
    { value: "mushroom", label: "食用菌" },
  ],
  difficulty: [
    { value: "easy", label: "新手友好" },
    { value: "medium", label: "稍有挑战" },
    { value: "hard", label: "进阶玩家" },
  ],
  sunlight: [
    { value: "full", label: "喜阳" },
    { value: "partial", label: "半阴" },
    { value: "shade", label: "耐阴" },
  ],
  water: [
    { value: "low", label: "少水" },
    { value: "medium", label: "中水" },
    { value: "high", label: "多水" },
  ],
  guideCategory: [
    { value: "beginner", label: "入门" },
    { value: "seasonal", label: "时令" },
    { value: "diy", label: "DIY" },
    { value: "technique", label: "技巧" },
  ],
  diaryCategory: [
    { value: "practice", label: "实战记录" },
    { value: "pitfall", label: "避坑指南" },
  ],
  productCategory: [
    { value: "花盆", label: "花盆" },
    { value: "土壤", label: "土壤" },
    { value: "工具", label: "工具" },
    { value: "种子", label: "种子" },
    { value: "肥料", label: "肥料" },
  ],
};

type CategoryGroups = typeof defaultCategories;

/**
 * 从 CMS 加载分类配置，与默认值合并
 * 用于编辑器的下拉选项
 */
export function useCategories() {
  const [groups, setGroups] = useState<CategoryGroups>(defaultCategories);

  useEffect(() => {
    loadJSON<any>("settings").then((data) => {
      const catConfig = data.find((d: any) => d.id === "categories");
      if (catConfig?.groups) {
        const merged = { ...defaultCategories };
        for (const g of catConfig.groups) {
          if (merged[g.key as keyof CategoryGroups]) {
            merged[g.key as keyof CategoryGroups] = g.items;
          }
        }
        setGroups(merged);
      }
    }).catch(() => {});
  }, []);

  return groups;
}
