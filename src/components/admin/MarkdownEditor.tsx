"use client";

import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link, Quote, Image, Eye, EyeOff, Minus } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
}

// 轻量 Markdown 转 HTML（用于预览）
function renderMarkdown(text: string): string {
  let html = text
    // 转义 HTML
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // 图片 ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />')
    // 链接 [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary underline">$1</a>')
    // 粗体 **text** 或 __text__
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    // 斜体 *text*（不匹配列表项）
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    // 行内代码 `code`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">$1</code>')
    // 分割线
    .replace(/^---$/gm, '<hr class="my-4 border-gray-200 dark:border-gray-700" />')
    // 引用块
    .replace(/^&gt;\s?(.*)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-2 text-gray-600 dark:text-gray-400 italic">$1</blockquote>');

  // 处理标题和列表
  const lines = html.split("\n");
  let inList = false, inOrderedList = false;
  const result: string[] = [];

  for (const line of lines) {
    // 标题
    if (/^### (.+)/.test(line)) {
      result.push(`<h3 class="text-lg font-semibold text-gray-800 dark:text-green-100 mt-4 mb-2">${line.replace(/^### /, "")}</h3>`);
      continue;
    }
    if (/^## (.+)/.test(line)) {
      result.push(`<h2 class="text-xl font-semibold text-primary-dark dark:text-green-200 mt-6 mb-3">${line.replace(/^## /, "")}</h2>`);
      continue;
    }

    // 无序列表
    if (/^[-*]\s/.test(line)) {
      if (!inList) { result.push('<ul class="list-disc pl-5 space-y-1 my-2">'); inList = true; }
      const content = line.replace(/^[-*]\s/, "");
      result.push(`<li class="text-gray-600 dark:text-gray-400">${content}</li>`);
      continue;
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      if (!inOrderedList) { result.push('<ol class="list-decimal pl-5 space-y-1 my-2">'); inOrderedList = true; }
      const content = line.replace(/^\d+\.\s/, "");
      result.push(`<li class="text-gray-600 dark:text-gray-400">${content}</li>`);
      continue;
    }

    // 关闭列表
    if (inList && line.trim() === "") { result.push("</ul>"); inList = false; }
    if (inOrderedList && line.trim() === "") { result.push("</ol>"); inOrderedList = false; }

    // 空行 → 段落分隔
    if (line.trim() === "") {
      result.push('<div class="h-3"></div>');
      continue;
    }

    // 普通段落
    result.push(`<p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">${line}</p>`);
  }

  if (inList) result.push("</ul>");
  if (inOrderedList) result.push("</ol>");

  return result.join("\n");
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: "粗体", insert: "**粗体文本**", wrap: ["**", "**"] },
  { icon: Italic, label: "斜体", insert: "*斜体文本*", wrap: ["*", "*"] },
  { icon: Heading2, label: "二级标题", insert: "## 标题\n", prefix: "## " },
  { icon: Heading3, label: "三级标题", insert: "### 标题\n", prefix: "### " },
  { icon: List, label: "无序列表", insert: "- 列表项\n", prefix: "- " },
  { icon: ListOrdered, label: "有序列表", insert: "1. 列表项\n", prefix: "1. " },
  { icon: Quote, label: "引用", insert: "> 引用文字\n", prefix: "> " },
  { icon: Link, label: "链接", insert: "[链接文字](https://)", wrap: ["[", "](https://)"] },
  { icon: Image, label: "图片", insert: "![图片描述](图片URL)", wrap: ["![", "](图片URL)"] },
  { icon: Minus, label: "分割线", insert: "\n---\n" },
];

export default function MarkdownEditor({ value, onChange, label = "正文", rows = 14 }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback((item: typeof TOOLBAR_BUTTONS[0]) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);

    let newText: string;
    let cursorPos: number;

    if (item.wrap && selected) {
      // 有选中文本 → 包裹
      newText = value.substring(0, start) + item.wrap[0] + selected + item.wrap[1] + value.substring(end);
      cursorPos = start + item.wrap[0].length + selected.length + item.wrap[1].length;
    } else if (item.prefix) {
      // 行首插入前缀
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      newText = value.substring(0, lineStart) + item.prefix + value.substring(lineStart);
      cursorPos = lineStart + item.prefix.length;
    } else if (item.insert) {
      newText = value.substring(0, start) + item.insert + value.substring(end);
      cursorPos = start + item.insert.length;
    } else {
      return;
    }

    onChange(newText);
    // 恢复光标位置
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [value, onChange]);

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-green-300 mb-1">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-green-800/50 dark:bg-[#0a1a10]">
        {TOOLBAR_BUTTONS.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={() => insertText(btn)}
            title={btn.label}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-200"
          >
            <btn.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            showPreview
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-green-200"
          }`}
          title={showPreview ? "关闭预览" : "预览"}
        >
          {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showPreview ? "编辑" : "预览"}
        </button>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div
          className="min-h-[300px] max-h-[70vh] overflow-y-auto rounded-b-lg border border-t-0 border-gray-200 bg-white px-4 py-3 dark:border-green-800/50 dark:bg-[#0f1a14]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-gray-400 italic">暂无内容</p>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-b-lg border border-t-0 border-gray-200 bg-white px-4 py-3 text-sm outline-none resize-y focus:border-primary dark:bg-[#0f1a14] dark:border-green-800/50 dark:text-green-100 dark:placeholder:text-gray-600 font-mono"
          placeholder="输入 Markdown 格式内容…&#10;&#10;## 二级标题&#10;正文内容，支持 **粗体** 和 *斜体*&#10;- 列表项&#10;- 另一项&#10;&#10;> 引用文字"
        />
      )}
    </div>
  );
}
