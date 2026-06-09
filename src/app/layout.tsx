import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageViewTracker from "@/components/PageViewTracker";
import AuthWrapper from "@/components/AuthWrapper";
import ImageErrorHandler from "@/components/ImageErrorHandler";

export const metadata: Metadata = {
  title: {
    default: "阳台小园丁 - 家庭园艺与阳台种植指南",
    template: "%s | 阳台小园丁",
  },
  description:
    "专注家庭园艺与阳台种植的知识社区。提供植物百科、种植指南、种植日历、工具推荐和社区问答，帮助城市园艺爱好者打造属于自己的绿色小天地。",
  keywords: [
    "阳台种植",
    "家庭园艺",
    "种菜",
    "阳台花园",
    "盆栽",
    "多肉植物",
    "种植指南",
    "都市农业",
  ],
  openGraph: {
    title: "阳台小园丁 - 家庭园艺与阳台种植指南",
    description:
      "让每个阳台都变成绿色小天地。城市园艺爱好者的知识社区。",
    type: "website",
    locale: "zh_CN",
    siteName: "阳台小园丁",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <head>
        {/* ===== 安全相关 meta 标签 ===== */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* 百度统计 - 先不开启，如需开启请替换 YOUR_BAIDU_ID */}
        {false && (
          <script dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_ID";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `
          }} />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#f8faf8] text-[#1a1a2e] dark:bg-[#0f1a14] dark:text-[#e8f0e8]">
        <AuthWrapper>
          <ImageErrorHandler />
          <PageViewTracker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
