"use client";

import { useState, useEffect } from "react";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

const emptyForm = {
  id: "", author: "", content: "", targetType: "plant", targetId: "",
  date: "", status: "published"
};

export default function AdminCommentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const data = await fetchAdminData("comments"); setItems(data); } catch {}
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setForm({
        id: item.id, author: item.author || "", content: item.content || "",
        targetType: item.targetType || "plant", targetId: item.targetId || "",
        date: item.date || "", status: item.status || "published"
      });
      setEditing(item);
    }
  };

  const handleSave = async () => {
    const data = { ...form };
    const result = await saveToCMS("comments", [data]);
    if (result.success) {
      setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
      setEditing(null); setMsg("✅ 保存成功！"); setTimeout(() => setMsg(""), 3000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const r = await deleteFromCMS("comments", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  const closeForm = () => { setEditing(null); };

  const filtered = filter === "all" ? items : items.filter((i: any) => i.status === filter);

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">💬 评论管理</h1>
          <p className="text-sm text-gray-400 mt-1">共 {items.length} 条</p>
        </div>
      </div>

      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[{ key: "all", label: "全部" }, { key: "published", label: "已发布" }, { key: "draft", label: "草稿" }].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${filter === f.key ? "bg-primary text-white" : "bg-white text-gray-500 ring-1 ring-gray-200 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/30"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-green-900/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">作者</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">内容</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">对象</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">日期</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <span className="text-3xl block mb-2">💬</span>
                    暂无评论
                  </td>
                </tr>
              ) : (
                filtered.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-green-100">{item.author}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[200px]">{item.content}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {item.targetType}/{item.targetId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{item.date}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "draft" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"}`}>
                        {item.status === "draft" ? "草稿" : "已发布"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openForm(item)} className="text-primary hover:text-primary-dark text-sm mr-2">编辑</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 text-sm">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10" onClick={closeForm}>
          <div className="w-full max-w-2xl mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark dark:text-green-200">编辑评论</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">作者</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">状态</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                    <option value="published">✅ 已发布</option>
                    <option value="draft">📝 草稿（隐藏）</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">评论内容</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30">
              <button onClick={closeForm} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">取消</button>
              <button onClick={handleSave} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">保存</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
