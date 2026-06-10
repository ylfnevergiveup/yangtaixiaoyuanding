/**
 * CloudBase 数据库初始化脚本
 *
 * 将 public/data/*.json 的数据导入 CloudBase MongoDB
 *
 * 使用方式：
 *   需要先安装 @cloudbase/manager
 *   npm install -g @cloudbase/cli
 *
 *   1. 登录：cloudbase login
 *   2. 运行：node cloudbase/seed-database.mjs
 *
 * 或者可在 CloudBase 控制台手动导入 JSON。
 */

import { readFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

async function main() {
  console.log('🌱 阳台小园丁 — CloudBase 数据库初始化\n');

  const envId = await ask('请输入 CloudBase 环境 ID (默认: yangtaixiaoyuanding): ') || 'yangtaixiaoyuanding';
  const password = await ask('请输入 CMS 管理员密码 (默认: admin123): ') || 'admin123';
  rl.close();

  console.log(`\n📡 环境: ${envId}`);
  console.log('📦 正在读取数据文件...\n');

  const collections = ['plants', 'guides', 'diary', 'products'];
  const dataDir = new URL('../public/data', import.meta.url);

  for (const name of collections) {
    const filePath = new URL(`./${name}.json`, dataDir);
    try {
      const records = JSON.parse(readFileSync(filePath, 'utf-8'));
      console.log(`  📄 ${name}.json → ${records.length} 条记录`);

      // 输出导入命令提示
      console.log(`     建议: 登录 CloudBase 控制台 → 数据库 → 创建集合 "${name}" → 导入 JSON\n`);
    } catch (e) {
      console.log(`  ⚠️  ${name}.json 读取失败: ${e.message}`);
    }
  }

  console.log('\n📋 请在 CloudBase 控制台完成以下步骤:');
  console.log('  1. 打开 https://console.cloud.tencent.com/tcb/env/index');
  console.log(`  2. 进入环境 "${envId}" → 数据库`);
  console.log('  3. 依次创建集合: plants, guides, diary, products');
  console.log('  4. 每个集合点击"导入" → 选择对应的 public/data/*.json 文件');
  console.log('  5. 进入"云函数" → 新建函数 cms-api');
  console.log('     - 运行环境: Node.js 16+');
  console.log('     - 上传方式: 本地上传 cloudfunctions/cms-api 目录');
  console.log('     - 添加环境变量: CMS_ADMIN_PASSWORD=' + password);
  console.log('  6. 在云函数"触发管理"中配置 HTTP 触发路径为 /api/cms');
  console.log('\n🎉 部署完成后，API 地址为:');
  console.log(`  https://${envId}.service.tcloudbase.com/api/cms`);
  console.log('  (具体域名以控制台显示为准)\n');
}

main().catch((e) => {
  console.error('失败:', e.message);
  process.exit(1);
});
