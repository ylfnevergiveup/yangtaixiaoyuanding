"use client";

import { useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { products, productCategories } from "@/data/products";

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-[#0f1a14] dark:to-[#0f1a14] border-b border-green-200/50 dark:border-green-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl dark:text-green-200">
              🛒 好物推荐
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              阳台园艺好物评测，每件商品都经过场景适配验证，放心选购
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {productCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeCategory === cat.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 ring-1 ring-green-200/50 hover:bg-green-50 dark:bg-[#1a2e22]/80 dark:text-gray-400 dark:ring-green-800/50 dark:hover:bg-green-900/30"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#1a2e22]/80 dark:ring-white/5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-leaf-light/30 to-sky-100/30 dark:from-green-800/20 dark:to-sky-900/20 flex items-center justify-center text-2xl">
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-green-100">
                        {product.name}
                      </h3>
                      <span className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        {product.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-green-800/30 dark:text-green-300">
                        {product.category}
                      </span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-green-200">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {product.description}
                </p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-300 mb-2">👍 优点</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.pros.map((p, i) => (
                      <span key={i} className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-green-50/80 p-3 mb-4 dark:bg-green-900/10">
                  <p className="text-xs text-primary dark:text-green-300">
                    💡 <strong>选购建议：</strong> {product.recommendation}
                  </p>
                </div>

                {product.buyLink && (
                  <a
                    href={product.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-light hover:shadow-md"
                  >
                    <ExternalLink className="h-4 w-4" />
                    去购买
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
