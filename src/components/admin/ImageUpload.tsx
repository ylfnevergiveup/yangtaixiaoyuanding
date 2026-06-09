"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { getCMSApiUrl, getCMSPassword } from "@/lib/api";
import ImageCropper from "@/components/admin/ImageCropper";
import CoverImage from "@/components/CoverImage";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "图片" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { setError("图片不能超过 10MB"); return; }
    if (!file.type.startsWith("image/")) { setError("请选择图片文件"); return; }
    setError("");
    setPendingFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  /** 裁剪完成，上传裁剪后的 blob */
  const handleCrop = async (blob: Blob, fileName: string) => {
    setPendingFile(null);
    const croppedFile = new File([blob], fileName, { type: blob.type || "image/jpeg" });
    await doUpload(croppedFile);
  };

  /** 跳过裁剪，直接上传原图 */
  const handleSkip = async () => {
    if (!pendingFile) return;
    setPendingFile(null);
    await doUpload(pendingFile);
  };

  const doUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const password = getCMSPassword();
      const apiBase = getCMSApiUrl();
      if (!apiBase) { setError("CMS API 未配置"); return; }
      if (!password) { setError("未登录，请重新登录"); return; }

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${password}`, "X-Cms-Password": password },
        body: fd,
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.url) onChange(json.data.url);
      else setError(json.error || "上传失败");
    } catch (err: any) { setError(`网络错误: ${err.message}`); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">{label}</label>
      {value ? (
        <div className="relative inline-block group h-32">
          <CoverImage src={value} alt="" className="max-w-xs rounded-lg border border-gray-200 dark:border-green-800/50" />
          <button onClick={() => onChange("")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"><X className="h-3 w-3" /></button>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/30 transition-colors">
            <button onClick={() => fileRef.current?.click()} className="hidden group-hover:flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow"><Upload className="h-3 w-3" /> 更换</button>
          </div>
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-6 py-8 text-sm text-gray-400 transition-colors hover:border-primary hover:text-primary dark:border-green-800/50 dark:hover:border-leaf">
          {uploading ? (<><span className="text-2xl animate-pulse">⏳</span><span>上传中...</span></>)
          : (<><Upload className="h-6 w-6" /><span>点击上传图片</span><span className="text-xs text-gray-300 dark:text-gray-600">JPG/PNG/WebP/GIF，最大 10MB</span></>)}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {pendingFile && (
        <ImageCropper file={pendingFile} onCrop={handleCrop} onSkip={handleSkip} onCancel={() => setPendingFile(null)} />
      )}
    </div>
  );
}
