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
    root: path.resolve(__dirname, "../.."),
  },
}
module.exports = nextConfig
