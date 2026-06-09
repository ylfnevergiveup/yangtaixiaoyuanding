import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // 部署到 /v2/ 路径
  // basePath 必须在 assetPrefix 之前设置，且值相同
  basePath: process.env.ASSET_PREFIX || "",
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
