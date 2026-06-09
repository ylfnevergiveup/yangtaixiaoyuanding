/**
 * 将 public/data/*.json 同步回 src/data/*.ts
 * 运行: node scripts/sync-data.mjs
 * 后台保存数据后，运行这个脚本将 JSON 转换回 TS 格式
 */

import { readFileSync, writeFileSync } from "fs";

function sync(name, tsPath, varName) {
  const json = JSON.parse(readFileSync(`public/data/${name}.json`, "utf-8"));
  const ts = readFileSync(tsPath, "utf-8");
  // 用正则匹配 "varName ... = [" 定位数据数组，避免误匹配 interface 中的 string[]
  const re = new RegExp(`${varName}[^=]*=\\s*\\[`);
  const match = ts.match(re);
  if (!match) {
    console.error(`❌ ${name}: 找不到数据标记 "${varName} = ["`);
    return;
  }
  const start = match.index + match[0].length - 1; // 指向 '['
  const end = ts.lastIndexOf("]");
  if (end === -1) return;

  const newTs = ts.substring(0, start) + JSON.stringify(json, null, 2) + ts.substring(end + 1);
  writeFileSync(tsPath, newTs);
  console.log(`✅ ${name}: ${json.length} 条记录已同步`);
}

sync("plants", "src/data/plants.ts", "plants");
sync("guides", "src/data/guides.ts", "guides");
sync("diary", "src/data/diary.ts", "diaryEntries");
console.log("🎉 全部同步完成！重新构建即可更新网站");
