"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus } from "lucide-react";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor, { contentToHtml } from "@/components/admin/RichTextEditor";
import { useCategories } from "@/lib/useCategories";
import { useAutoSave } from "@/lib/useAutoSave";
import { slugify } from "@/lib/utils";

const emptyForm = {
  id: "", image: "", title: "", slug: "", summary: "", plantId: "",
  category: "practice", tags: "", date: new Date().toISOString().slice(0,10),
  readTime: 5, pinned: false, content: "", status: "published"
};

export default function AdminDiaryPage() {
  const cats = useCategories();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const slugManuallyEdited = useRef(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const data = await fetchAdminData("diary"); setItems(data); } catch {}
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setForm({
        id: item.id, image: item.image || "", title: item.title, slug: item.slug || item.id,
        summary: item.summary || "", plantId: item.plantId || "",
        category: item.category || "practice", date: item.date || "",
        readTime: item.readTime || 5, pinned: item.pinned || false,
        tags: Array.isArray(item.tags) ? item.tags.join("、") : "",
        content: contentToHtml(item.content),
        status: item.status || "published"
      });
      setEditing(item);
    } else { setForm(emptyForm); setShowAdd(true); }
    slugManuallyEdited.current = false;
  };

  const handleSave = async (status: "draft" | "published") => {
    const data = {
      id: form.id || slugify(form.title),
      image: form.image || undefined,
      title: form.title, slug: form.slug || slugify(form.title) || form.id,
      summary: form.summary, plantId: form.plantId || undefined,
      category: form.category, date: form.date, readTime: Number(form.readTime),
      pinned: form.pinned,
      tags: form.tags.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean),
      content: form.content,
      status
    };
    const result = await saveToCMS("diary", [data]);
    if (result.success) {
      setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
      markSaved();
      if (status === "published") {
        setEditing(null); setShowAdd(false);
      } else {
        setForm(prev => ({ ...prev, id: data.id, status: "draft" }));
        if (!editing) setEditing(data);
      }
      setMsg(status === "published" ? "✅ 发布成功！正在自动部署..." : "📝 草稿已保存");
      if (status === "published") (window as any).__triggerDeploy?.();
      setTimeout(() => setMsg(""), 5000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const buildFormData = useCallback(() => ({
    id: form.id || slugify(form.title),
    title: form.title, slug: form.slug || slugify(form.title),
    summary: form.summary, plantId: form.plantId || undefined,
    category: form.category, date: form.date, readTime: Number(form.readTime),
    pinned: form.pinned,
    tags: form.tags.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean),
    content: form.content, image: form.image || undefined,
  }), [form]);

  const { autoSaveMsg, markDirty, markSaved } = useAutoSave(
    buildFormData,
    async (data) => {
      const r = await saveToCMS("diary", [data]);
      if (r.success) {
        setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
        setForm(prev => ({ ...prev, id: data.id, status: "draft" }));
        return true;
      }
      return false;
    },
    { enabled: !!editing || showAdd }
  );

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const r = await deleteFromCMS("diary", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  const closeForm = () => { setEditing(null); setShowAdd(false); };

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">📝 园丁日记</h1><p className="text-sm text-gray-400 mt-1">共 {items.length} 篇</p></div><button onClick={() => openForm()} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"><Plus className="h-4 w-4" /> 新增日记</button></div>
      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100 dark:border-green-900/30"><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">标题</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">分类</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">置顶</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">日期</th><th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th></tr></thead><tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10"><td className="px-4 py-3"><div className="text-sm font-medium text-gray-900 dark:text-green-100">{item.title}{item.status === "draft" && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">草稿</span>}</div></td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.category}</td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{item.pinned ? "📌 是" : "否"}</td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.date}</td><td className="px-4 py-3 text-right"><button onClick={() => openForm(item)} className="text-primary hover:text-primary-dark text-sm mr-2">编辑</button><button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 text-sm">删除</button></td></tr>
          ))}
        </tbody></table></div>
      </div>
      {(editing || showAdd) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10" onClick={closeForm}><div className="w-full max-w-4xl mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{editing ? "编辑日记" : "新增日记"}</h2>{form.status === "draft" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">📝 草稿</span>}{form.status === "published" && editing && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">✅ 已发布</span>}</div><button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div>
          {autoSaveMsg && <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">{autoSaveMsg}</div>}
          <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
          <ImageUpload value={form.image} onChange={(url: string) => { setForm({...form, image: url}); markDirty(); }} label="封面图片" />
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">标题 *</label><input value={form.title} onChange={e => { const newTitle = e.target.value; setForm(prev => { const newSlug = !slugManuallyEdited.current ? slugify(newTitle) : prev.slug; return {...prev, title: newTitle, slug: newSlug}; }); markDirty(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">Slug</label><input value={form.slug} onChange={e => { slugManuallyEdited.current = true; setForm({...form, slug: e.target.value}); markDirty(); }} placeholder="留空则自动生成" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div></div>
          <div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">分类</label><select value={form.category} onChange={e => { setForm({...form, category: e.target.value}); markDirty(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">{cats.diaryCategory.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">阅读分钟</label><input type="number" value={form.readTime} onChange={e => { setForm({...form, readTime: Number(e.target.value)}); markDirty(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">日期</label><input value={form.date} onChange={e => { setForm({...form, date: e.target.value}); markDirty(); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">关联植物ID</label><input value={form.plantId} onChange={e => { setForm({...form, plantId: e.target.value}); markDirty(); }} placeholder="tomato" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">标签（顿号分隔）</label><input value={form.tags} onChange={e => { setForm({...form, tags: e.target.value}); markDirty(); }} placeholder="番茄、新手经验" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.pinned} onChange={e => { setForm({...form, pinned: e.target.checked}); markDirty(); }} className="rounded border-gray-300 text-primary" /><span className="text-sm text-gray-700 dark:text-green-200">📌 置顶到首页</span></label>
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">摘要</label><textarea value={form.summary} onChange={e => { setForm({...form, summary: e.target.value}); markDirty(); }} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div><RichTextEditor value={form.content} onChange={(val) => { setForm({...form, content: val}); markDirty(); }} /></div>
        </div><div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30"><button onClick={closeForm} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">取消</button><button onClick={() => handleSave("draft")} className="flex-1 rounded-lg border border-amber-300 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">📝 保存草稿</button><button onClick={() => handleSave("published")} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">✅ 发布</button></div></div></div>
      )}
    </AdminLayout>
  );
}
