"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Table, X, Plus, Minus } from "lucide-react";

interface Props {
  editor: Editor;
  onInsert: (html: string) => void;
  onClose: () => void;
}

export default function TableInserter({ editor, onInsert, onClose }: Props) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);
  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: 3 }, () => Array(3).fill(""))
  );

  const updateSize = (r: number, c: number) => {
    const nr = Math.max(1, Math.min(8, r));
    const nc = Math.max(1, Math.min(6, c));
    setRows(nr);
    setCols(nc);
    setData(prev => {
      const nd = Array.from({ length: nr }, (_, ri) =>
        Array.from({ length: nc }, (_, ci) => (prev[ri]?.[ci]) || "")
      );
      return nd;
    });
  };

  const updateCell = (ri: number, ci: number, val: string) => {
    setData(prev => {
      const nd = prev.map(r => [...r]);
      nd[ri][ci] = val;
      return nd;
    });
  };

  const insertTable = () => {
    const tableRows = rows;
    const tableCols = cols;
    const tableHasHeader = hasHeader;

    // 先关闭模态框，让编辑器重新获得焦点
    onClose();

    // 延迟插入，确保编辑器已重新获得焦点
    setTimeout(() => {
      editor
        .chain()
        .focus()
        .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: tableHasHeader })
        .run();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-[#1a2e22]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Table className="h-5 w-5 text-primary dark:text-green-300" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">插入表格</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">行数</span>
              <button onClick={() => updateSize(rows - 1, cols)} className="h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"><Minus className="h-4 w-4 text-gray-700 dark:text-gray-200" /></button>
              <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-lg">{rows}</span>
              <button onClick={() => updateSize(rows + 1, cols)} className="h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"><Plus className="h-4 w-4 text-gray-700 dark:text-gray-200" /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">列数</span>
              <button onClick={() => updateSize(rows, cols - 1)} className="h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"><Minus className="h-4 w-4 text-gray-700 dark:text-gray-200" /></button>
              <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-lg">{cols}</span>
              <button onClick={() => updateSize(rows, cols + 1)} className="h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"><Plus className="h-4 w-4 text-gray-700 dark:text-gray-200" /></button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="rounded w-4 h-4" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">带表头</span>
            </label>
          </div>

          {/* 表格编辑区 */}
          <div className="overflow-x-auto rounded-lg border-2 border-gray-300 dark:border-gray-500">
            <table className="w-full border-collapse">
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => {
                      const isHeader = hasHeader && ri === 0;
                      return (
                        <td key={ci} className={`border border-gray-300 dark:border-gray-500 p-0 ${isHeader ? "bg-blue-50 dark:bg-blue-900/40" : "bg-white dark:bg-gray-800"}`}>
                          <input
                            value={cell}
                            onChange={e => updateCell(ri, ci, e.target.value)}
                            placeholder={isHeader ? "表头" : "内容"}
                            className={`w-full px-3 py-2 text-sm outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 ${isHeader ? "font-bold text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-100"}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-3.5 border-t border-gray-200 dark:border-gray-600">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-500 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">取消</button>
          <button onClick={insertTable} className="flex-1 rounded-lg bg-primary dark:bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark dark:hover:bg-green-500">插入表格</button>
        </div>
      </div>
    </div>
  );
}
