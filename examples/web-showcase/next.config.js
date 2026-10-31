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
    root: path.resolve(__dirname, "../.."),
  },
}
module.exports = nextConfig
