import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取 qa.json
const qaData = JSON.parse(
  readFileSync(join(__dirname, "..", "public", "data", "qa.json"), "utf-8")
);

// 输出每条记录的插入命令
const cmds = qaData.map((q) => {
  const doc = {
    insert: "qa",
    documents: [q],
  };
  return {
    TableName: "qa",
    CommandType: "INSERT",
    Command: JSON.stringify(doc),
  };
});

console.log(JSON.stringify(cmds));
