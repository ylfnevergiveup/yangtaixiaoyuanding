#!/usr/bin/env node
/**
 * 将 public/data/*.json 的数据导入 CloudBase MongoDB
 * 用法：node scripts/seed-cms.mjs
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("../", import.meta.url));
const DATA_DIR = new URL("public/data/", new URL("../", import.meta.url));
const COLLECTIONS = ["plants", "guides", "diary", "products"];

for (const name of COLLECTIONS) {
  const filePath = new URL(`${name}.json`, DATA_DIR);
  let records;
  try {
    records = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    console.log(`⚠️  ${name}.json 不存在，跳过`);
    continue;
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.log(`⚠️  ${name}.json 为空，跳过`);
    continue;
  }

  console.log(`📦 ${name}: 导入 ${records.length} 条数据...`);

  // 把每条数据转成合适格式，添加时间戳
  const docs = records.map((r) => ({
    ...r,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
  }));

  // CloudBase nosql execute 支持批量 insert
  const command = JSON.stringify([
    {
      TableName: name,
      CommandType: "INSERT",
      Command: JSON.stringify({
        insert: name,
        documents: docs,
      }),
    },
  ]);

  try {
    const result = execSync(
      `cloudbase db nosql execute --command '${command}' 2>&1`,
      {
        encoding: "utf-8",
        timeout: 30000,
        cwd: __dirname,
      }
    );
    if (result.includes("error") || result.includes("Error")) {
      console.log(`  ❌ ${name}: ${result.substring(0, 200)}`);
    } else {
      console.log(`  ✅ ${name}: 导入成功`);
    }
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message.substring(0, 200)}`);
  }
}

console.log("\n🎉 导入完成！");
