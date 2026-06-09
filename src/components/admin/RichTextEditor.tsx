"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { useRef, useCallback, useState } from "react";
import ImageCropper from "@/components/admin/ImageCropper";
import TableInserter from "@/components/admin/TableInserter";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Link, Image, Minus, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, Palette, Undo2, Redo2, Code2,
  Rows3, Columns3, Trash2, SplitSquareHorizontal, SplitSquareVertical,
  Table2,
} from "lucide-react";
import { getCMSApiUrl, getCMSPassword } from "@/lib/api";

interface Props {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}

/** 将旧格式（数组/markdown）转为 HTML，兼容编辑器加载 */
export function contentToHtml(content: string | string[]): string {
  const text = Array.isArray(content) ? content.join("\n\n") : (content || "");
  // 已经是 HTML
  if (/<[a-z][\s\S]*?>/i.test(text)) return text;

  // 简易 Markdown → HTML 转换
  let html = text;
  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // 斜体
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  // 行内代码
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 段落处理
  const blocks = html.split("\n\n");
  return blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith("> ")) {
        const lines = block.split("\n").map((l) => l.replace(/^> /, ""));
        return `<blockquote><p>${lines.join("<br />")}</p></blockquote>`;
      }
      if (/^[-*]\s/.test(block)) {
        const items = block
          .split("\n")
          .filter((l) => /^[-*]\s/.test(l))
          .map((l) => `<li>${l.replace(/^[-*]\s/, "")}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (/^\d+\.\s/.test(block)) {
        const items = block
          .split("\n")
          .filter((l) => /^\d+\.\s/.test(l))
          .map((l) => `<li>${l.replace(/^\d+\.\s/, "")}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }
      // 单行换行
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

const COLORS = [
  "#2d6a4f", "#52c41a", "#1890ff", "#722ed1",
  "#f5222d", "#fa8c16", "#faad14", "#595959",
];

export default function RichTextEditor({ value, onChange, label = "正文" }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");
  const [showTableInserter, setShowTableInserter] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Placeholder.configure({ placeholder: "开始编写内容…" }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: contentToHtml(value),
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[320px] px-5 py-4 outline-none text-gray-700 dark:text-green-100 leading-relaxed",
      },
    },
    immediatelyRender: false,
  });

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      if (file.size > 10 * 1024 * 1024) { alert("图片不能超过 10MB"); e.target.value = ""; return; }
      if (!file.type.startsWith("image/")) { alert("请选择图片文件"); e.target.value = ""; return; }
      setPendingFile(file);
      e.target.value = "";
    },
    [editor]
  );

  const handleCropUpload = useCallback(
    async (blob: Blob, fileName: string) => {
      if (!editor) return;
      setPendingFile(null);
      const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
      await uploadAndInsert(file);
    },
    [editor]
  );

  /** 跳过裁剪，直接上传原图 */
  const handleSkipUpload = useCallback(async () => {
    if (!pendingFile) return;
    setPendingFile(null);
    await uploadAndInsert(pendingFile);
  }, [pendingFile, editor]);

  /** 上传并在编辑器中插入图片 */
  const uploadAndInsert = async (file: File) => {
    if (!editor) return;
    try {
      const password = getCMSPassword();
      const apiBase = getCMSApiUrl();
      if (!apiBase) { alert("CMS API 未配置"); return; }
      if (!password) { alert("未登录"); return; }
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${password}`, "X-Cms-Password": password },
        body: fd,
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.url) editor.chain().focus().setImage({ src: json.data.url }).run();
      else alert(json.error || "上传失败");
    } catch (err: any) { alert(`网络错误: ${err.message}`); }
  };

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = prompt("请输入链接 URL：", "https://");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active
          ? "bg-primary/15 text-primary dark:bg-green-800/40 dark:text-green-300"
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-200"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  const ColorDot = ({ color }: { color: string }) => (
    <span className="inline-block h-3.5 w-3.5 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }} />
  );

  return (
    <><div>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">
          {label}
        </label>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-green-800/50 overflow-hidden bg-white dark:bg-[#0f1a14]">
        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/80 px-3 py-2 dark:border-green-900/30 dark:bg-[#0a1a10]">
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={Undo2} label="撤销" onClick={() => editor.chain().focus().undo().run()} />
            <ToolBtn icon={Redo2} label="重做" onClick={() => editor.chain().focus().redo().run()} />
          </div>
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={Bold} label="粗体" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolBtn icon={Italic} label="斜体" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolBtn icon={UnderlineIcon} label="下划线" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
            <ToolBtn icon={Strikethrough} label="删除线" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
          </div>
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={Heading2} label="大标题" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
            <ToolBtn icon={Heading3} label="小标题" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
          </div>
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={AlignLeft} label="左对齐" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
            <ToolBtn icon={AlignCenter} label="居中" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
            <ToolBtn icon={AlignRight} label="右对齐" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
          </div>
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={List} label="无序列表" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
            <ToolBtn icon={ListOrdered} label="有序列表" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
            <ToolBtn icon={Quote} label="引用" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          </div>
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1 dark:border-green-900/50">
            <ToolBtn icon={Link} label="链接" active={editor.isActive("link")} onClick={addLink} />
            <ToolBtn icon={Image} label="插入图片" onClick={handleImageClick} />
            <ToolBtn icon={Minus} label="分割线" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
            <ToolBtn icon={TableIcon} label="插入表格" onClick={() => setShowTableInserter(true)} />
          </div>
          <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2 ml-1 dark:border-green-900/50">
            <ToolBtn
              icon={Code2}
              label={sourceMode ? "富文本" : "源码"}
              active={sourceMode}
              onClick={() => {
                if (sourceMode) {
                  editor?.commands.setContent(sourceHtml);
                  setSourceMode(false);
                } else {
                  setSourceHtml(editor?.getHTML() || "");
                  setSourceMode(true);
                }
              }}
            />
          </div>
          {/* 文字颜色 */}
          <div className="flex items-center gap-0.5">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className={`flex h-8 w-6 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-green-900/30 ${
                  editor.isActive("textStyle", { color }) ? "bg-primary/10 ring-1 ring-primary/30 dark:bg-green-800/30" : ""
                }`}
              >
                <ColorDot color={color} />
              </button>
            ))}
          </div>
        </div>

        {/* 表格操作工具栏 - 光标在表格内时显示 */}
        {editor.isActive("table") && !sourceMode && (
          <div className="flex items-center gap-0.5 border-b border-amber-200 bg-amber-50/80 px-3 py-1.5 dark:border-amber-800/50 dark:bg-amber-900/20">
            <span className="text-xs text-amber-600 dark:text-amber-400 mr-2 font-medium">表格</span>
            <ToolBtn icon={Rows3} label="上方插入行" onClick={() => editor.chain().focus().addRowBefore().run()} />
            <ToolBtn icon={Rows3} label="下方插入行" onClick={() => editor.chain().focus().addRowAfter().run()} />
            <div className="w-px h-5 bg-amber-200 dark:bg-amber-800/50 mx-1" />
            <ToolBtn icon={Columns3} label="左侧插入列" onClick={() => editor.chain().focus().addColumnBefore().run()} />
            <ToolBtn icon={Columns3} label="右侧插入列" onClick={() => editor.chain().focus().addColumnAfter().run()} />
            <div className="w-px h-5 bg-amber-200 dark:bg-amber-800/50 mx-1" />
            <ToolBtn icon={SplitSquareHorizontal} label="切换表头行" active={editor.isActive("tableHeader")} onClick={() => editor.chain().focus().toggleHeaderRow().run()} />
            <ToolBtn icon={SplitSquareVertical} label="切换表头列" active={editor.isActive("tableHeader")} onClick={() => editor.chain().focus().toggleHeaderColumn().run()} />
            <div className="w-px h-5 bg-amber-200 dark:bg-amber-800/50 mx-1" />
            <ToolBtn icon={Trash2} label="删除行" onClick={() => editor.chain().focus().deleteRow().run()} />
            <ToolBtn icon={Trash2} label="删除列" onClick={() => editor.chain().focus().deleteColumn().run()} />
            <ToolBtn icon={Table2} label="删除表格" onClick={() => editor.chain().focus().deleteTable().run()} />
          </div>
        )}

        {/* 编辑区 */}
        {sourceMode ? (
          <textarea
            value={sourceHtml}
            onChange={(e) => {
              setSourceHtml(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full min-h-[320px] px-5 py-4 outline-none text-sm font-mono text-gray-700 bg-white dark:bg-[#0f1a14] dark:text-green-100 resize-y"
            placeholder="直接编辑 HTML 源码..."
            spellCheck={false}
          />
        ) : (
          <EditorContent editor={editor} />
        )}

        {/* 隐藏的图片上传 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* TipTap 定制样式 */}
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #2d6a4f; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .tiptap blockquote {
          border-left: 4px solid #2d6a4f;
          padding: 0.5rem 1rem;
          margin: 0.75rem 0;
          background: rgba(45, 106, 79, 0.05);
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
          color: #555;
        }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .tiptap li { margin: 0.25rem 0; }
        .tiptap img { max-width: 100%; border-radius: 0.75rem; margin: 0.75rem 0; }
        .tiptap hr { border: none; border-top: 2px dashed #e5e7eb; margin: 1.5rem 0; }
        .tiptap a { color: #2d6a4f; text-decoration: underline; }
        .tiptap code { background: #f3f4f6; padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; font-family: monospace; }
        .tiptap strong { font-weight: 600; }
        .tiptap p { margin: 0.4rem 0; line-height: 1.8; }

        .dark .tiptap h2 { color: #6ee7b7; }
        .dark .tiptap blockquote { background: rgba(45, 106, 79, 0.1); color: #9ca3af; }
        .dark .tiptap code { background: rgba(255,255,255,0.1); }
        .dark .tiptap a { color: #6ee7b7; }
        .tiptap table { border-collapse: collapse; margin: 0.75rem 0; width: 100%; overflow: hidden; }
        .tiptap th,
        .tiptap td { border: 2px solid #9ca3af; padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; min-width: 2rem; position: relative; }
        .tiptap th { background: #e5e7eb; font-weight: 600; color: #1f2937; }
        .tiptap td { background: #fff; color: #374151; }
        .tiptap td p, .tiptap th p { margin: 0; }
        .dark .tiptap th { background: #374151; color: #e5e7eb; border-color: #6b7280; }
        .dark .tiptap td { background: #1f2937; color: #d1d5db; border-color: #6b7280; }

        /* ProseMirror 表格选中单元格样式 */
        .tiptap .selectedCell:after {
          background: rgba(200, 200, 255, 0.15);
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        .dark .tiptap .selectedCell:after {
          background: rgba(110, 231, 183, 0.15);
        }

        /* 列调整手柄 */
        .tiptap .column-resize-handle {
          background-color: #adf;
          bottom: -2px;
          position: absolute;
          right: -2px;
          pointer-events: none;
          top: 0;
          width: 4px;
        }
        .dark .tiptap .column-resize-handle {
          background-color: #6ee7b7;
        }

        /* 表格调整手柄 hover 区域 */
        .tiptap.ProseMirror.resize-cursor {
          cursor: col-resize;
        }
      `}</style>
    </div>
    {pendingFile && (
      <ImageCropper file={pendingFile} onCrop={handleCropUpload} onSkip={handleSkipUpload} onCancel={() => setPendingFile(null)} />
    )}
    {showTableInserter && (
      <TableInserter
        editor={editor}
        onInsert={(html) => {
          // TableInserter 内部使用 insertTable 命令，html 参数保留用于兼容
          setShowTableInserter(false);
        }}
        onClose={() => setShowTableInserter(false)}
      />
    )}
    </>
  );
}
