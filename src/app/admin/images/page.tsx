"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink, Search,
} from "lucide-react";
import { fetchAdminData, getCMSApiUrl } from "@/lib/api";
import AdminLayout, { AdminLoading } from "@/components/admin/AdminLayout";
import CoverImage from "@/components/CoverImage";

const typeConfig: Record<string, { label: string; icon: string; color: string; editPath: string }> = {
  plants: { label: "植物百科", icon: "🌱", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", editPath: "/admin/plants" },
  guides: { label: "种植指南", icon: "📖", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", editPath: "/admin/guides" },
  diary: { label: "园丁日记", icon: "📝", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", editPath: "/admin/diary" },
  products: { label: "商品推荐", icon: "🛒", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", editPath: "/admin/products" },
};

interface ImageItem {
  url: string;
  type: string;
  contentId: string;
  contentName: string;
  contentDate: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => { loadImages(); }, []);

  const loadImages = async () => {
    try {
      const [plants, guides, diary, products] = await Promise.all([
        fetchAdminData("plants").catch(() => []),
        fetchAdminData("guides").catch(() => []),
        fetchAdminData("diary").catch(() => []),
        fetchAdminData("products").catch(() => []),
      ]);

      const allImages: ImageItem[] = [];
      const typeCounts: Record<string, number> = {};

      const extractImages = (items: any[], type: string) => {
        let count = 0;
        for (const item of items) {
          if (item.image) {
            allImages.push({
              url: item.image,
              type,
              contentId: item.id,
              contentName: item.name || item.title || item.id,
              contentDate: item._updatedAt || item.date || "",
            });
            count++;
          }
        }
        typeCounts[type] = count;
      };

      extractImages(plants, "plants");
      extractImages(guides, "guides");
      extractImages(diary, "diary");
      extractImages(products, "products");

      setImages(allImages);
      setCounts(typeCounts);
    } catch {}
    setLoading(false);
  };

  const filtered = images.filter((img) => {
    if (filter !== "all" && img.type !== filter) return false;
    if (search && !img.contentName.includes(search) && !img.url.includes(search)) return false;
    return true;
  });

  const totalCount = images.length;
  const filters = [
    { value: "all", label: `全部 (${totalCount})` },
    { value: "plants", label: `🌱 植物 (${counts.plants || 0})` },
    { value: "guides", label: `📖 指南 (${counts.guides || 0})` },
    { value: "diary", label: `📝 日记 (${counts.diary || 0})` },
    { value: "products", label: `🛒 商品 (${counts.products || 0})` },
  ];

  if (loading) return <AdminLoading />;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark dark:text-green-200">🖼 图片库</h1>
          <p className="text-sm text-gray-400 mt-1">
            共 <span className="font-semibold text-primary">{totalCount}</span> 张图片，来自所有内容类型
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${filter === f.value ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索图片名称或URL..." className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-primary dark:bg-[#1a2e22]/80 dark:border-green-800/50 dark:text-green-100" />
        </div>
      </div>

      {/* Image Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-gray-500 dark:text-gray-400">
            {images.length === 0 ? "还没有上传过图片。去编辑内容时点击上传按钮即可添加图片。" : "没有匹配的图片"}
          </p>
          {images.length === 0 && (
            <Link href="/admin/plants" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              去添加植物图片 →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((img, i) => {
            const config = typeConfig[img.type] || typeConfig.plants;
            return (
              <div
                key={`${img.type}-${img.contentId}-${i}`}
                className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
              >
                <button
                  onClick={() => setPreview(img.url)}
                  className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-green-900/10 cursor-pointer"
                >
                  <CoverImage
                    src={img.url}
                    alt={img.contentName}
                    className="transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                      点击放大
                    </span>
                  </div>
                </button>

                <div className="p-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                    {config.icon} {config.label}
                  </span>
                  <p className="mt-2 text-sm font-medium text-gray-900 truncate dark:text-green-100" title={img.contentName}>
                    {img.contentName}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    {img.contentDate && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(img.contentDate).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                    <Link
                      href={config.editPath}
                      className="text-xs text-primary hover:underline flex items-center gap-1 dark:text-green-300"
                    >
                      编辑 <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300 flex items-center gap-1"
            >
              ✕ 关闭
            </button>
            <img
              src={preview}
              alt="预览"
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onError={async (e) => {
                const img = e.target as HTMLImageElement;
                if (img.dataset.retried) return;
                img.dataset.retried = "1";
                try {
                  const u = new URL(img.src);
                  if (u.hostname.includes("tcb.qcloud.la")) {
                    const cloudPath = u.pathname.replace(/^\//, "");
                    const apiBase = getCMSApiUrl();
                    const res = await fetch(`${apiBase}/image-url?path=${encodeURIComponent(cloudPath)}`);
                    const json = await res.json();
                    if (json.code === 0 && json.data?.url) {
                      img.src = json.data.url;
                    }
                  }
                } catch {}
              }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white"
              >
                原始尺寸
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(preview);
                  setPreview(null);
                }}
                className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white"
              >
                复制链接
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
