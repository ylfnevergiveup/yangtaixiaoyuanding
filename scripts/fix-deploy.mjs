/**
 * 修复部署脚本 — clean version
 * 不做路径改写，不加版本号，只保留必要的兼容修复
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, cpSync } from "fs";
import { join, dirname } from "path";

const OUT_DIR = "/Users/yelifeng/Documents/trae_projects/plant-/out";

console.log("📝 保持原始路径不变...");

// 1. Old CSS filename copies for backward compatibility
const chunkDirs = [join(OUT_DIR, "_next", "static", "chunks")];
const OLD_CSS = "0dukmg1nvee_i.css";
for (const cd of chunkDirs) {
  if (existsSync(cd)) {
    const entries = readdirSync(cd);
    const cssFile = entries.find(e => e.endsWith(".css"));
    if (cssFile && cssFile !== OLD_CSS) {
      cpSync(join(cd, cssFile), join(cd, OLD_CSS));
    }
  }
}
console.log("📋 旧版 CSS 文件名兼容");

// 2. Fix RSC notFound boundary issue
console.log("🔧 修复 RSC notFound 边界问题...");
function fixRscNotFound(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      fixRscNotFound(fullPath);
    } else if (entry === "index.html") {
      const relativePath = fullPath.replace(OUT_DIR, "");
      const routeDir = dirname(relativePath);
      if (routeDir === "/_not-found") continue;

      let html = readFileSync(fullPath, "utf-8");
      const escapedPattern = '\\\\"notFound\\\\":[[[\\\\"$\\\\",\\\\"title\\\\"';
      const escapedPattern2 = '\\"notFound\\":[[[\\"$\\",\\"title\\"';
      let notFoundStart = html.indexOf(escapedPattern);
      if (notFoundStart === -1) notFoundStart = html.indexOf(escapedPattern2);
      if (notFoundStart === -1) continue;

      let bracketDepth = 0, startFound = false, endPos = -1;
      for (let i = notFoundStart; i < html.length; i++) {
        if (html[i] === '[') { bracketDepth++; startFound = true; }
        else if (html[i] === ']') { bracketDepth--; if (startFound && bracketDepth === 0) { endPos = i; break; } }
      }
      if (endPos === -1) continue;

      const replacement = '\\"notFound\\":\\"$undefined\\"';
      const fixedHtml = html.substring(0, notFoundStart) + replacement + html.substring(endPos + 1);
      const pushCount = (fixedHtml.match(/self\.__next_f\.push/g) || []).length;
      const originalPushCount = (html.match(/self\.__next_f\.push/g) || []).length;
      if (pushCount !== originalPushCount) continue;

      writeFileSync(fullPath, fixedHtml);
    }
  }
}
fixRscNotFound(OUT_DIR);

console.log("🎉 完成！");
