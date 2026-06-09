"use client";

// v2 — public site admin login
import { useState } from "react";
import { Leaf, Lock, Settings } from "lucide-react";
import { setCMSApi } from "@/lib/api";

const DEFAULT_CMS_API = process.env.NEXT_PUBLIC_CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [cmsApi, setCmsApi] = useState(DEFAULT_CMS_API);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // 保存 CMS API 地址到全局
      if (cmsApi) {
        setCMSApi(cmsApi);
      }

      const apiBase = cmsApi || "";

      // 如果有 CMS API 地址，远程验证密码
      if (apiBase) {
        const res = await fetch(`${apiBase}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error || "密码错误");
          setLoading(false);
          return;
        }
      } else {
        // 没有配置 CMS API 时无法验证
        setError("CMS API 未配置，请在 API 设置中填写地址");
        setLoading(false);
        return;
      }

      // 设置 cookies（Secure + SameSite 防 CSRF 和中间人攻击）
      // 注意：由于需要通过 JS 读取 cms_password，无法设置 HttpOnly
      // 生产环境务必启用 HTTPS（CloudBase 默认支持）
      document.cookie = `cms_password=${encodeURIComponent(password)};path=/;max-age=86400;Secure;SameSite=Strict`;
      document.cookie = "admin_token=authenticated;path=/;max-age=86400;Secure;SameSite=Strict";
      if (apiBase) {
        document.cookie = `cms_api=${encodeURIComponent(apiBase)};path=/;max-age=86400;Secure;SameSite=Strict`;
      }

      window.location.href = "/admin/plants";
    } catch (err: any) {
      setError(`网络错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-[#0f1a14] dark:to-[#0a1a10]">
      <div className="w-full max-w-sm mx-4">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 dark:bg-[#1a2e22] dark:ring-white/5">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-leaf text-white shadow-lg">
                <Leaf className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">后台管理</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">阳台小园丁 · 内容管理系统</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-green-200 mb-1">
                <Lock className="h-4 w-4 inline mr-1" />
                管理密码
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="请输入密码"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100"
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              id="admin-login-btn"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "验证中..." : "登录"}
            </button>

            {/* 高级设置：配置 CMS API 地址 */}
            <div className="text-center">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Settings className="h-3 w-3" />
                {showSettings ? "收起设置" : "API 设置"}
              </button>
            </div>

            {showSettings && (
              <div className="pt-2 border-t border-gray-100 dark:border-green-900/30">
                <label className="block text-xs font-medium text-gray-500 dark:text-green-300 mb-1">
                  CMS API 地址（可选）
                </label>
                <input
                  type="url"
                  value={cmsApi}
                  onChange={(e) => setCmsApi(e.target.value)}
                  placeholder="https://xxx.service.tcloudbase.com/api/cms"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100"
                />
                <p className="mt-1 text-xs text-gray-400">
                  不填则使用默认密码本地验证，数据使用静态 JSON（构建时生成）
                </p>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              请使用管理员密码登录
            </p>
          </div>
        </div>
      </div>

      {/* 原生 JS 兜底：即使 React 水合失败也能登录 */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var CMS_API = '${DEFAULT_CMS_API}';
          function doLogin() {
            var pw = document.getElementById('admin-password')?.value;
            if (!pw) return;
            var btn = document.getElementById('admin-login-btn');
            if (btn) { btn.textContent = '验证中...'; btn.disabled = true; }
            fetch(CMS_API + '/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: pw })
            }).then(function(r) {
              if (!r.ok) { if(btn){btn.textContent='登录';btn.disabled=false;} alert('密码错误'); return; }
              document.cookie = 'cms_password=' + encodeURIComponent(pw) + ';path=/;max-age=86400;Secure;SameSite=Strict';
              document.cookie = 'admin_token=authenticated;path=/;max-age=86400;Secure;SameSite=Strict';
              document.cookie = 'cms_api=' + encodeURIComponent(CMS_API) + ';path=/;max-age=86400;Secure;SameSite=Strict';
              window.location.href = '/admin/plants';
            }).catch(function() {
              if(btn){btn.textContent='登录';btn.disabled=false;}
            });
          }
          // Both click handler and Enter key
          document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById('admin-login-btn');
            var input = document.getElementById('admin-password');
            if (btn) btn.addEventListener('click', doLogin);
            if (input) input.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
            // Auto-trigger on button click (in case React never attaches)
            setTimeout(function() {
              if (btn && !btn._reactAttached) btn.addEventListener('click', doLogin);
            }, 2000);
          });
        })();
      ` }} />
    </div>
  );
}
