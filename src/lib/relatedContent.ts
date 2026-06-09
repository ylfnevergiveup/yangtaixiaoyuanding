/**
 * 根据植物 ID 和名称，自动匹配相关的种植教程（guides）和园丁日记（diaries）。
 *
 * 匹配策略（优先级从高到低）：
 * 1. 显式 ID 匹配 — diary.plantId / guide.relatedPlants
 * 2. 标题匹配 — 植物中文名出现在标题中
 * 3. 标签匹配 — 植物中文名出现在标签中
 * 4. 摘要匹配 — 植物中文名出现在摘要中
 */

import { diaryEntries as localDiaries, diaryCategories } from "@/data/diary";
import { guides as localGuides, guideCategories } from "@/data/guides";

export interface RelatedItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  categoryLabel: string;
  type: "guide" | "diary";
  url: string;
}

/** 获取日记分类的中文标签 */
function getDiaryCategoryLabel(category: string): string {
  const cat = diaryCategories.find((c) => c.value === category);
  return cat?.label ?? "综合";
}

/** 获取指南分类的中文标签 */
function getGuideCategoryLabel(category: string): string {
  const cat = guideCategories.find((c) => c.value === category);
  return cat?.label ?? "种植技巧";
}

/**
 * 检查植物中文名是否出现在目标字符串中。
 * 使用子串匹配，兼容"番茄"匹配"樱桃番茄全记录"这种情况。
 */
function nameContains(name: string, text: string): boolean {
  if (!name || !text) return false;
  return text.includes(name);
}

/**
 * 查找与指定植物相关的内容。
 * @param plantId   植物的 id（如 "green-onion"）
 * @param plantName 植物的中文名（如 "小葱"）
 * @param allGuides  可选：从 CMS 加载的指南列表
 * @param allDiaries 可选：从 CMS 加载的日记列表
 */
export function findRelatedContent(
  plantId: string,
  plantName: string,
  allGuides?: any[],
  allDiaries?: any[],
): { guides: RelatedItem[]; diaries: RelatedItem[] } {
  const guideList = allGuides ?? localGuides;
  const diaryList = allDiaries ?? localDiaries;

  const seenGuideIds = new Set<string>();
  const seenDiaryIds = new Set<string>();
  const guides: RelatedItem[] = [];
  const diaries: RelatedItem[] = [];

  // ---- 匹配指南 ----
  for (const g of guideList) {
    if (seenGuideIds.has(g.id)) continue;

    let matched = false;

    // 1. 显式 relatedPlants 匹配
    if (Array.isArray(g.relatedPlants) && g.relatedPlants.includes(plantId)) {
      matched = true;
    }

    // 2. 名称匹配：标题
    if (!matched && nameContains(plantName, g.title)) {
      matched = true;
    }

    // 3. 名称匹配：标签
    if (!matched && Array.isArray(g.tags)) {
      for (const tag of g.tags) {
        if (nameContains(plantName, tag)) {
          matched = true;
          break;
        }
      }
    }

    // 4. 名称匹配：摘要
    if (!matched && nameContains(plantName, g.summary)) {
      matched = true;
    }

    if (matched) {
      seenGuideIds.add(g.id);
      guides.push({
        id: g.id,
        title: g.title,
        slug: g.slug,
        summary: g.summary || "",
        category: g.category,
        categoryLabel: getGuideCategoryLabel(g.category),
        type: "guide",
        url: `/guides/${encodeURI(g.slug)}/`,
      });
    }
  }

  // ---- 匹配日记 ----
  for (const d of diaryList) {
    if (seenDiaryIds.has(d.id)) continue;

    let matched = false;

    // 1. 显式 plantId 匹配
    if (d.plantId === plantId) {
      matched = true;
    }

    // 2. 名称匹配：标题
    if (!matched && nameContains(plantName, d.title)) {
      matched = true;
    }

    // 3. 名称匹配：标签
    if (!matched && Array.isArray(d.tags)) {
      for (const tag of d.tags) {
        if (nameContains(plantName, tag)) {
          matched = true;
          break;
        }
      }
    }

    // 4. 名称匹配：摘要
    if (!matched && nameContains(plantName, d.summary)) {
      matched = true;
    }

    if (matched) {
      seenDiaryIds.add(d.id);
      diaries.push({
        id: d.id,
        title: d.title,
        slug: d.slug,
        summary: d.summary || "",
        category: d.category,
        categoryLabel: getDiaryCategoryLabel(d.category),
        type: "diary",
        url: `/diary/${encodeURI(d.slug)}/`,
      });
    }
  }

  return { guides, diaries };
}
