"use client";

import { useState, useEffect } from "react";
import { fetchAdminData, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

export default function AdminUsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const data = await fetchAdminData("users"); setItems(data); } catch {}
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除该用户？其留言和回答将保留。")) return;
    const r = await deleteFromCMS("users", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">👥 用户管理</h1>
          <p className="text-sm text-gray-400 mt-1">共 {items.length} 个用户</p>
        </div>
      </div>

      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-green-900/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">用户名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">用户ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">注册时间</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    <span className="text-3xl block mb-2">👥</span>
                    暂无注册用户
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id || item._id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-leaf flex items-center justify-center text-white text-xs font-medium">
                          {item.username ? item.username[0] : "?"}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-green-100">{item.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono hidden sm:table-cell">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.createdAt ? item.createdAt.slice(0, 10) : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 text-sm">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
