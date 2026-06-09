"use client";

import { useState, useRef, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCMSApiUrl } from "@/lib/api";

/** 可指定焦点的封面图组件，自动处理 CloudBase 签名 URL 过期 */
interface Props {
  src: string;
  alt: string;
  position?: string;
  className?: string;
}

export default function CoverImage({ src, alt, position, className = "" }: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const retryRef = useRef(false);

  // 当外部 src 变化时同步更新
  useEffect(() => {
    setImgSrc(src);
    setError(false);
    retryRef.current = false;
  }, [src]);

  const handleError = async () => {
    if (retryRef.current) return; // 每次挂载只主动重试一次，避免死循环
    retryRef.current = true;
    setRefreshing(true);

    // 尝试从 CloudBase URL 中提取 cloudPath 并刷新签名
    const cloudPath = extractCloudPath(src);
    if (cloudPath) {
      try {
        // 使用 getCMSApiUrl() 确保有三层兜底（window → 构建变量 → 硬编码）
        const apiBase = getCMSApiUrl();
        if (apiBase) {
          const res = await fetch(`${apiBase}/image-url?path=${encodeURIComponent(cloudPath)}`);
          const json = await res.json();
          if (json.code === 0 && json.data?.url) {
            setImgSrc(json.data.url);
            setError(false);
            setRefreshing(false);
            retryRef.current = false; // 重置，允许后续过期再刷新
            return;
          }
        }
      } catch {
        // 刷新失败，显示错误占位符
      }
    }

    setRefreshing(false);
    setError(true);
  };

  // 从 CloudBase temp URL 中提取 cloudPath
  // https://xxx.tcb.qcloud.la/images/2026-06/xxx.png?sign=... → images/2026-06/xxx.png
  function extractCloudPath(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname.includes("tcb.qcloud.la") || u.hostname.includes("tcloudbaseapp.com")) {
        // pathname 就是 cloudPath
        return u.pathname.replace(/^\//, "");
      }
    } catch {}
    return null;
  }

  // 兜底：纯色背景 + emoji
  const fallbackEmoji = alt.includes("植物") ? "🌱" : "📷";

  if (error) {
    return (
      <div
        className={cn(
          "h-full w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/50 gap-1",
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-gray-400" />
        <span className="text-xs text-gray-400">{alt || "图片加载失败"}</span>
      </div>
    );
  }

  if (refreshing) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/30">
        <span className="text-3xl animate-pulse opacity-60 select-none">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position || "50% 50%" }}
      loading="lazy"
    />
  );
}
