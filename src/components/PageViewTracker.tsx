"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CMS_API = process.env.NEXT_PUBLIC_CMS_API || "";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (!CMS_API || pathname === lastPath.current) return;
    lastPath.current = pathname;

    // 忽略后台页面
    if (pathname.startsWith("/admin")) return;

    const sendPV = () => {
      try {
        const payload = JSON.stringify({
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        });

        // 用 sendBeacon 确保不阻塞页面
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            `${CMS_API}/analytics`,
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch(`${CMS_API}/analytics`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    // 延迟发送，避免影响首屏渲染
    const timer = setTimeout(sendPV, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // 不渲染任何 UI
}
