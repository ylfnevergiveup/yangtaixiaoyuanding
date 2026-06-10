"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Check, Filter } from "lucide-react";
import { fetchAdminData, saveToCMS, deleteFromCMS } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

const emptyForm = {
  id: "", title: "", content: "", author: "", date: "", tags: "",
  views: 0, isResolved: false, answers: [], status: "published"
};

type FilterStatus = "all" | "draft" | "published";

export default function AdminQAPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const draftCount = items.filter(i => i.status === "draft").length;

  const filteredItems = useMemo(() => {
    if (filterStatus === "all") return items;
    return items.filter(i => i.status === filterStatus);
  }, [items, filterStatus]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const data = await fetchAdminData("qa"); setItems(data); } catch {}
    setLoading(false);
  };

  const openForm = (item?: any) => {
    if (item) {
      setForm({
        id: item.id, title: item.title || "", content: item.content || "",
        author: item.author || "", date: item.date || "",
        tags: Array.isArray(item.tags) ? item.tags.join("、") : (item.tags || ""),
        views: item.views || 0, isResolved: item.isResolved || false,
        answers: item.answers || [], status: item.status || "published"
      });
      setEditing(item);
    } else { setForm(emptyForm); setShowAdd(true); }
  };

  const handleSave = async () => {
    const data = {
      id: form.id || ("qa-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4)),
      title: form.title, content: form.content, author: form.author,
      date: form.date || new Date().toISOString().slice(0, 10),
      tags: form.tags.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean),
      views: Number(form.views), isResolved: form.isResolved,
      answers: form.answers, status: form.status || "published"
    };
    const result = await saveToCMS("qa", [data]);
    if (result.success) {
      setItems((prev: any[]) => { const f = prev.filter((p: any) => p.id !== data.id); f.push(data); return f; });
      setEditing(null); setShowAdd(false); setMsg("✅ 保存成功！"); setTimeout(() => setMsg(""), 3000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const r = await deleteFromCMS("qa", id);
    if (r.success) { setItems((prev: any[]) => prev.filter((p: any) => p.id !== id)); setMsg("✅ 删除成功"); setTimeout(() => setMsg(""), 3000); }
    else setErr(`❌ ${r.message}`);
  };

  const toggleAnswerStatus = (answerIdx: number) => {
    setForm((prev: any) => {
      const answers = [...prev.answers];
      if (answers[answerIdx]) {
        answers[answerIdx] = {
          ...answers[answerIdx],
          status: answers[answerIdx].status === "draft" ? "published" : "draft"
        };
      }
      return { ...prev, answers };
    });
  };

  const deleteAnswer = (answerIdx: number) => {
    if (!confirm("确定删除这条回答？")) return;
    setForm((prev: any) => ({
      ...prev,
      answers: prev.answers.filter((_: any, i: number) => i !== answerIdx)
    }));
  };

  const approveItem = async (item: any) => {
    const data = { ...item, status: "published" };
    const result = await saveToCMS("qa", [data]);
    if (result.success) {
      setItems((prev: any[]) => prev.map(p => p.id === item.id ? { ...p, status: "published" } : p));
      setMsg("✅ 已通过审核"); setTimeout(() => setMsg(""), 3000);
    } else { setErr(`❌ ${result.message}`); }
  };

  const closeForm = () => { setEditing(null); setShowAdd(false); };

  const answerCount = (item: any) => {
    if (Array.isArray(item.answers)) return item.answers.filter((a: any) => a.status !== "draft").length;
    return typeof item.answers === "number" ? item.answers : 0;
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">❓ 问答管理</h1>
          <p className="text-sm text-gray-400 mt-1">
            共 {items.length} 个问题
            {draftCount > 0 && <span className="ml-2 text-amber-500 font-medium">{draftCount} 条待审核</span>}
          </p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> 新增问题
        </button>
      </div>

      {/* 状态筛选标签 */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all" as FilterStatus, label: "全部" },
          { key: "draft" as FilterStatus, label: `待审核${draftCount > 0 ? ` (${draftCount})` : ""}` },
          { key: "published" as FilterStatus, label: "已发布" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              filterStatus === tab.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30",
              tab.key === "draft" && draftCount > 0 && filterStatus !== "draft" && "ring-amber-300 text-amber-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {msg && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{msg}</div>}
      {err && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{err}</div>}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden dark:bg-[#1a2e22]/80 dark:ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-green-900/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">标题</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">作者</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">回答</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">浏览</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <span className="text-3xl block mb-2">❓</span>
                    {filterStatus === "draft" ? "没有待审核的问题" : filterStatus === "published" ? "没有已发布的问题" : "暂无问答，点击上方按钮创建第一条"}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item: any) => (
                  <tr key={item.id} className={cn(
                    "border-b border-gray-50 hover:bg-gray-50 dark:border-green-900/20 dark:hover:bg-green-900/10",
                    item.status === "draft" && "bg-amber-50/50 dark:bg-amber-900/5"
                  )}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-green-100">
                        {item.title}
                        {item.status === "draft" && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">待审核</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{answerCount(item)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.views}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.isResolved ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"}`}>
                        {item.isResolved ? "已解决" : "待答"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {item.status === "draft" && (
                        <button onClick={() => approveItem(item)} className="text-green-600 hover:text-green-700 text-sm mr-2" title="审核通过">
                          <Check className="h-4 w-4 inline" /> 通过
                        </button>
                      )}
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

      {/* Edit/Add modal */}
      {(editing || showAdd) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10" onClick={closeForm}>
          <div className="w-full max-w-4xl mx-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark dark:text-green-200">{editing ? "编辑问题" : "新增问题"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
              {/* Question fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">标题 *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">作者</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">问题描述</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">标签（顿号分隔）</label>
                  <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">浏览数</label>
                  <input type="number" value={form.views} onChange={e => setForm({...form, views: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">日期</label>
                  <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isResolved} onChange={e => setForm({...form, isResolved: e.target.checked})} className="rounded border-gray-300 text-primary" />
                  <span className="text-sm text-gray-700 dark:text-green-200">已解决</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-green-300">发布状态</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100">
                    <option value="published">✅ 已发布</option>
                    <option value="draft">📝 草稿</option>
                  </select>
                </div>
              </div>

              {/* Answers management */}
              {form.answers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-green-200 mb-2">
                    回答管理 ({form.answers.length} 条)
                  </h3>
                  <div className="space-y-2">
                    {form.answers.map((a: any, i: number) => (
                      <div key={a.id || i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0f1a14]/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-green-100">{a.author}</span>
                            <span className="text-xs text-gray-400">{a.date}</span>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${a.status === "draft" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"}`}>
                              {a.status === "draft" ? "草稿" : "已发布"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{a.content}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => toggleAnswerStatus(i)} className="text-xs text-primary hover:text-primary-dark">
                            {a.status === "draft" ? "发布" : "隐藏"}
                          </button>
                          <button onClick={() => deleteAnswer(i)} className="text-xs text-red-400 hover:text-red-500">删除</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
