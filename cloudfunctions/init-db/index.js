/**
 * CloudBase 数据库初始化云函数
 *
 * 将 seedData 写入 MongoDB 集合
 * 一次性使用：部署后在 CloudBase 控制台手动调用
 */

'use strict';

const tcb = require('@cloudbase/node-sdk');

const app = tcb.init({
  env: process.env.TCB_ENV || process.env.SCF_TCB_ENV,
});

const db = app.database();
const _ = db.command;

// 种子数据直接从 public/data/*.json 同步过来
// 也可以直接引用 CDN 上的 JSON 文件
const SEED_URLS = {
  plants: 'https://yangtaixiaoyuanding-xxx.service.tcloudbase.com/data/plants.json',
  guides: 'https://yangtaixiaoyuanding-xxx.service.tcloudbase.com/data/guides.json',
  diary: 'https://yangtaixiaoyuanding-xxx.service.tcloudbase.com/data/diary.json',
  products: 'https://yangtaixiaoyuanding-xxx.service.tcloudbase.com/data/products.json',
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

exports.main = async (event) => {
  const { collection } = event;

  // 初始化指定集合或所有集合
  const collections = collection ? [collection] : Object.keys(SEED_URLS);

  let results = [];

  for (const name of collections) {
    const url = SEED_URLS[name];
    if (!url) {
      results.push({ collection: name, status: 'skip', reason: '没有种子数据 URL' });
      continue;
    }

    try {
      console.log(`📥 获取 ${name} 数据: ${url}`);
      const records = await fetchJSON(url);
      console.log(`📦 ${name}: ${records.length} 条记录`);

      // 清空集合
      const coll = db.collection(name);
      await coll.where(_.or([{ id: _.exists(true) }])).remove();

      // 批量插入（CloudBase 数据库单次批量最多 100 条）
      const batchSize = 100;
      let inserted = 0;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        // 为每条记录添加时间戳
        const now = new Date().toISOString();
        const docs = batch.map((r) => ({
          ...r,
          _createdAt: now,
          _updatedAt: now,
        }));
        await coll.add(docs);
        inserted += docs.length;
      }

      results.push({ collection: name, status: 'ok', count: inserted });
      console.log(`✅ ${name}: 导入 ${inserted} 条`);
    } catch (err) {
      results.push({ collection: name, status: 'error', error: err.message });
      console.error(`❌ ${name}: ${err.message}`);
    }
  }

  return { code: 0, data: results };
};
