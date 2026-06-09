"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Check, X } from "lucide-react";

interface Props {
  file: File;
  onCrop: (blob: Blob, fileName: string) => void;
  onSkip: () => void;
  onCancel: () => void;
}

const RATIOS = [
  { label: "自由", value: 0 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:1", value: 3 },
  { label: "2:1", value: 2 },
];

export default function ImageCropper({ file, onCrop, onSkip, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [ratio, setRatio] = useState(0); // 默认自由比例
  const [dragging, setDragging] = useState(false);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);
  const [dragOX, setDragOX] = useState(0);
  const [dragOY, setDragOY] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      const maxW = Math.min(540, window.innerWidth - 64);
      const maxH = Math.min(400, window.innerHeight - 300);
      const s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
      const dw = Math.round(img.naturalWidth * s);
      const dh = Math.round(img.naturalHeight * s);
      setImgW(dw); setImgH(dh);
      // 初始裁剪框：最大正方形，居中
      const cs = Math.min(dw, dh);
      setCropW(cs); setCropH(cs);
      setCropX(Math.round((dw - cs) / 2));
      setCropY(Math.round((dh - cs) / 2));
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 切换比例
  const changeRatio = (r: number) => {
    setRatio(r);
    if (r === 0) return;
    // 以当前裁剪框中心为准，调整为新的宽高比
    const cx = cropX + cropW / 2, cy = cropY + cropH / 2;
    let nw = cropW, nh = Math.round(nw / r);
    if (nh > imgH) { nh = imgH; nw = Math.round(nh * r); }
    if (nw > imgW) { nw = imgW; nh = Math.round(nw / r); }
    const nx = Math.max(0, Math.round(cx - nw / 2));
    const ny = Math.max(0, Math.round(cy - nh / 2));
    setCropW(nw); setCropH(nh);
    setCropX(nx); setCropY(ny);
  };

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    if ("touches" in e) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    setDragging(true);
    setDragOX(x); setDragOY(y);
  }, [getPos]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const { x, y } = getPos(e);
    const dx = (x - dragOX) * 0.4, dy = (y - dragOY) * 0.4;
    setDragOX(x); setDragOY(y);
    setCropX(px => Math.max(0, Math.min(imgW - cropW, px + dx)));
    setCropY(py => Math.max(0, Math.min(imgH - cropH, py + dy)));
  }, [dragging, getPos, imgW, imgH, cropW, cropH]);

  const onEnd = useCallback(() => setDragging(false), []);

  const doCrop = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const s = image.naturalWidth / imgW;
    const sx = Math.round(cropX * s), sy = Math.round(cropY * s);
    const sw = Math.round(cropW * s), sh = Math.round(cropH * s);
    const c = canvasRef.current;
    c.width = sw; c.height = sh;
    c.getContext("2d")!.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    c.toBlob(b => { if (b) onCrop(b, file.name); }, file.type || "image/jpeg", 0.92);
  }, [image, imgW, cropX, cropY, cropW, cropH, file, onCrop]);

  if (!image) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-2xl bg-white p-8 dark:bg-[#1a2e22]"><span className="text-2xl animate-pulse">⏳</span></div>
    </div>
  );

  const pct = Math.round(cropW / imgW * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-4"
      onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
      onTouchMove={onMove} onTouchEnd={onEnd}>
      <div className="flex flex-col rounded-2xl bg-[#1e1e1e] shadow-2xl overflow-hidden" style={{ maxWidth: imgW + 24 }}>
        {/* 顶部 */}
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <span className="text-sm text-gray-400 whitespace-nowrap">裁剪图片</span>
          <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
            {RATIOS.map(r => (
              <button key={r.value} onClick={() => changeRatio(r.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  ratio === r.value ? "bg-white text-gray-900" : "text-gray-400 hover:text-white"
                }`}>{r.label}</button>
            ))}
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{cropW}×{cropH} ({pct}%)</span>
        </div>

        {/* 画布 */}
        <div ref={containerRef} className="relative select-none touch-none cursor-move"
          style={{ width: imgW, height: imgH, margin: "0 12px" }}
          onMouseDown={onStart} onTouchStart={onStart}>
          <img src={URL.createObjectURL(file)} alt="" className="absolute inset-0 w-full h-full object-contain" draggable={false} />
          <svg width={imgW} height={imgH} className="absolute inset-0">
            <defs>
              <mask id="cm">
                <rect width={imgW} height={imgH} fill="white" />
                <rect x={cropX} y={cropY} width={cropW} height={cropH} fill="black" />
              </mask>
            </defs>
            <rect width={imgW} height={imgH} fill="rgba(0,0,0,0.55)" mask="url(#cm)" />
            <rect x={cropX} y={cropY} width={cropW} height={cropH} fill="none" stroke="white" strokeWidth={2} />
            {/* 九宫格辅助线 */}
            {[1/3, 2/3].map(r => (
              <g key={r} opacity={0.4}>
                <line x1={cropX + cropW * r} y1={cropY} x2={cropX + cropW * r} y2={cropY + cropH} stroke="white" strokeWidth={0.5} />
                <line x1={cropX} y1={cropY + cropH * r} x2={cropX + cropW} y2={cropY + cropH * r} stroke="white" strokeWidth={0.5} />
              </g>
            ))}
          </svg>
        </div>

        {/* 底部 */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:text-white"><X className="h-4 w-4" /> 取消</button>
          <button onClick={onSkip} className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm text-gray-400 hover:text-white border border-white/20 hover:border-white/40">
            跳过裁剪
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-500 hidden sm:inline">拖拽移动裁剪框</span>
          <div className="flex-1" />
          <button onClick={doCrop} className="flex items-center gap-1.5 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"><Check className="h-4 w-4" /> 确认</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
