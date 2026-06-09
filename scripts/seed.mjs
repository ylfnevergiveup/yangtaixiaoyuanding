/**
 * 数据导入脚本 — 将 seed.json 中的数据导入 Strapi
 *
 * 使用方式:
 * 1. 确保 Strapi 在 http://localhost:1337 运行
 * 2. node scripts/seed.mjs
 * 3. 根据提示输入邮箱和密码
 */

import { readFileSync } from "fs";
import { createInterface } from "readline";

const API = "http://localhost:1337/api";
const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise((r) => rl.question(q, r));
}

async function login(email, password) {
  const res = await fetch(`${API}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password }),
  });
  const data = await res.json();
  if (!data.jwt) throw new Error(`登录失败: ${JSON.stringify(data.error)}`);
  return data.jwt;
}

async function importAll(TOKEN, collection, records) {
  console.log(`\n📦 导入 ${collection} (${records.length}条)...`);
  let ok = 0, fail = 0;
  for (const rec of records) {
    const res = await fetch(`${API}/${collection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ data: rec }),
    });
    if (res.ok) { ok++; process.stdout.write("."); }
    else {
      fail++;
      const err = await res.json();
      console.error(`\n❌ ${rec.name || rec.title}: ${err.error?.message || ""}`);
    }
  }
  console.log(`\n✅ ${collection}: 成功 ${ok}, 失败 ${fail}`);
}

async function main() {
  console.log("🌱 阳台小园丁 — 数据导入工具\n");

  const email = await ask("Strapi 管理员邮箱: ");
  const password = await ask("密码: ");
  rl.close();

  console.log("🔑 登录中...");
  const token = await login(email, password);
  console.log("✅ 登录成功\n");

  const data = JSON.parse(readFileSync(new URL("./seed.json", import.meta.url), "utf-8"));

  await importAll(token, "plants", data.plants);
  await importAll(token, "guides", data.guides);
  await importAll(token, "products", data.products);
  await importAll(token, "diaries", data.diaries);

  console.log("\n🎉 全部导入完成！");
}

main().catch((e) => { console.error("失败:", e.message); process.exit(1); });
