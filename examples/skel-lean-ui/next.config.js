const path = require("path")
const {
  getAllowedDevOrigins,
} = require("../../scripts/next-allowed-dev-origins")

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  // 动态模式：Playground 需要 API 路由执行真实流水线（skelc / skel2lean / lean）。
  distDir: "dist",
  turbopack: {
    // 迁移到 innate-fe-examples 仓后，@innate/* 经仓外软链进来
    // (../../framework/innate-fe/packages/*)。turbopack 只解析 root 之内的模块，
    // 故 root 须指到同时覆盖 apps/innate-fe-examples 与 framework/innate-fe 的公共父目录
    //（与 web-showcase / admin-nextjs 同一约定）。
    root: path.resolve(__dirname, "../../../../"),
  },
}
module.exports = nextConfig
