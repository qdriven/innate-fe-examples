const os = require("node:os")

/**
 * Hosts allowed to load Next.js dev assets (/_next/*, HMR) cross-origin.
 * 共享自 innate-fe 框架仓 scripts/next-allowed-dev-origins.js；
 * examples/<id>/next.config.js 用 ../../scripts/... 引用到这里。
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
 */
function getAllowedDevOrigins() {
  const hosts = new Set(["localhost", "127.0.0.1", "::1"])

  const fromEnv = process.env.ALLOWED_DEV_ORIGINS
  if (fromEnv) {
    for (const entry of fromEnv.split(",")) {
      const host = entry.trim()
      if (host) hosts.add(host)
    }
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      for (const interfaces of Object.values(os.networkInterfaces())) {
        if (!interfaces) continue
        for (const net of interfaces) {
          if (net.family === "IPv4" && !net.internal && net.address) {
            hosts.add(net.address)
          }
        }
      }
    } catch {
      // os.networkInterfaces() may fail in restricted environments; ALLOWED_DEV_ORIGINS still works.
    }
  }

  return [...hosts]
}

module.exports = { getAllowedDevOrigins }
