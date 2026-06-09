/**
 * 直接写入 SQLite 数据库的导入脚本
 * 运行: node scripts/seed-db.mjs
 */

import { readFileSync } from "fs";
import Database from "better-sqlite3";

const DB_PATH = "/Users/yelifeng/Documents/trae_projects/plant-cms/.tmp/data.db";
const db = new Database(DB_PATH);

const data = JSON.parse(readFileSync(new URL("./seed.json", import.meta.url), "utf-8"));

function insertCollection(table, records, fieldMap) {
  console.log(`\n📦 写入 ${table} (${records.length}条)...`);
  const now = new Date().toISOString();
  let ok = 0;

  for (const rec of records) {
    const mapped = {};
    for (const [key, val] of Object.entries(rec)) {
      const dbKey = fieldMap[key] || key;
      if (Array.isArray(val) || typeof val === "object") {
        mapped[dbKey] = JSON.stringify(val);
      } else {
        mapped[dbKey] = val;
      }
    }
    mapped["created_at"] = now;
    mapped["updated_at"] = now;
    mapped["published_at"] = now;

    const keys = Object.keys(mapped).join(",");
    const placeholders = Object.keys(mapped).map(() => "?").join(",");
    const values = Object.values(mapped);

    try {
      db.prepare(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`).run(...values);
      ok++;
      process.stdout.write(".");
    } catch (e) {
      console.error(`\n❌ ${rec.name || rec.title}: ${e.message}`);
    }
  }
  console.log(` ✅ ${ok}条`);
}

console.log("🌱 开始导入数据到数据库...");

// plants 表
insertCollection("plants", data.plants, {
  tips: "tips",
  season: "season",
  suitableOrientations: "suitable_orientations",
  balconyFit: "balcony_fit",
  minPotDepth: "min_pot_depth",
  suitablePot: "suitable_pot",
  minTemp: "min_temp",
  scientificName: "scientific_name",
  harvestDays: "harvest_days",
});

// guides 表
insertCollection("guides", data.guides, {
  readTime: "read_time",
  tags: "tags",
});

// products 表
insertCollection("products", data.products, {
  buyLink: "buy_link",
});

// diaries 表
insertCollection("diaries", data.diaries, {
  readTime: "read_time",
  tags: "tags",
});

db.close();
console.log("\n🎉 全部导入完成！");
