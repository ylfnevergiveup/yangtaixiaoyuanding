/**
 * 从 CMS API 拉取最新数据，写入 public/data/*.json
 * 运行: node scripts/sync-from-cms.mjs
 *
 * 目的：每次部署前同步数据库 → 静态 JSON，确保即使 CMS API 冷启动/宕机，
 * 前端兜底数据也是最新的，图片 URL 也不会丢失。
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// CMS API 地址（与前端 HARDCODED_CMS_API 保持一致）
const CMS_API =
  process.env.CMS_API ||
  "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";

// 需要同步的集合
const COLLECTIONS = ["plants", "guides", "diary", "products", "announcements"];

async function fetchCollection(name) {
  try {
    const res = await fetch(`${CMS_API}/${name}`, { cache: "no-cache" });
    if (!res.ok) {
      console.error(`  ❌ ${name}: HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json.code === 0 && Array.isArray(json.data)) {
      // 过滤掉草稿
      const published = json.data.filter((item) => item.status !== "draft");
      console.log(`  ✅ ${name}: ${json.data.length} 条 (${published.length} 已发布)`);
      return published;
    }
    console.error(`  ❌ ${name}: 返回格式异常`, json.code);
    return null;
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("📡 从 CMS API 同步数据到 public/data/...\n");

  let totalCount = 0;

  // 确保 src/data/synced 目录存在
  const syncedDir = join(__dirname, "..", "src", "data", "synced");
  if (!existsSync(syncedDir)) {
    mkdirSync(syncedDir, { recursive: true });
  }

  for (const name of COLLECTIONS) {
    const data = await fetchCollection(name);
    if (data !== null) {
      // 写入 public/data/ JSON
      const filePath = join(__dirname, "..", "public", "data", `${name}.json`);
      writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

      // 同时写入 src/data/synced/ TS 文件，供页面组件直接 import
      const tsPath = join(syncedDir, `${name}.ts`);
      const tsContent = `// 由 sync-from-cms.mjs 自动生成，请勿手动编辑
export default ${JSON.stringify(data, null, 2)} as const;
`;
      writeFileSync(tsPath, tsContent, "utf-8");
      totalCount += data.length;
    }
  }

  console.log(`\n🎉 同步完成！共 ${totalCount} 条记录写入 public/data/ + src/data/synced/`);
  console.log("现在运行 npm run build 即可使用最新数据构建");
}

main().catch(console.error);
