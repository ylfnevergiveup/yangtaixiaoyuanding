"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface AutoSaveOptions {
  /** Whether auto-save is enabled (usually when form is open) */
  enabled: boolean;
  /** Auto-save delay in ms, default 30000 (30s) */
  delay?: number;
  /** Minimum title/key length to trigger auto-save, default 1 */
  minTitleLength?: number;
  /** Key to check for title field, default 'title' */
  titleKey?: string;
}

/**
 * 自动保存草稿 hook
 *
 * 用法:
 *   const { autoSaveMsg, markDirty, markSaved } = useAutoSave(
 *     () => buildFormData(),
 *     async (data) => { const r = await saveToCMS("guides", [data]); return r.success; },
 *     { enabled: !!editing || showAdd }
 *   );
 *
 *   // 在表单 onChange 中调用 markDirty()
 *   <input onChange={e => { setForm({...form, title: e.target.value}); markDirty(); }} />
 *
 *   // 手动保存后调用 markSaved() 清除脏标记
 *   const handleSave = async () => { ...; markSaved(); };
 */
export function useAutoSave(
  getFormData: () => Record<string, any>,
  saveFn: (data: Record<string, any>) => Promise<boolean>,
  options: AutoSaveOptions
) {
  const { enabled, delay = 30000, minTitleLength = 1, titleKey = "title" } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [autoSaveMsg, setAutoSaveMsg] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const getFormDataRef = useRef(getFormData);
  const saveFnRef = useRef(saveFn);

  getFormDataRef.current = getFormData;
  saveFnRef.current = saveFn;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** 标记表单已修改，重置自动保存计时器 */
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    if (!enabled) return;

    clearTimer();
    timerRef.current = setTimeout(async () => {
      const formData = getFormDataRef.current();
      const title = formData[titleKey] || "";

      // 标题太短不自动保存
      if (typeof title === "string" && title.trim().length < minTitleLength) {
        return;
      }

      setIsSaving(true);
      try {
        const saveData = { ...formData, status: "draft" };
        const ok = await saveFnRef.current(saveData);
        if (ok) {
          dirtyRef.current = false;
          setLastSaveTime(new Date());
          setAutoSaveMsg("💾 草稿已自动保存");
          setTimeout(() => setAutoSaveMsg(""), 3000);
        }
      } catch {
        // 自动保存失败静默处理
      } finally {
        setIsSaving(false);
      }
    }, delay);
  }, [enabled, delay, minTitleLength, titleKey, clearTimer]);

  /** 手动保存后调用，清除脏标记 */
  const markSaved = useCallback(() => {
    dirtyRef.current = false;
    clearTimer();
  }, [clearTimer]);

  // beforeunload: 有未保存修改时提醒
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    isSaving,
    lastSaveTime,
    autoSaveMsg,
    markDirty,
    markSaved,
  };
}
