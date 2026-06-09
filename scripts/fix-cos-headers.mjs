/**
 * 修复 COS 对象上的 Content-Disposition: attachment 问题
 *
 * CloudBase 静态托管在上传 HTML/CSS/JS 等静态文件时，
 * 默认设置 Content-Disposition: attachment，导致部分浏览器
 * 将页面当作文本文件下载而不是正常渲染，造成「排版乱」的问题。
 *
 * 本脚本遍历 COS 存储桶中的文件，将浏览器需要渲染的文件类型
 * 的 Content-Disposition 改为 inline。
 */

import COS from "cos-nodejs-sdk-v5";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ===== 配置 =====
const ENV_ID = "yangtaixiaoyuanding-d7b1c10c2d50";
const BUCKET = `bcfb-static-${ENV_ID}-1438704930`;
const REGION = "ap-shanghai";

// CloudBase 环境变量 / 本地配置中的密钥
// CloudBase CLI 在登录后会把凭证存到 ~/.cloudbase/cache 中

function loadCredentials() {
  // 尝试从 CloudBase 缓存文件读取
  const home = process.env.HOME || process.env.USERPROFILE || "~";
  const cachePath = join(home, ".cloudbase", "cache");

  try {
    if (existsSync(cachePath)) {
      const cache = JSON.parse(readFileSync(cachePath, "utf-8"));
      // 查找当前环境的凭证
      const envKey = Object.keys(cache).find(k =>
        k.includes(ENV_ID) || (cache[k].envId === ENV_ID)
      );

      if (envKey && cache[envKey]?.credential) {
        const cred = cache[envKey].credential;
        return {
          secretId: cred.secretId || cred.tmpSecretId,
          secretKey: cred.secretKey || cred.tmpSecretKey,
          token: cred.token,
        };
      }
    }
  } catch (e) {
    console.error("读取 CloudBase 缓存失败:", e.message);
  }

  // 回退到环境变量
  return {
    secretId: process.env.COS_SECRET_ID || process.env.TENCENT_SECRET_ID || process.env.SECRET_ID,
    secretKey: process.env.COS_SECRET_KEY || process.env.TENCENT_SECRET_KEY || process.env.SECRET_KEY,
    token: process.env.COS_TOKEN || process.env.TENCENT_TOKEN,
  };
}

const creds = loadCredentials();

if (!creds.secretId || !creds.secretKey) {
  console.error("❌ 找不到 COS 凭证。请先运行 cloudbase login 登录。");
  console.error("   或者在环境变量中设置 TENCENT_SECRET_ID / TENCENT_SECRET_KEY。");
  process.exit(1);
}

const cos = new COS({
  SecretId: creds.secretId,
  SecretKey: creds.secretKey,
  SecurityToken: creds.token,
});

// 需要在浏览器中渲染的文件类型 → 改为 inline
const RENDERABLE_EXTENSIONS = new Set([
  ".html", ".css", ".js", ".json", ".xml", ".svg",
  ".ico", ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
]);

function getContentType(key) {
  const ext = key.substring(key.lastIndexOf(".")).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".eot": "application/vnd.ms-fontobject",
  };
  return types[ext] || "application/octet-stream";
}

async function listAllObjects(prefix = "") {
  const allObjects = [];
  let marker = undefined;

  do {
    const result = await new Promise((resolve, reject) => {
      cos.getBucket(
        {
          Bucket: BUCKET,
          Region: REGION,
          Prefix: prefix,
          Marker: marker,
          MaxKeys: 1000,
        },
        (err, data) => (err ? reject(err) : resolve(data))
      );
    });

    allObjects.push(...(result.Contents || []));
    marker = result.NextMarker;
  } while (marker);

  return allObjects;
}

async function fixObject(key) {
  const ext = key.substring(key.lastIndexOf(".")).toLowerCase();
  if (!RENDERABLE_EXTENSIONS.has(ext)) return { key, skipped: true, reason: "非渲染型文件" };

  const contentType = getContentType(key);

  return new Promise((resolve) => {
    // 使用 copyObject 来更新元数据（COS 不支持直接修改元数据）
    cos.putObjectCopy(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        CopySource: `${BUCKET}.cos.${REGION}.myqcloud.com/${encodeURIComponent(key)}`,
        Headers: {
          "Content-Disposition": "inline",
          "Content-Type": contentType,
        },
        MetadataDirective: "Replaced",
      },
      (err) => {
        if (err) {
          resolve({ key, success: false, error: err.message });
        } else {
          resolve({ key, success: true });
        }
      }
    );
  });
}

async function main() {
  console.log(`🔧 修复 COS 对象 Content-Disposition 头信息`);
  console.log(`   Bucket: ${BUCKET}`);
  console.log(`   Region: ${REGION}`);
  console.log();

  console.log("📋 列出所有对象...");
  const objects = await listAllObjects();
  console.log(`   找到 ${objects.length} 个对象`);

  const toFix = objects.filter(o =>
    RENDERABLE_EXTENSIONS.has(
      o.Key.substring(o.Key.lastIndexOf(".")).toLowerCase()
    )
  );
  console.log(`   其中 ${toFix.length} 个需要修复 Content-Disposition`);
  console.log();

  let fixed = 0, failed = 0, skipped = 0;

  for (const obj of toFix) {
    const result = await fixObject(obj.Key);
    if (result.skipped) {
      skipped++;
    } else if (result.success) {
      fixed++;
      if (fixed % 20 === 0 || fixed <= 5) {
        console.log(`   ✅ [${fixed}/${toFix.length}] ${result.key}`);
      }
    } else {
      failed++;
      console.error(`   ❌ ${result.key}: ${result.error}`);
    }
  }

  console.log();
  console.log(`🎉 完成！修复 ${fixed} 个，跳过 ${skipped} 个，失败 ${failed} 个`);

  if (fixed > 0) {
    console.log();
    console.log("💡 提示：CDN 缓存可能需要几分钟刷新。");
    console.log("   可以用 curl -I <URL> 验证 Content-Disposition 是否已变为 inline。");
  }
}

main().catch((err) => {
  console.error("执行失败:", err.message);
  console.error(err);
  process.exit(1);
});
