const path = require("path")
const {
  getAllowedDevOrigins,
} = require("../../scripts/next-allowed-dev-origins")

const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 被 webshell :4020 iframe 嵌入时，允许壳 origin 拉 /_next/* 与 HMR。
  // 对接清单：docs/specs/innate.web-plugin.iframe-onboarding.md §4
  allowedDevOrigins: getAllowedDevOrigins(),
  ...(isStaticExport ? { output: "export" } : {}),
  distDir: "dist",
  // @innate/* 通过 file: 指向 ../innate-fe-base（源码直出），需要转译
  transpilePackages: [
    "@innate/ui",
    "@innate/admin-composites",
    "@innate/scene-catalog",
    "@innate/scene-mocks",
  ],
  turbopack: {
    // 共同祖先（base/），覆盖本仓库与 innate-fe-base 的 file: 依赖
    root: path.resolve(__dirname, "../../.."),
  },
}
module.exports = nextConfig
