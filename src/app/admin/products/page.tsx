"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCategories } from "@/lib/useCategories";

const emptyForm = {
  id: "", image: "", name: "", category: "花盆", emoji: "🪴", description: "",
  pros: "", rating: 4.5, price: "", buyLink: "", recommendation: "", suitableFor: "", status: "published"
};

export default function AdminProductsPage() {
  const cats = useCategories();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const data = await fetchAdminData("products"); setItems(data); } catch {}
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setForm({
        id: item.id, image: item.image || "", name: item.name, category: item.category, emoji: item.emoji,
        description: item.description || "", pros: Array.isArray(item.pros) ? item.pros.join("、") : "",
        rating: item.rating || 4.5, price: item.price || "", buyLink: item.buyLink || "",
        recommendation: item.recommendation || "",
        suitableFor: Array.isArray(item.suitableFor) ? item.suitableFor.join("、") : "",
        status: item.status || "published"
      });
      setEditing(item);
    } else { setForm(emptyForm); setShowAdd(true); }
  };

  const handleSave = async () => {
    const data = {
      id: form.id || (form.emoji + form.name).toLowerCase().replace(/\s+/g, "-"),
      image: form.image || undefined,
      name: form.name, category: form.category, emoji: form.emoji,
      description: form.description, rating: Number(form.rating), price: form.price,
      buyLink: form.buyLink || undefined,
      pros: form.pros.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean),
      recommendation: form.recommendation,
      suitableFor: form.suitableFor.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean),
      status: form.status || "published"
    };
    const result = await saveToCMS("products", [data]);
    if (result.success) {
      setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
      setEditing(null); setShowAdd(false); setMsg("✅ 保存成功！"); setTimeout(() => setMsg(""), 3000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const r = await deleteFromCMS("products", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  const closeForm = () => { setEditing(null); setShowAdd(false); };

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">🛒 商品推荐</h1><p className="text-sm text-gray-400 mt-1">共 {items.length} 件</p></div><button onClick={() => openForm()} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"><Plus className="h-4 w-4" /> 新增商品</button></div>
      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100 dark:border-green-900/30"><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">商品</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">分类</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">评分</th><th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">价格</th><th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th></tr></thead><tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10"><td className="px-4 py-3"><div className="text-sm font-medium text-gray-900 dark:text-green-100">{item.emoji} {item.name}{item.status === "draft" && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">草稿</span>}</div></td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.category}</td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{"⭐".repeat(Math.round(item.rating))} {item.rating}</td><td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.price}</td><td className="px-4 py-3 text-right"><button onClick={() => openForm(item)} className="text-primary hover:text-primary-dark text-sm mr-2">编辑</button><button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 text-sm">删除</button></td></tr>
          ))}
        </tbody></table></div>
      </div>
      {(editing || showAdd) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10" onClick={closeForm}><div className="w-full max-w-4xl mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{editing ? "编辑商品" : "新增商品"}</h2><button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div><div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
          <ImageUpload value={form.image} onChange={(url: string) => setForm({...form, image: url})} label="商品图片" />
          <div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">名称 *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">Emoji</label><input value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">分类</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">{cats.productCategory.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">评分</label><input type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div><div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">价格</label><input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="¥15-25" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div></div>
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">购买链接</label><input value={form.buyLink} onChange={e => setForm({...form, buyLink: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">优点（顿号分隔）</label><input value={form.pros} onChange={e => setForm({...form, pros: e.target.value})} placeholder="加厚耐用、排水好" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">推荐理由</label><textarea value={form.recommendation} onChange={e => setForm({...form, recommendation: e.target.value})} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div className="flex items-center gap-4">
          <label className="text-xs font-medium text-gray-600 dark:text-green-300">发布状态</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
            <option value="published">✅ 已发布</option>
            <option value="draft">📝 草稿</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">描述</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
          <div><label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">适合植物ID（顿号分隔）</label><input value={form.suitableFor} onChange={e => setForm({...form, suitableFor: e.target.value})} placeholder="tomato、chili" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" /></div>
        </div><div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-green-900/30"><button onClick={closeForm} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400">取消</button><button onClick={handleSave} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">保存</button></div></div></div>
      )}
    </AdminLayout>
  );
}
