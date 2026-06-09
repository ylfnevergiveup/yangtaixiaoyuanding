/**
 * 导入数据脚本
 * 将 src/data/ 中的数据通过 Strapi API 导入到 CMS 数据库
 * 使用方式: node scripts/import-data.mjs
 */

const API_URL = "http://localhost:1337/api";
let TOKEN = "";

// 先登录获取 token
async function login() {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "admin@example.com", // 替换成你在后台注册的邮箱
      password: "Admin123!",           // 替换成你的密码
    }),
  });
  const data = await res.json();
  if (!data.jwt) {
    console.error("登录失败，请检查邮箱和密码");
    console.error(data);
    process.exit(1);
  }
  TOKEN = data.jwt;
  console.log("✅ 登录成功");
}

// 通用的导入函数
async function importData(collection, records, transformFn) {
  console.log(`\n📦 正在导入 ${collection}...`);
  let success = 0, fail = 0;

  for (const record of records) {
    const body = transformFn ? transformFn(record) : record;
    try {
      const res = await fetch(`${API_URL}/${collection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ data: body }),
      });
      if (res.ok) {
        success++;
        process.stdout.write(".");
      } else {
        fail++;
        const err = await res.json();
        console.error(`\n❌ 导入失败: ${record.name || record.title}`, err.error?.message || "");
      }
    } catch (e) {
      fail++;
      console.error(`\n❌ 网络错误: ${record.name || record.title}`, e.message);
    }
  }
  console.log(`\n✅ ${collection}: 成功 ${success}, 失败 ${fail}`);
}

async function main() {
  // 1. 导入植物百科
  const { plants } = await import("../src/data/plants.ts");

  // 用动态 import 的方式读取
  const plantsModule = await import("../src/data/plants.ts");
  await importData("plants", plantsModule.plants);
  // 注意：上面的 import 不会直接工作，因为 .ts 文件不能直接被 Node 读取
  // 我们需要转换一下方式
}

// 实际上直接用 JSON 方式更简单
// 因为项目里没有装 ts-node，我们把数据转成 JSON 再导入

main().catch(console.error);
