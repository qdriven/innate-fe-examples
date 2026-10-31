/**
 * Build a distributable desktop app (.app / .dmg on macOS).
 *
 * Bakes i18n tokens, builds the Vite frontend, then runs `tauri build`.
 * The result is UNSIGNED — signing and notarization are downstream concerns.
 * Requires a Rust toolchain and Node >= 22.5.
 */
import { spawnSync } from "node:child_process"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { withDesktopCargoEnv } from "../../../../desktop-cargo/env.mjs"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoDir = resolve(scriptDir, "..")
const cargoEnv = withDesktopCargoEnv()

const step = (cmd, args) => {
  const res = spawnSync(cmd, args, {
    cwd: repoDir,
    env: cargoEnv,
    stdio: "inherit",
  })
  if (res.status !== 0) process.exit(res.status ?? 1)
}

// Bake i18n tokens
step(process.execPath, [join(scriptDir, "start.ts"), "zh", "--force"])

// Build Tauri app (frontend is built automatically via tauri.conf.json)
step(join(repoDir, "node_modules", ".bin", "tauri"), ["build"])
