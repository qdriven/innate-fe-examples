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
  // @innate/* 是 workspace:*，由 innate-fe 框架仓解析（源码直出），需要转译
  transpilePackages: [
    "@innate/ui",
    "@innate/admin-composites",
    "@innate/scene-catalog",
    "@innate/scene-mocks",
  ],
  turbopack: {
    // 迁移到 innate-fe-examples 仓后，@innate/* 经仓外软链进来
    // (../../framework/innate-fe/packages/*)。turbopack 只解析 root 之内的模块，
    // 故 root 须指到同时覆盖 apps/innate-fe-examples 与 framework/innate-fe 的公共父目录
    //（与 web-showcase 的 next.config 同一约定；否则报
    // "webpack loader path ... is outside configured roots"）。
    root: path.resolve(__dirname, "../../../../"),
  },
}
module.exports = nextConfig
