import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-green-200/50 bg-gradient-to-b from-white to-green-50/50 dark:from-[#0f1a14] dark:to-[#0f1a14] dark:border-green-900/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-leaf text-white">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-primary-dark dark:text-green-300">
                阳台小园丁
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              让每个阳台都变成绿色小天地。<br />
              城市园艺爱好者的知识社区。
            </p>
          </div>

          {/* 探索 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-green-200 mb-3">探索</h3>
            <ul className="space-y-2">
              <li><Link href="/plants" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">植物百科</Link></li>
              <li><Link href="/guides" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">种植指南</Link></li>
              <li><Link href="/calendar" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">种植日历</Link></li>
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-green-200 mb-3">资源</h3>
            <ul className="space-y-2">
              <li><Link href="/tools" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">工具推荐</Link></li>
              <li><Link href="/community" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">社区问答</Link></li>
              <li><Link href="/guides?category=diy" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-green-300">DIY教程</Link></li>
            </ul>
          </div>

          {/* 关于 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-green-200 mb-3">关于</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500 dark:text-gray-400">为城市园艺爱好者而生</span></li>
              <li><span className="text-sm text-gray-500 dark:text-gray-400">© 2026 阳台小园丁</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-green-200/50 pt-6 text-center dark:border-green-900/30">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            用心种下每一颗种子，收获满满的绿色幸福 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}
