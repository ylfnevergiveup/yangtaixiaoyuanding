/**
 * Markdown 渲染组件
 * 兼容两种数据格式：新格式（字符串）和旧格式（字符串数组）
 */
interface Props {
  content: string | string[];
}

export default function MarkdownRenderer({ content }: Props) {
  // 兼容旧格式：数组用空行拼接
  const text = Array.isArray(content) ? content.join("\n\n") : (content || "");

  // 如果是 HTML 格式（TipTap 富文本编辑器输出），直接渲染
  if (typeof text === "string" && /<\/?[a-z][\s\S]*>/i.test(text)) {
    return (
      <div
        className="prose prose-green dark:prose-invert max-w-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary-dark [&_h2]:mt-8 [&_h2]:mb-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-green-50/50 [&_blockquote]:rounded-r-xl
          [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
          [&_li]:my-1 [&_li]:text-gray-600
          [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4
          [&_hr]:my-6 [&_hr]:border-gray-200
          [&_a]:text-primary [&_a]:underline
          [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
          [&_strong]:font-semibold
          [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-3
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm [&_table]:overflow-x-auto
          [&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-100 [&_th]:font-semibold [&_th]:text-left [&_th]:text-gray-700
          [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2 [&_td]:text-gray-600
          dark:[&_blockquote]:text-gray-400 dark:[&_blockquote]:bg-green-900/10
          dark:[&_li]:text-gray-400 dark:[&_p]:text-gray-400
          dark:[&_code]:bg-gray-800 dark:[&_a]:text-green-300 dark:[&_hr]:border-gray-700
          dark:[&_h2]:text-green-200
          dark:[&_th]:bg-gray-700 dark:[&_th]:border-gray-600 dark:[&_th]:text-gray-200
          dark:[&_td]:border-gray-600 dark:[&_td]:text-gray-300"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 分割线
    if (/^---$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-6 border-gray-200 dark:border-gray-700" />);
      i++;
      continue;
    }

    // 图片 ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        <img key={i} src={imgMatch[2]} alt={imgMatch[1]} className="rounded-xl max-w-full my-4" />
      );
      i++;
      continue;
    }

    // 标题 ### (三级)
    if (/^### (.+)/.test(line)) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-gray-800 dark:text-green-100 mt-6 mb-3">
          {parseInline(line.replace(/^### /, ""))}
        </h3>
      );
      i++;
      continue;
    }

    // 标题 ## (二级)
    if (/^## (.+)/.test(line)) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold text-primary-dark dark:text-green-200 mt-8 mb-4">
          {parseInline(line.replace(/^## /, ""))}
        </h2>
      );
      i++;
      continue;
    }

    // 引用块 (可能多行)
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].replace(/^> /, ""));
        i++;
      }
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 my-4 text-gray-600 dark:text-gray-400 italic bg-green-50/50 dark:bg-green-900/10 rounded-r-xl">
          {quoteLines.map((ql, qi) => (
            <p key={qi} className={qi > 0 ? "mt-2" : ""}>{parseInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 无序列表
    if (/^[-*]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc pl-5 space-y-2 my-4">
          {listItems.map((item, li) => (
            <li key={li} className="text-gray-600 dark:text-gray-400 pl-1">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal pl-5 space-y-2 my-4">
          {listItems.map((item, li) => (
            <li key={li} className="text-gray-600 dark:text-gray-400 pl-1">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 空行
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />);
      i++;
      continue;
    }

    // 普通段落（支持内联格式）
    elements.push(
      <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}

/** 解析行内 Markdown：粗体、斜体、链接、行内代码 */
function parseInline(text: string): React.ReactNode {
  let key = 0;

  // 图片（行内）
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  // 链接
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // 粗体
  const boldRegex = /\*\*([^*]+)\*\*/g;
  // 行内代码
  const codeRegex = /`([^`]+)`/g;
  // 斜体
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;

  // 简化：按顺序处理
  let result: (string | React.ReactNode)[] = [text];

  // 处理行内代码
  result = flatten(result, codeRegex, (match) => (
    <code key={key++} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary-dark dark:text-green-200">
      {match[1]}
    </code>
  ));

  // 处理粗体
  result = flatten(result, boldRegex, (match) => (
    <strong key={key++}>{match[1]}</strong>
  ));

  // 处理斜体
  result = flatten(result, italicRegex, (match) => (
    <em key={key++}>{match[1]}</em>
  ));

  // 处理链接
  result = flatten(result, linkRegex, (match) => (
    <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-dark">
      {match[1]}
    </a>
  ));

  // 处理图片
  result = flatten(result, imgRegex, (match) => (
    <img key={key++} src={match[2]} alt={match[1]} className="inline rounded-lg max-h-6 align-middle" />
  ));

  return <>{result}</>;
}

/** 用正则切分字符串并用回调处理匹配项 */
function flatten(
  input: (string | React.ReactNode)[],
  regex: RegExp,
  fn: (match: RegExpExecArray) => React.ReactNode
): (string | React.ReactNode)[] {
  const output: (string | React.ReactNode)[] = [];
  for (const item of input) {
    if (typeof item !== "string") {
      output.push(item);
      continue;
    }
    let lastIndex = 0;
    const r = new RegExp(regex.source, regex.flags);
    let m: RegExpExecArray | null;
    while ((m = r.exec(item)) !== null) {
      if (m.index > lastIndex) output.push(item.slice(lastIndex, m.index));
      output.push(fn(m));
      lastIndex = m.index + m[0].length;
    }
    if (lastIndex < item.length) output.push(item.slice(lastIndex));
  }
  return output;
}
