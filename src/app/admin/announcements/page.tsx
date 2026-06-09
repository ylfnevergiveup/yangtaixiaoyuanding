"use client";

import { useState, useEffect } from "react";
import {
  Plus, Megaphone, MegaphoneOff,
} from "lucide-react";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";

const emptyForm = {
  id: "", text: "", link: "", linkText: "查看详情",
  active: true, color: "green",
};

const colorOptions = [
  { value: "green", label: "🟢 绿色（通用）", bg: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-200" },
  { value: "blue", label: "🔵 蓝色（信息）", bg: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-200" },
  { value: "amber", label: "🟠 橙色（提醒）", bg: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-200" },
  { value: "red", label: "🔴 红色（重要）", bg: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-200" },
];

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setItems(await fetchAdminData("announcements")); } catch {}
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setForm({
        id: item.id, text: item.text || "", link: item.link || "",
        linkText: item.linkText || "查看详情", active: item.active !== false,
        color: item.color || "green",
      });
      setEditing(item);
    } else { setForm(emptyForm); setShowAdd(true); }
  };

  const handleSave = async () => {
    if (!form.text.trim()) { setErr("请输入公告内容"); return; }
    const data = {
      id: form.id || `announce-${Date.now()}`,
      text: form.text, link: form.link || undefined,
      linkText: form.linkText || "查看详情",
      active: form.active, color: form.color,
      _updatedAt: new Date().toISOString(),
    };
    const result = await saveToCMS("announcements", [data]);
    if (result.success) {
      setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
      setEditing(null); setShowAdd(false); setMsg("✅ 保存成功！"); setTimeout(() => setMsg(""), 3000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const r = await deleteFromCMS("announcements", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  const handleToggle = async (item: any) => {
    const updated = { ...item, active: !item.active, _updatedAt: new Date().toISOString() };
    const result = await saveToCMS("announcements", [updated]);
    if (result.success) {
      setItems((prev: any[]) => prev.map((p: any) => p.id === item.id ? updated : p));
    }
  };

  const closeForm = () => { setEditing(null); setShowAdd(false); };

  if (loading) return <AdminLoading />;

  const activeCount = items.filter(i => i.active).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">📢 公告管理</h1><p className="text-sm text-gray-400 mt-1">{activeCount} 条公告生效中</p></div><button onClick={() => openForm()} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"><Plus className="h-4 w-4" /> 新增公告</button></div>
      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}
      <div className="space-y-3">
        {items.map(item => {
          const color = colorOptions.find(c => c.value === item.color) || colorOptions[0];
          return (
            <div key={item.id} className={`rounded-2xl border p-4 ${color.bg}`}>
              <div className="flex items-start gap-4">
                <button onClick={() => handleToggle(item)} title={item.active ? "点击停用" : "点击启用"} className="mt-0.5 flex-shrink-0">
                  {item.active ? <Megaphone className="h-5 w-5" /> : <MegaphoneOff className="h-5 w-5 opacity-40" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.text}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs opacity-70">
                    {item.link && <span>🔗 {item.linkText}: {item.link}</span>}
                    {item.active ? <span className="text-green-600 dark:text-green-400">● 生效中</span> : <span className="text-gray-400">○ 已停用</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openForm(item)} className="text-sm hover:underline">编辑</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:underline">删除</button>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-gray-400">暂无公告，点击上方按钮创建第一条</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {(editing || showAdd) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10" onClick={closeForm}><div className="w-full max-w-lg mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{editing ? "编辑公告" : "新增公告"}</h2><button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div><div className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">公告内容 *</label><textarea value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={3} placeholder="例如：春季种植季开始啦！查看三月阳台种植指南 →" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">链接地址</label><input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https:// 或 /plants" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">链接文字</label><input value={form.linkText} onChange={e => setForm({...form, linkText: e.target.value})} placeholder="查看详情" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">颜色主题</label><select value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">{colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">状态</label><select value={form.active ? "true" : "false"} onChange={e => setForm({...form, active: e.target.value === "true"})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100"><option value="true">✅ 生效中</option><option value="false">⏸️ 已停用</option></select></div></div>
        </div><div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30"><button onClick={closeForm} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">取消</button><button onClick={handleSave} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">保存</button></div></div></div>
      )}
    </AdminLayout>
  );
}
