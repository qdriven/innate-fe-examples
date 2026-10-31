const path = require("path")
const {
  getAllowedDevOrigins,
} = require("../../scripts/next-allowed-dev-origins")

const isGitHubPages = process.env.GITHUB_PAGES === "true"
/** 静态导入 webshell `/plugins/<id>/` 时设 PLUGIN_BASE_PATH=/plugins/web-showcase */
const pluginBasePath = process.env.PLUGIN_BASE_PATH || ""
const basePath = isGitHubPages
  ? process.env.NEXT_PUBLIC_BASE_PATH || "/innate-fe-templates"
  : pluginBasePath

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  output: "export",
  distDir: "dist",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
  turbopack: {
    // 迁移到 innate-fe-examples 仓后，@innate/* 经仓外软链进来
    // (../../framework/innate-fe/packages/*)。turbopack 只解析 root 之内的模块，
    // 故 root 须指到同时覆盖 apps/innate-fe-examples 与 framework/innate-fe 的公共父目录。
    root: path.resolve(__dirname, "../../../../"),
  },
}
module.exports = nextConfig
