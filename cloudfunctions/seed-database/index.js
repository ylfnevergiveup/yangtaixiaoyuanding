/**
 * 数据库初始化脚本
 * 将 public/data/*.json 的数据导入云数据库
 *
 * 用法：
 *   cloudbase fn deploy seed-database
 *   然后在 CloudBase 控制台手动触发该函数
 */
"use strict";

const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ env: process.env.TCB_ENV || process.env.SCF_TCB_ENV });
const db = app.database();

// 内置种子数据（各个集合的初始数据）
const SEED_DATA = {
  plants: [
    {
      id: "basil",
      name: "罗勒",
      scientificName: "Ocimum basilicum",
      category: "herb",
      difficulty: "easy",
      season: ["春", "夏", "秋"],
      sunlight: "full",
      water: "medium",
      harvestDays: 30,
      description: "最受欢迎的阳台香草。紫罗勒和甜罗勒都适合盆栽，从顶端采摘可促进分枝。",
      tips: ["及时摘心促进分枝", "开花前采摘叶片风味最佳", "怕寒，冬季需移入室内"],
      balconyFit: "喜温暖阳光，南向阳台最佳，也适应东向或西向",
      suitableOrientations: ["south", "east", "west"],
      minPotDepth: 15,
      suitablePot: "普通花盆或长条盆（口径20cm以上）",
      minTemp: 10,
      featured: true,
    },
    {
      id: "tomato",
      name: "番茄",
      scientificName: "Solanum lycopersicum",
      category: "vegetable",
      difficulty: "medium",
      season: ["春", "夏"],
      sunlight: "full",
      water: "medium",
      harvestDays: 60,
      description: "阳台最受欢迎的蔬菜之一。樱桃番茄品种尤其适合盆栽，果实累累，观赏性极佳。",
      tips: ["选择矮生或樱桃番茄品种更适合盆栽", "需要支撑杆，防止倒伏", "定期摘除侧芽，促进主茎生长"],
      balconyFit: "需要充足阳光和较大空间，适合南向或西向大阳台",
      suitableOrientations: ["south", "west"],
      minPotDepth: 30,
      suitablePot: "5加仑以上花盆或长条种植箱",
      minTemp: 15,
      featured: true,
    },
  ],
  guides: [
    {
      id: "1",
      slug: "beginner-guide",
      title: "阳台种菜小白入门指南",
      summary: "从零开始打造你的家庭小菜园，选盆、选土、选种，看这一篇就够了。",
      category: "beginner",
      readTime: 8,
      author: "小园丁",
      date: "2026-04-15",
      tags: ["入门", "选盆", "配土"],
      content: [
        "## 第一步：确定你的阳台条件",
        "在开始种植之前，你需要评估阳台的关键条件。南向阳台光照最充足，适合大多数蔬菜和花卉；东向阳台适合绿叶蔬菜；北向阳台适合耐阴植物。",
        "## 第二步：选择合适的容器",
        "容器选择遵循'宁大勿小'原则。叶菜类需要15-20cm深的盆，果菜类需要25-35cm深的盆。",
        "## 第三步：配制合适的土壤",
        "推荐配方：泥炭土（40%）+ 珍珠岩（30%）+ 蛭石（30%）。",
        "## 第四步：选择种子幼苗",
        "新手推荐：樱桃番茄、生菜、薄荷、小葱——这些植物对新手非常友好。",
        "## 第五步：日常养护要点",
        "浇水'见干见湿'，施肥'薄肥勤施'，生长季每7-10天施一次液肥。",
      ],
    },
  ],
  diary: [
    {
      id: "1",
      slug: "tomato-growing-diary",
      title: "从播种到收获：我的樱桃番茄全记录",
      summary: "历时70天，从一粒种子到红彤彤的果实，分享全过程的经验和教训。",
      category: "practice",
      tags: ["番茄", "全程记录", "新手经验"],
      date: "2026-05-15",
      readTime: 8,
      pinned: true,
      content: [
        "## Day 1-7：种子育苗",
        "3月初开始了今年的番茄种植。保持温度20-25℃，第5天看到小苗破土而出。",
        "## Day 8-20：幼苗期",
        "小苗长出了2-3片真叶，可以开始施稀薄的液肥。注意稀释到正常浓度的一半。",
        "## Day 21-35：移栽定植",
        "苗长到15cm高时移栽到5加仑的青山盆中。移栽后浇透定根水，阴凉处缓苗3天。",
        "## Day 36-50：生长期",
        "每7天施一次海藻液肥。当主干长到30cm高时，开始摘除侧芽。",
        "## Day 51-65：开花结果",
        "第51天第一朵黄花绽放。每天轻轻摇晃植株帮助授粉。",
        "## Day 66-70：收获！",
        "第70天等到了第一个成熟的樱桃番茄！味道比超市买的浓郁太多。",
      ],
    },
  ],
  products: [
    {
      id: "pot-1",
      name: "青山盆 5加仑",
      category: "花盆",
      emoji: "🪴",
      description: "加厚款青山盆，控根透气设计，适合番茄、辣椒等深根系植物。",
      pros: ["控根设计防烂根", "加厚耐用", "底孔排水好"],
      rating: 4.5,
      price: "¥15-25",
      recommendation: "阳台种果菜首选，建议搭配托盘使用",
    },
    {
      id: "soil-1",
      name: "通用营养土 10L",
      category: "土壤",
      emoji: "🪨",
      description: "配比科学的通用营养土，含泥炭、珍珠岩、蛭石，开袋即用。",
      pros: ["无菌无虫卵", "透气保水", "开袋即用"],
      rating: 4.8,
      price: "¥20-30",
      recommendation: "新手必备，省去自己配土的麻烦",
    },
  ],
};

exports.main = async (event) => {
  const collectionName = event.collection; // 可选：只导入指定集合
  const collections = collectionName ? [collectionName] : Object.keys(SEED_DATA);

  const results = {};

  for (const name of collections) {
    const records = SEED_DATA[name];
    if (!records || records.length === 0) continue;

    const coll = db.collection(name);
    const now = new Date().toISOString();

    let added = 0;
    let skipped = 0;

    for (const record of records) {
      // 检查是否已存在（按 id 去重）
      const existing = await coll.where({ id: record.id }).get();
      if (existing.data && existing.data.length > 0) {
        skipped++;
        continue;
      }
      await coll.add({
        ...record,
        _createdAt: now,
        _updatedAt: now,
      });
      added++;
    }

    results[name] = { added, skipped };
  }

  return {
    code: 0,
    message: "种子数据导入完成",
    data: results,
  };
};
