"use client";

import { useEffect } from "react";
import { getCMSApiUrl } from "@/lib/api";

/**
 * 全局图片错误处理器
 *
 * 监听页面上所有 <img> 加载失败事件（捕获阶段），
 * 自动识别 CloudBase 签名过期 URL，调用 image-url API 刷新。
 *
 * 主要覆盖：
 * - dangerouslySetInnerHTML 渲染的富文本图片（TipTap 输出）
 * - 任何未被 CoverImage 包裹的原生 <img> 标签
 *
 * 每个 img 最多自动重试一次，刷新成功后重置标记允许再次刷新。
 */
export default function ImageErrorHandler() {
  useEffect(() => {
    const handleGlobalError = async (e: Event) => {
      const img = e.target as HTMLElement;
      if (!img || img.tagName !== "IMG") return;

      const src =
        (img as HTMLImageElement).src ||
        img.getAttribute("src") ||
        "";
      if (!src) return;

      // 已重试过，跳过（避免死循环）
      if (img.dataset.imgRetried === "1") return;

      // 提取 CloudBase cloudPath
      let cloudPath: string | null = null;
      try {
        const u = new URL(src);
        if (
          u.hostname.includes("tcb.qcloud.la") ||
          u.hostname.includes("tcloudbaseapp.com")
        ) {
          cloudPath = u.pathname.replace(/^\//, "");
        }
      } catch {
        return;
      }

      if (!cloudPath) return;

      img.dataset.imgRetried = "1";

      try {
        const apiBase = getCMSApiUrl();
        if (!apiBase) return;

        const res = await fetch(
          `${apiBase}/image-url?path=${encodeURIComponent(cloudPath)}`
        );
        const json = await res.json();
        if (json.code === 0 && json.data?.url) {
          (img as HTMLImageElement).src = json.data.url;
          delete img.dataset.imgRetried; // 重置，允许后续再过期时刷新
        }
      } catch {
        // 刷新失败，静默处理
      }
    };

    // 使用捕获阶段（error 事件不冒泡）
    window.addEventListener("error", handleGlobalError, true);

    return () => {
      window.removeEventListener("error", handleGlobalError, true);
    };
  }, []);

  return null;
}
