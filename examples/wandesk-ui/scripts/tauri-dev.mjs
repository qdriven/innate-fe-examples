/**
 * Run the desktop shell in development.
 *
 * Bakes i18n tokens, starts the Vite dev server, then launches `tauri dev`.
 * In dev mode, Tauri loads from the Vite dev server (http://localhost:5173).
 * Requires a Rust toolchain and Node >= 22.5.
 */
import { spawn, spawnSync } from "node:child_process"
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

// Start Vite dev server in background
const vite = spawn(
  join(repoDir, "node_modules", ".bin", "vite"),
  ["--config", "ui/vite.config.ts", "ui"],
  { cwd: repoDir, env: cargoEnv, stdio: "inherit", detached: true }
)

// Wait a bit for Vite to start
await new Promise((resolve) => setTimeout(resolve, 3000))

// Launch Tauri dev
step(join(repoDir, "node_modules", ".bin", "tauri"), ["dev"])

// Cleanup Vite on exit
vite.kill()
