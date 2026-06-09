/**
 * 阳台小园丁 - CloudBase CMS 云函数
 *
 * 路由：
 *   GET  /api/cms/:collection          — 获取集合所有文档
 *   GET  /api/cms/:collection/:id      — 获取单个文档
 *   POST /api/cms/:collection          — 新增文档（需密码）
 *   PUT  /api/cms/:collection/:id      — 更新文档（需密码）
 *   DELETE /api/cms/:collection/:id    — 删除文档（需密码）
 *   POST /api/cms/login                — 登录验证
 *
 * 集合：plants, guides, diary, products
 *
 * 部署到腾讯云 CloudBase 云函数（SCF），
 * 配置 HTTP 访问路径为 /api/cms
 */

'use strict';

const crypto = require('crypto');

// ============ 配置 ============
// 管理密码 — 必须在 CloudBase 控制台环境变量中设置 CMS_ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

// CloudBase 数据库实例（通过 TCB SDK 获取）
const tcb = require('@cloudbase/node-sdk');

// 初始化 TCB
const app = tcb.init({
  env: process.env.TCB_ENV || process.env.SCF_TCB_ENV,
});

const db = app.database();
const _ = db.command;

// ============ GitHub Actions 自动部署 ============
const GITHUB_REPO = 'ylfnevergiveup/yangtaixiaoyuanding';
let deployTimer = null;
let deployPatCache = null;

/** 获取 DEPLOY_PAT — 环境变量优先，否则使用内置值 */
async function getDeployPat() {
  if (process.env.DEPLOY_PAT) return process.env.DEPLOY_PAT;
  if (deployPatCache) return deployPatCache;
  // 从数据库 settings 读取（可在运行时更新）
  try {
    const settingsColl = db.collection('settings');
    const res = await settingsColl.where({ id: 'deploy-config' }).limit(1).get();
    if (res.data && res.data.length > 0 && res.data[0].pat) {
      deployPatCache = res.data[0].pat;
      return deployPatCache;
    }
  } catch (e) {
    console.log('[Deploy] Failed to read PAT from DB:', e.message);
  }
  return null;
}

/** 写操作成功后触发 GitHub Actions 部署（3 秒防抖，合并连续写入） */
async function triggerDeploy() {
  const pat = await getDeployPat();
  if (!pat) return;
  if (deployTimer) clearTimeout(deployTimer);
  deployTimer = setTimeout(async () => {
    try {
      const https = require('https');
      const body = JSON.stringify({ event_type: 'cms-updated' });
      const req = https.request({
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_REPO}/dispatches`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'CloudBase-CMS/1.0',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 5000,
      }, (res) => {
        console.log(`[Deploy] GitHub dispatch status: ${res.statusCode}`);
      });
      req.on('error', (e) => console.log('[Deploy] GitHub dispatch error:', e.message));
      req.write(body);
      req.end();
    } catch (e) {
      console.log('[Deploy] Error:', e.message);
    }
  }, 3000);
}

// 允许的集合白名单
const ALLOWED_COLLECTIONS = ['plants', 'guides', 'diary', 'products', 'upload', 'announcements', 'homepage', 'analytics', 'settings', 'comments', 'qa', 'users', 'register', 'login-user', 'me'];

// 允许公开提交的集合（无需认证即可 POST）
const PUBLIC_COLLECTIONS = ['comments', 'qa', 'users'];

// ============ 频率限制（内存滑动窗口） ============
const rateLimitMap = new Map();

// 每 60 秒清理一次过期记录
const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

/**
 * 简易 IP 频率限制
 * @param {string} ip - 客户端 IP
 * @param {number} maxRequests - 窗口内最大请求数
 * @param {number} windowMs - 时间窗口（毫秒）
 * @returns {{ allowed: boolean, remaining: number }}
 */
function checkRateLimit(ip, maxRequests = 60, windowMs = 60 * 1000) {
  const now = Date.now();

  // 定期清理过期数据
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, entry] of rateLimitMap) {
      if (now - entry.windowStart > windowMs * 2) {
        rateLimitMap.delete(key);
      }
    }
    lastCleanup = now;
  }

  const key = `${ip}`;
  let entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // 新窗口
    entry = { windowStart: now, count: 0 };
    rateLimitMap.set(key, entry);
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining };
}

/**
 * 提取客户端 IP
 */
function getClientIP(event) {
  return (
    event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers?.['x-real-ip'] ||
    'unknown'
  );
}

// ============ 注册频率限制（数据库查 IP） ============

/**
 * 检查注册频率限制（跨实例生效）
 * - 查询 users 集合中同一 IP 24 小时内是否已注册
 * - 数据库级别判断，不受 SCF 多实例影响
 * @param {string} ip
 * @returns {Promise<{ allowed: boolean, message?: string }>}
 */
async function checkRegisterLimit(ip) {
  try {
    const usersColl = db.collection('users');
    const result = await usersColl.limit(200).get();

    if (result.data && result.data.length > 0) {
      const oneDayAgo = Date.now() - 24 * 3600 * 1000;
      const recent = result.data.filter((u) => {
        if (!u.registerIP) return false;
        const created = u._createdAt || u.createdAt;
        if (!created) return false;
        if (u.registerIP !== ip) return false;
        return new Date(created).getTime() > oneDayAgo;
      });

      if (recent.length > 0) {
        return { allowed: false, message: '每个 IP 每天限注册 1 次，请明天再试' };
      }
    }

    return { allowed: true };
  } catch (err) {
    console.error('checkRegisterLimit error:', err.message || err);
    return { allowed: true };
  }
}

// ============ 安全响应包装 ============
/**
 * 统一错误响应（不泄露内部细节）
 */
function safeError(code, publicMessage) {
  return { code, error: publicMessage };
}

/**
 * 统一成功响应
 */
function safeResponse(data) {
  return { code: data.code != null ? data.code : 0, ...data };
}

// ============ 工具函数 ============

/** 简单密码验证 */
function checkAuth(headers) {
  const auth = headers['X-Cms-Password'] || headers['x-cms-password'] || '';
  // 也可以从 Authorization: Bearer <password> 读取
  const bearer = (headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  return auth === ADMIN_PASSWORD || bearer === ADMIN_PASSWORD;
}

/** 生成 ID */
function generateId(name) {
  if (!name) return crypto.randomBytes(8).toString('hex');
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-龥-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============ 路由处理 ============

function parsePath(path) {
  // 去掉 /api/cms 前缀（CloudBase HTTP 触发时会带上这个前缀）
  let cleanPath = path.replace(/^\/api\/cms\/?/, '/');
  // path: /plants, /plants/123, /qa/123/answer
  const parts = cleanPath.replace(/^\/+/, '').split('/');
  const collection = parts[0];
  const id = parts[1];
  return { collection, id, parts };
}

async function handleRequest(event) {
  const { path, httpMethod, headers, body, queryString } = event;
  const { collection, id, parts } = parsePath(path);

  // ====== 频率限制 ======
  const clientIP = getClientIP(event);
  const isWriteOp = ['POST', 'PUT', 'DELETE'].includes(httpMethod);

  // 写操作：每分钟最多 30 次（防止暴力破解和垃圾提交）
  // 读操作：每分钟最多 120 次（正常浏览足够，防恶意刷量）
  const writeLimit = checkRateLimit(`write:${clientIP}`, 30, 60 * 1000);
  const readLimit = checkRateLimit(`read:${clientIP}`, 120, 60 * 1000);

  if (isWriteOp) {
    if (!writeLimit.allowed) {
      return safeError(429, '请求过于频繁，请稍后再试');
    }
  } else {
    if (!readLimit.allowed) {
      return safeError(429, '请求过于频繁，请稍后再试');
    }
  }

  // === 图片 URL 刷新（公开，从 cloudPath 生成新签名 URL）===
  if (collection === 'image-url' && httpMethod === 'GET') {
    try {
      // CloudBase SCF HTTP 触发器：兼容 v1 (queryString 对象) 和 v2 (queryStringParameters 对象)
      const params = queryString || event.queryStringParameters || {};
      let cloudPath = params.path || '';

      // 如果上面都拿不到，尝试从 rawPath 中手动解析
      if (!cloudPath && event.rawPath) {
        const url = new URL(event.rawPath, 'http://localhost');
        cloudPath = url.searchParams.get('path') || '';
      }

      if (!cloudPath) {
        console.error('image-url: missing path param. Event keys:', Object.keys(event));
        return safeError(400, '缺少 path 参数');
      }

      // 构造 fileID：cloud://envId.bucket/cloudPath
      const fileID = `cloud://${process.env.TCB_ENV || process.env.SCF_TCB_ENV}.7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930/${cloudPath}`;

      const urlResult = await app.getTempFileURL({
        fileList: [fileID],
        maxAge: 86400, // 24 小时有效期（短有效期，按需刷新）
      });

      const freshUrl = urlResult.fileList[0]?.tempFileURL;
      if (!freshUrl) {
        return safeError(404, '图片不存在');
      }

      return safeResponse({ code: 0, data: { url: freshUrl, fileID, cloudPath } });
    } catch (err) {
      console.error('Image URL error:', err);
      return safeError(500, '图片加载失败');
    }
  }

  // === 登录 ===
  if (collection === 'login' && httpMethod === 'POST') {
    if (!ADMIN_PASSWORD) {
      console.error('CMS_ADMIN_PASSWORD 环境变量未设置！');
      return safeError(500, '服务器配置错误');
    }
    const { password } = JSON.parse(body || '{}');
    if (password === ADMIN_PASSWORD) {
      return safeResponse({ code: 0, data: { token: ADMIN_PASSWORD, message: 'ok' } });
    }
    return safeError(401, '密码错误');
  }

  // === 用户注册 ===
  if (collection === 'register' && httpMethod === 'POST') {
    try {
      // IP 注册频率限制（数据库级别，跨实例生效）
      const regIp = getClientIP(event);
      const regLimit = await checkRegisterLimit(regIp);
      if (!regLimit.allowed) {
        return safeError(429, regLimit.message || '注册过于频繁，请稍后再试');
      }

      const { username, password } = JSON.parse(body || '{}');
      if (!username || !password) {
        return { code: 400, error: '请填写用户名和密码' };
      }
      if (username.length < 2 || username.length > 20) {
        return { code: 400, error: '用户名需2-20个字符' };
      }
      if (password.length < 6) {
        return { code: 400, error: '密码至少6位' };
      }

      // 用户名格式校验：防止脚本批量生成的随机字符串
      if (!/^[\w一-鿿㐀-䶿]{2,20}$/.test(username)) {
        return { code: 400, error: '用户名只能包含中文、字母、数字和下划线' };
      }

      const usersColl = db.collection('users');
      // 检查用户名是否已存在
      const exist = await usersColl.where({ username }).get();
      if (exist.data && exist.data.length > 0) {
        return { code: 400, error: '用户名已存在' };
      }
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
      const now = new Date().toISOString();
      const user = {
        id: 'user-' + crypto.randomBytes(6).toString('hex'),
        username,
        nickname: username, // 默认昵称等于用户名
        bio: '',            // 默认空签名
        passwordHash: hash,
        salt,
        token: '',
        createdAt: now,
        registerIP: regIp, // 记录注册 IP，便于审计和事后封禁
      };
      await usersColl.add(user);
      return safeResponse({ code: 0, message: '注册成功' });
    } catch (err) {
      console.error('Register error:', err);
      return safeError(500, '服务器内部错误');
    }
  }

  // === 用户登录 ===
  if (collection === 'login-user' && httpMethod === 'POST') {
    try {
      const { username, password } = JSON.parse(body || '{}');
      if (!username || !password) {
        return safeError(400, '请填写用户名和密码');
      }
      const usersColl = db.collection('users');
      const result = await usersColl.where({ username }).get();
      if (!result.data || result.data.length === 0) {
        return safeError(401, '用户名或密码错误');
      }
      const user = result.data[0];
      const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha256').toString('hex');
      if (hash !== user.passwordHash) {
        return safeError(401, '用户名或密码错误');
      }
      const token = crypto.randomBytes(32).toString('hex');
      await usersColl.where({ id: user.id }).update({ token });
      return safeResponse({
        code: 0,
        data: {
          token,
          username: user.username,
          nickname: user.nickname || user.username,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return safeError(500, '服务器内部错误');
    }
  }

  // === 获取当前用户 ===
  if (collection === 'me' && httpMethod === 'GET') {
    try {
      const bearer = (headers['authorization'] || '').replace(/^Bearer\s+/i, '');
      if (!bearer) {
        return safeError(401, '未登录');
      }
      const usersColl = db.collection('users');
      const result = await usersColl.where({ token: bearer }).get();
      if (!result.data || result.data.length === 0) {
        return safeError(401, '登录已过期，请重新登录');
      }
      const user = result.data[0];
      return safeResponse({
        code: 0,
        data: {
          username: user.username,
          nickname: user.nickname || user.username,
          bio: user.bio || '',
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error('Me error:', err);
      return safeError(500, '服务器内部错误');
    }
  }

  // === 更新当前用户资料 ===
  if (collection === 'me' && httpMethod === 'PUT') {
    try {
      const bearer = (headers['authorization'] || '').replace(/^Bearer\s+/i, '');
      if (!bearer) {
        return safeError(401, '未登录');
      }
      const usersColl = db.collection('users');
      const result = await usersColl.where({ token: bearer }).get();
      if (!result.data || result.data.length === 0) {
        return safeError(401, '登录已过期，请重新登录');
      }
      const user = result.data[0];
      const bodyData = JSON.parse(body || '{}');
      const updates = {};
      if (bodyData.nickname !== undefined) {
        if (typeof bodyData.nickname !== 'string' || bodyData.nickname.length < 1 || bodyData.nickname.length > 30) {
          return safeError(400, '昵称需1-30个字符');
        }
        updates.nickname = bodyData.nickname.trim();
      }
      if (bodyData.bio !== undefined) {
        if (typeof bodyData.bio !== 'string' || bodyData.bio.length > 200) {
          return safeError(400, '签名不能超过200个字符');
        }
        updates.bio = bodyData.bio.trim();
      }
      if (Object.keys(updates).length === 0) {
        return safeError(400, '没有可更新的字段');
      }
      updates._updatedAt = new Date().toISOString();
      await usersColl.where({ id: user.id }).update(updates);
      return safeResponse({
        code: 0,
        data: {
          nickname: updates.nickname !== undefined ? updates.nickname : (user.nickname || user.username),
          bio: updates.bio !== undefined ? updates.bio : (user.bio || ''),
        },
        message: '更新成功',
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return safeError(500, '服务器内部错误');
    }
  }

  // === 访问统计 ===
  if (collection === 'analytics') {
    if (httpMethod === 'POST') {
      // 记录页面访问
      try {
        const { path, referrer } = JSON.parse(body || '{}');
        if (!path) return safeError(400, '缺少 path');

        const today = new Date().toISOString().slice(0, 10);
        const coll = db.collection('analytics');
        const stat = await coll.where({ id: 'stats' }).get();
        let doc;

        if (stat.data && stat.data.length > 0) {
          doc = stat.data[0];
        } else {
          doc = { id: 'stats', totalPV: 0, totalUV: 0, pages: {}, daily: {}, referrers: {}, visitors: {} };
        }

        // 总 PV
        doc.totalPV = (doc.totalPV || 0) + 1;

        // 页面 PV
        doc.pages = doc.pages || {};
        doc.pages[path] = (doc.pages[path] || 0) + 1;

        // 每日 PV
        doc.daily = doc.daily || {};
        doc.daily[today] = (doc.daily[today] || 0) + 1;

        // 来源统计
        doc.referrers = doc.referrers || {};
        const ref = referrer && referrer !== '' ? new URL(referrer).hostname : 'direct';
        doc.referrers[ref] = (doc.referrers[ref] || 0) + 1;

        // 简单去重：用 IP 前两段估算 UV
        const ip = (event.headers?.['x-forwarded-for'] || event.headers?.['x-real-ip'] || 'unknown').split('.')[0];
        const visitorKey = `${ip}-${event.headers?.['user-agent']?.slice(0, 50) || 'unknown'}`;
        const visitors = doc.visitors || {};
        if (!visitors[today]) visitors[today] = [];
        if (!visitors[today].includes(visitorKey)) {
          visitors[today].push(visitorKey);
          doc.totalUV = (doc.totalUV || 0) + 1;
        }
        // 只保留最近 30 天的访客数据
        const visitorKeys = Object.keys(visitors).sort();
        if (visitorKeys.length > 30) {
          delete visitors[visitorKeys[0]];
        }
        doc.visitors = visitors;

        doc._updatedAt = new Date().toISOString();

        if (doc._id) {
          const { _id, ...updateData } = doc;
          await coll.where({ id: 'stats' }).update(updateData);
        } else {
          await coll.add(doc);
        }

        return safeResponse({ code: 0, data: { totalPV: doc.totalPV } });
      } catch (err) {
        console.error('Analytics error:', err);
        return safeError(500, '服务器内部错误');
      }
    }

    if (httpMethod === 'GET') {
      // 获取统计数据
      try {
        const coll = db.collection('analytics');
        const stat = await coll.where({ id: 'stats' }).get();
        if (stat.data && stat.data.length > 0) {
          const doc = stat.data[0];
          // 不返回敏感的 visitors 详情
          const { visitors, _id, ...safe } = doc;
          return safeResponse({ code: 0, data: safe });
        }
        return safeResponse({ code: 0, data: { totalPV: 0, totalUV: 0, pages: {}, daily: {}, referrers: {} } });
      } catch (err) {
        console.error('Analytics get error:', err);
        return safeError(500, '服务器内部错误');
      }
    }

    return safeError(405, '不支持的请求方法');
  }

  // === 图片上传 ===
  if (collection === 'upload' && httpMethod === 'POST') {
    if (!checkAuth(headers)) {
      return safeError(401, '未授权，请检查登录状态');
    }
    try {
      let buffer, filename, ext;

      const contentType = headers['content-type'] || '';
      const isFormData = contentType.includes('multipart/form-data');

      if (isFormData) {
        // FormData 直传模式（推荐，无 base64 膨胀）
        const boundaryMatch = contentType.match(/boundary=([^;]+)/);
        if (!boundaryMatch) {
          return safeError(400, '请求格式错误');
        }
        const boundary = boundaryMatch[1].trim();

        // CloudBase SCF 对二进制内容会 base64 编码
        let rawBody = body;
        if (event.isBase64Encoded) {
          rawBody = Buffer.from(body, 'base64').toString('binary');
        }

        // 手动解析 multipart，提取文件内容
        const boundaryMarker = `--${boundary}`;
        const parts = rawBody.split(boundaryMarker);

        for (const part of parts) {
          if (part.includes('Content-Disposition: form-data')) {
            const headerEnd = part.indexOf('\r\n\r\n');
            if (headerEnd === -1) continue;

            const headers = part.substring(0, headerEnd);
            const fileContent = part.substring(headerEnd + 4);

            // 去掉尾部的 \r\n--
            const cleanContent = fileContent.replace(/\r\n--\r\n$/, '').replace(/\r\n--$/, '');

            // 提取文件名
            const filenameMatch = headers.match(/filename="([^"]*)"/);
            filename = filenameMatch ? filenameMatch[1] : 'image.jpg';

            buffer = Buffer.from(cleanContent, 'binary');
            break;
          }
        }

        if (!buffer) {
          return safeError(400, '未检测到文件数据');
        }
      } else {
        // JSON base64 模式（兼容旧版）
        const { filename: reqFilename, data: base64Data } = JSON.parse(body || '{}');
        if (!base64Data) {
          return safeError(400, '缺少图片数据');
        }
        filename = reqFilename || 'image.jpg';
        const pureBase64 = base64Data.replace(/^data:image\/[\w-]+;base64,/, '');
        buffer = Buffer.from(pureBase64, 'base64');
      }

      // 限制 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        return safeError(400, '图片不能超过 10MB');
      }

      // 验证是否为有效图片（检查 magic bytes）
      const validMagicBytes = [
        { ext: 'jpg', bytes: [0xFF, 0xD8, 0xFF] },
        { ext: 'png', bytes: [0x89, 0x50, 0x4E, 0x47] },
        { ext: 'gif', bytes: [0x47, 0x49, 0x46] },
        { ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] },
      ];
      let detectedExt = null;
      for (const magic of validMagicBytes) {
        if (magic.bytes.every((byte, i) => buffer[i] === byte)) {
          detectedExt = magic.ext;
          break;
        }
      }
      if (!detectedExt) {
        return safeError(400, '不支持的图片格式，仅支持 JPG、PNG、GIF、WebP');
      }

      ext = detectedExt;

      // 生成唯一文件名，按年月分目录便于管理
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const cloudPath = `images/${yearMonth}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;

      // 上传到 CloudBase 云存储
      const uploadResult = await app.uploadFile({
        cloudPath,
        fileContent: buffer,
      });

      // 获取下载链接（10 年有效期）
      const urlResult = await app.getTempFileURL({
        fileList: [uploadResult.fileID],
        maxAge: 315360000,
      });

      const imageUrl = urlResult.fileList[0].tempFileURL;
      console.log('Upload success:', cloudPath);

      return safeResponse({
        code: 0,
        data: {
          url: imageUrl,
          fileID: uploadResult.fileID,
          cloudPath,
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
      return safeError(500, '上传失败，请重试');
    }
  }

  // === 问答回答提交（公开，无需认证）===
  if (collection === 'qa' && id && parts[2] === 'answer' && httpMethod === 'POST') {
    try {
      const bodyData = JSON.parse(body || '{}');
      if (!bodyData.author || !bodyData.content) {
        return safeError(400, '请填写昵称和回答内容');
      }
      const coll = db.collection('qa');
      const qResult = await coll.where({ id }).get();
      if (!qResult.data || qResult.data.length === 0) {
        return safeError(404, '问题不存在');
      }
      const question = qResult.data[0];
      const answers = Array.isArray(question.answers) ? question.answers : [];
      const answerId = 'a' + crypto.randomBytes(6).toString('hex');
      const newAnswer = {
        id: answerId,
        content: bodyData.content,
        author: bodyData.author,
        date: new Date().toISOString().slice(0, 10),
        status: 'published',
      };
      answers.push(newAnswer);
      await coll.where({ id }).update({ answers, _updatedAt: new Date().toISOString() });
      return safeResponse({ code: 0, data: newAnswer, message: '回答成功' });
    } catch (err) {
      console.error('Answer error:', err);
      return safeError(500, '服务器内部错误');
    }
  }

  // === 校验集合名称 ===
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return safeError(404, '页面不存在');
  }

  const coll = db.collection(collection);

  switch (httpMethod) {
    // ======== GET: 查询 ========
    case 'GET': {
      if (id) {
        // 单个文档
        const result = await coll.where({ id }).get();
        if (result.data && result.data.length > 0) {
          const doc = result.data[0];
          // 未认证请求不能查看草稿
          if (doc.status === 'draft' && !checkAuth(headers)) {
            return safeError(404, '未找到');
          }
          return safeResponse({ code: 0, data: doc });
        }
        return safeError(404, '未找到');
      }

      // 列表 — 支持简单的 sorting 和 limit
      let query = coll;
      if (queryString && queryString.sort) {
        const [field, dir] = queryString.sort.split(',');
        // 自定义排序字段为主排序，_id 作为 tiebreaker
        query = query.orderBy(field, dir === 'desc' ? 'desc' : 'asc').orderBy('_id', 'desc');
      } else {
        // 默认按更新时间倒序，_id 作为 tiebreaker
        query = query.orderBy('_updatedAt', 'desc').orderBy('_id', 'desc');
      }
      const limit = Math.min(parseInt(queryString?.limit) || 200, 500);
      const skip = parseInt(queryString?.skip) || 0;
      const result = await query.skip(skip).limit(limit).get();
      // 未认证请求过滤草稿，已认证（管理员）返回全部
      const data = result.data || [];
      const filtered = checkAuth(headers) ? data : data.filter(item => item.status !== 'draft');
      return safeResponse({ code: 0, data: filtered });
    }

    // ======== POST: 新增（公开集合无需认证） ========
    case 'POST': {
      if (!PUBLIC_COLLECTIONS.includes(collection) && !checkAuth(headers)) {
        return safeError(401, '未授权');
      }
      const record = JSON.parse(body || '{}');

      // 用户注册特殊处理：密码哈希 + IP 限流
      if (collection === 'users') {
        // IP 注册频率限制（每天 1 次）
        const regIp = getClientIP(event);
        const regLimit = await checkRegisterLimit(regIp);
        if (!regLimit.allowed) {
          return safeError(429, regLimit.message || '注册过于频繁，请稍后再试');
        }

        if (!record.username || !record.password) {
          return safeError(400, '请填写用户名和密码');
        }
        if (record.username.length < 2 || record.username.length > 20) {
          return safeError(400, '用户名需2-20个字符');
        }
        if (record.password.length < 6) {
          return safeError(400, '密码至少6位');
        }
        // 用户名格式校验
        if (!/^[\w一-鿿㐀-䶿]{2,20}$/.test(record.username)) {
          return safeError(400, '用户名只能包含中文、字母、数字和下划线');
        }
        const exist = await coll.where({ username: record.username }).get();
        if (exist.data && exist.data.length > 0) {
          return safeError(400, '用户名已存在');
        }
        const salt = crypto.randomBytes(16).toString('hex');
        record.passwordHash = crypto.pbkdf2Sync(record.password, salt, 10000, 64, 'sha256').toString('hex');
        record.salt = salt;
        delete record.password;
        if (!record.id) {
          record.id = 'user-' + crypto.randomBytes(6).toString('hex');
        }
        record.registerIP = regIp; // 记录注册 IP
        record.nickname = record.nickname || record.username; // 默认昵称
        record.bio = record.bio || '';                        // 默认空签名
      }

      if (!record.id) {
        record.id = generateId(record.name || record.title);
      }
      record._updatedAt = new Date().toISOString();
      record._createdAt = record._createdAt || record._updatedAt;
      await coll.add(record);
      triggerDeploy(); // 触发自动部署
      return safeResponse({ code: 0, data: record, message: '新增成功' });
    }

    // ======== PUT: 更新（需认证） ========
    case 'PUT': {
      if (!checkAuth(headers)) {
        return safeError(401, '未授权');
      }
      if (!id) {
        return safeError(400, '缺少 ID');
      }
      const updates = JSON.parse(body || '{}');
      delete updates._id;
      delete updates.id;
      updates._updatedAt = new Date().toISOString();
      await coll.where({ id }).update(updates);
      triggerDeploy(); // 触发自动部署
      return safeResponse({ code: 0, message: '更新成功' });
    }

    // ======== DELETE: 删除（需认证） ========
    case 'DELETE': {
      if (!checkAuth(headers)) {
        return safeError(401, '未授权');
      }
      if (!id) {
        return safeError(400, '缺少 ID');
      }
      await coll.where({ id }).remove();
      triggerDeploy(); // 触发自动部署
      return safeResponse({ code: 0, message: '删除成功' });
    }

    default:
      return safeError(405, '不支持的请求方法');
  }
}

// ============ 云函数入口 ============
exports.main = async (event, context) => {
  try {
    const result = await handleRequest(event);
    return result;
  } catch (err) {
    console.error('CMS Error:', err);
    return safeError(500, '服务器内部错误');
  }
};
