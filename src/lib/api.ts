/**
 * 数据加载工具
 *
 * 策略（双重获取，谁先返回用谁）：
 * 1. 优先从 CloudBase CMS API 获取（实时数据）
 * 2. 同时从 /public/data/*.json 获取（静态构建数据，作为 fallback）
 *
 * 管理员在后台上传/编辑数据后，前端刷新即可看到最新内容。
 */

// ============ 配置 ============
// CloudBase CMS API 地址
// 开发环境可以配置 VITE_CMS_API 环境变量覆盖
// 不配置时使用在线地址
// 硬编码兜底 URL —— 确保即使 cookie 和构建变量都为空也能正常工作
const HARDCODED_CMS_API =
  'https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms';

const CMS_API_BASE =
  typeof window !== 'undefined'
    ? (window as any).__CMS_API__ || process.env.NEXT_PUBLIC_CMS_API || HARDCODED_CMS_API
    : '';

// 集合名称映射：前端用的名字 -> API 路径
const COLLECTION_MAP: Record<string, string> = {
  plants: 'plants',
  guides: 'guides',
  diary: 'diary',
  products: 'products',
  announcements: 'announcements',
  homepage: 'homepage',
  settings: 'settings',
  comments: 'comments',
  qa: 'qa',
  users: 'users',
};

// ============ 缓存 ============
const cache: Record<string, any[]> = {};

// ============ CMS API 客户端 ============

/** 从 CloudBase CMS API 获取数据（带超时和重试） */
async function fetchFromCMS<T>(collection: string): Promise<T[] | null> {
  const apiName = COLLECTION_MAP[collection];
  if (!apiName) return null;

  // 如果未配置 CMS API 地址，跳过
  if (!CMS_API_BASE) return null;

  // 最多重试 2 次
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const url = `${CMS_API_BASE}/${apiName}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8秒超时

      const res = await fetch(url, {
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return null;

      const json = await res.json();
      // CloudBase API 返回 { code: 0, data: [...] }
      if (json.code === 0 && Array.isArray(json.data)) {
        return json.data;
      }
      // 也可能是直接返回数组
      if (Array.isArray(json)) return json;
      return null;
    } catch {
      // 第一次失败，等 500ms 再重试
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  return null;
}

/** 从静态 JSON 文件获取数据 */
async function fetchFromJSON<T>(name: string): Promise<T[]> {
  try {
    const res = await fetch(`/data/${name}.json`, { cache: 'no-cache' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * 加载数据
 *
 * 双重获取策略：
 * - 同时发起 CMS API 和静态 JSON 请求
 * - 哪个先返回就用哪个（CMS API 数据优先缓存）
 * - 如果 CMS API 返回数据，即使 JSON 先返回也会覆盖
 */
export async function loadJSON<T>(
  name: string,
  options?: { preferCMS?: boolean }
): Promise<T[]> {
  // 缓存命中直接返回
  if (cache[name]) return cache[name];

  // 默认优先使用 CMS API
  const prefer = options?.preferCMS ?? true;

  let result: T[] = [];

  if (prefer && CMS_API_BASE) {
    // 先获取静态 JSON（快），同时尝试 CMS API（带 3s 超时避免长时间白屏）
    const jsonPromise = fetchFromJSON(name);
    const cmsPromise = Promise.race([
      fetchFromCMS<T>(name),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);

    const [cmsData, jsonData] = await Promise.all([cmsPromise, jsonPromise]);

    // CMS API 优先
    if (cmsData && cmsData.length > 0) {
      result = cmsData as T[];
    } else if (jsonData.length > 0) {
      result = jsonData as T[];
    }
    // 如果 CMS 为空但之前缓存过，保留缓存数据
    if (result.length === 0 && cache[name]) {
      result = cache[name];
    }
  } else {
    // 只从 JSON 获取
    result = (await fetchFromJSON(name)) as T[];
  }

  // 过滤掉草稿内容（前台只显示已发布）
  result = result.filter((item: any) => item.status !== "draft");

  if (result.length > 0) {
    cache[name] = result;
  }

  return result;
}

/** 获取单个文档（按 id 或 slug） */
export async function loadSingle<T extends { id?: string; slug?: string }>(
  collection: string,
  key: string
): Promise<T | null> {
  const items = await loadJSON<T>(collection);
  return (
    items.find(
      (item) => item.id === key || (item as any).slug === key
    ) || null
  );
}

// ============ CMS API 写操作（在管理后台使用） ============

/**
 * 获取后台数据（优先从 CMS API 获取）
 * 如果 CMS API 不可用，回退到静态 JSON
 */
export async function fetchAdminData(collection: string): Promise<any[]> {
  const apiName = COLLECTION_MAP[collection];

  if (CMS_API_BASE) {
    try {
      const res = await fetch(`${CMS_API_BASE}/${apiName}?sort=_updatedAt,desc`, {
        cache: 'no-cache',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0 && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // fallback to JSON
    }
  }

  // fallback
  return fetchFromJSON(collection);
}

/**
 * 保存数据到 CMS API
 * @returns { success, message }
 */
export async function saveToCMS(
  collection: string,
  records: any[]
): Promise<{ success: boolean; message: string }> {
  const apiName = COLLECTION_MAP[collection];
  const password = getAdminPassword();

  if (!password) {
    return { success: false, message: '未登录，请先登录' };
  }

  if (!CMS_API_BASE) {
    return { success: false, message: 'CMS API 未配置' };
  }

  try {
    // CloudBase MongoDB 不支持批量更新文档
    // 采取策略：遍历每条记录，判断是新增还是更新
    let okCount = 0;
    let failCount = 0;

    for (const record of records) {
      if (record.id) {
        // 检查是否存在
        const checkRes = await fetch(`${CMS_API_BASE}/${apiName}/${record.id}`, {
          method: 'GET',
        });
        const checkJson = await checkRes.json();

        if (checkJson.code === 0 && checkJson.data) {
          // 已存在 → 更新
          const upRes = await fetch(`${CMS_API_BASE}/${apiName}/${record.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Cms-Password': password,
              'Authorization': `Bearer ${password}`,
            },
            body: JSON.stringify(record),
          });
          if (upRes.ok) okCount++;
          else failCount++;
        } else {
          // 不存在 → 新增
          const addRes = await fetch(`${CMS_API_BASE}/${apiName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Cms-Password': password,
              'Authorization': `Bearer ${password}`,
            },
            body: JSON.stringify(record),
          });
          if (addRes.ok) okCount++;
          else failCount++;
        }
      }
    }

    await clearCache(collection);
    return {
      success: true,
      message: `操作完成: ${okCount} 条成功, ${failCount} 条失败`,
    };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

/**
 * 删除 CMS 中的一条记录
 */
export async function deleteFromCMS(
  collection: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const apiName = COLLECTION_MAP[collection];
  const password = getAdminPassword();

  if (!password) return { success: false, message: '未登录' };
  if (!CMS_API_BASE) return { success: false, message: 'CMS API 未配置' };

  try {
    const res = await fetch(`${CMS_API_BASE}/${apiName}/${id}`, {
      method: 'DELETE',
      headers: { 'X-Cms-Password': password },
    });
    const json = await res.json();
    await clearCache(collection);
    return json.code === 0
      ? { success: true, message: '删除成功' }
      : { success: false, message: json.error || '删除失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

// ============ 辅助函数 ============

/** 从 cookie 中获取管理密码 */
function getAdminPassword(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/cms_password=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * 公开提交数据（无需认证，用于留言和问答）
 * @returns { success, message, data }
 */
export async function submitToCMS(
  collection: string,
  record: any
): Promise<{ success: boolean; message: string; data?: any }> {
  const apiName = COLLECTION_MAP[collection];

  if (!CMS_API_BASE) {
    return { success: false, message: 'CMS API 未配置' };
  }

  try {
    const res = await fetch(`${CMS_API_BASE}/${apiName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    const json = await res.json();
    if (json.code === 0) {
      await clearCache(collection);
      return { success: true, message: '提交成功', data: json.data };
    }
    return { success: false, message: json.error || '提交失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

/**
 * 提交回答（无需认证）
 * @returns { success, message, data }
 */
export async function submitAnswer(
  questionId: string,
  answer: { author: string; content: string }
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!CMS_API_BASE) {
    return { success: false, message: 'CMS API 未配置' };
  }

  try {
    const res = await fetch(`${CMS_API_BASE}/qa/${questionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer),
    });
    const json = await res.json();
    if (json.code === 0) {
      return { success: true, message: '回答成功', data: json.data };
    }
    return { success: false, message: json.error || '回答失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

/** 清空缓存 */
export function clearCache(name?: string) {
  if (name) delete cache[name];
  else Object.keys(cache).forEach((k) => delete cache[k]);
}

/** 设置 CMS API 地址（可在 admin 页面动态设置） */
export function setCMSApi(url: string) {
  if (typeof window !== 'undefined') {
    (window as any).__CMS_API__ = url;
  }
}

/** 获取当前 CMS API 地址（含三层兜底：window → 构建变量 → 硬编码） */
export function getCMSApiUrl(): string {
  if (typeof window === 'undefined') return '';
  return (window as any).__CMS_API__ || process.env.NEXT_PUBLIC_CMS_API || HARDCODED_CMS_API;
}

/** 获取当前 CMS 管理密码（从 cookie 读取） */
export function getCMSPassword(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/cms_password=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/** 获取用户 token（从 cookie 读取） */
export function getUserToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/user_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/** 设置用户 token cookie（7天过期） */
export function setUserToken(token: string) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `user_token=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

/** 清除用户 token */
export function clearUserToken() {
  if (typeof document === 'undefined') return;
  document.cookie = 'user_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'user_username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

/**
 * 注册新用户
 */
export async function register(
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  if (!CMS_API_BASE) return { success: false, message: 'CMS API 未配置' };
  try {
    const res = await fetch(`${CMS_API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (json.code === 0) return { success: true, message: '注册成功' };
    return { success: false, message: json.error || '注册失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

/**
 * 用户登录
 */
export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  if (!CMS_API_BASE) return { success: false, message: 'CMS API 未配置' };
  try {
    const res = await fetch(`${CMS_API_BASE}/login-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (json.code === 0 && json.data?.token) {
      setUserToken(json.data.token);
      if (typeof document !== 'undefined') {
        document.cookie = `user_username=${encodeURIComponent(json.data.username)}; path=/; SameSite=Lax; Secure`;
      }
      return { success: true, message: '登录成功' };
    }
    return { success: false, message: json.error || '登录失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}

/**
 * 获取当前登录用户信息（完整资料）
 */
export async function getCurrentUser(): Promise<{
  username: string;
  nickname: string;
  bio: string;
  createdAt: string;
} | null> {
  const token = getUserToken();
  if (!token || !CMS_API_BASE) return null;
  try {
    const res = await fetch(`${CMS_API_BASE}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.code === 0 && json.data) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 更新当前用户资料（昵称、签名）
 */
export async function updateProfile(data: {
  nickname?: string;
  bio?: string;
}): Promise<{ success: boolean; message: string }> {
  const token = getUserToken();
  if (!token || !CMS_API_BASE) return { success: false, message: '未登录' };
  try {
    const res = await fetch(`${CMS_API_BASE}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.code === 0) return { success: true, message: '更新成功' };
    return { success: false, message: json.error || '更新失败' };
  } catch (err: any) {
    return { success: false, message: `网络错误: ${err.message}` };
  }
}
