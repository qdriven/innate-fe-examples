/**
 * 用 innate-fe-cli 把 pages profile 装进框架壳，产出本仓 deploy/。
 * 静态 domain 编进壳，web-showcase 和 wandesk-ui 打成同源 iframe。
 * 预览只有一个端口：pnpm preview → http://127.0.0.1:4173
 *
 * 壳在框架仓，不在本仓。运行期间临时把 registry 的 shell 指过去，
 * 结束时还原清单，以及框架仓里被 gen 改过的接缝文件。
 * plugin.json 不改：iframeSrc 以 / 开头才会被打进壳。
 */
import { spawnSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const wantPreview = process.argv.includes("preview")
/** GitHub Pages 项目站点。本地 `pnpm all` 仍用 PUBLIC_PATH=/。不要设 GITHUB_PAGES。 */
const wantPages = process.argv.includes("pages")
const pagesBase = "/innate-fe-examples"

function findFramework() {
  for (const rel of ["../../base/innate-fe", "../../framework/innate-fe"]) {
    const dir = resolve(root, rel)
    const cli = join(dir, "innate-fe-cli/src/index.ts")
    const shell = join(dir, "shells/webshell")
    if (existsSync(cli) && existsSync(join(shell, "vite.config.ts"))) {
      return { cli, shell }
    }
  }
  console.error(
    "找不到框架壳。请把 innate-fe 放在 ../../base/innate-fe 或 ../../framework/innate-fe。"
  )
  process.exit(1)
}

const { cli, shell } = findFramework()
const yamlPath = join(root, "plugins.registry.yaml")
const onDiskYaml = readFileSync(yamlPath, "utf8")
const shellKey = "shell: shells/webshell"
const absoluteShellKey = `shell: ${shell}`
const originalYaml = onDiskYaml.includes(absoluteShellKey)
  ? onDiskYaml.replace(absoluteShellKey, shellKey)
  : onDiskYaml
if (!originalYaml.includes(shellKey)) {
  console.error(`plugins.registry.yaml 里没有 \`${shellKey}\``)
  process.exit(1)
}

const genDir = join(shell, "src/gen")
const genBackup = join(tmpdir(), `innate-fe-gen-${process.pid}`)
cpSync(genDir, genBackup, { recursive: true })

// Pages 构建会把 PUBLIC_PATH 写进框架仓里被 git 跟踪的 static-manifests.json。
// 产物已经拷进本仓 deploy/ 之后再还原，避免把本机 Pages 路径留在框架仓。
const manifestsPath = join(shell, "src/plugins/static-manifests.json")
const pluginsPublic = join(shell, "public/plugins")
const manifestsBackup = join(tmpdir(), `innate-fe-manifests-${process.pid}.json`)
const pluginsBackup = join(tmpdir(), `innate-fe-plugins-${process.pid}`)
if (wantPages) {
  if (existsSync(manifestsPath)) cpSync(manifestsPath, manifestsBackup)
  if (existsSync(pluginsPublic)) {
    cpSync(pluginsPublic, pluginsBackup, { recursive: true })
  }
}

function restore() {
  writeFileSync(yamlPath, originalYaml)
  rmSync(genDir, { recursive: true, force: true })
  cpSync(genBackup, genDir, { recursive: true })
  rmSync(genBackup, { recursive: true, force: true })
  if (wantPages) {
    if (existsSync(manifestsBackup)) {
      cpSync(manifestsBackup, manifestsPath)
      rmSync(manifestsBackup, { force: true })
    }
    rmSync(pluginsPublic, { recursive: true, force: true })
    if (existsSync(pluginsBackup)) {
      cpSync(pluginsBackup, pluginsPublic, { recursive: true })
      rmSync(pluginsBackup, { recursive: true, force: true })
    }
  }
}

function run(args, env) {
  const result = spawnSync("bun", [cli, ...args], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  })
  if ((result.status ?? 1) !== 0) {
    throw new Error(`innate-fe-cli ${args.join(" ")} 退出 ${result.status ?? 1}`)
  }
}

const buildEnv = wantPages
  ? {
      PUBLIC_PATH: `${pagesBase}/`,
      PLUGIN_BASE_PATH: `${pagesBase}/plugins/web-showcase`,
      GITHUB_PAGES: "",
    }
  : {
      PUBLIC_PATH: "/",
      PLUGIN_BASE_PATH: "/plugins/web-showcase",
    }

let failed = false
try {
  writeFileSync(
    yamlPath,
    originalYaml.replace(shellKey, `shell: ${shell}`)
  )

  run(["gen", "--profile", "pages", "--refresh"], buildEnv)
  run(
    ["prepare", "--profile", "pages", ...(wantPages ? ["--force"] : [])],
    buildEnv
  )
  run(["build", "--profile", "pages"], buildEnv)
  run(["assemble", "--profile", "pages"], buildEnv)
  if (wantPages) {
    const deploy = join(root, "deploy")
    cpSync(join(deploy, "index.html"), join(deploy, "404.html"))
    writeFileSync(join(deploy, ".nojekyll"), "")
    console.log(
      `\nPages 包已组装到 deploy/（PUBLIC_PATH=${buildEnv.PUBLIC_PATH}，含 404.html 与 .nojekyll）`
    )
  } else {
    console.log("\n整站已组装到 deploy/")
  }
  if (wantPreview) {
    console.log("预览 http://127.0.0.1:4173")
    run(["preview", "--profile", "pages"], buildEnv)
  } else if (!wantPages) {
    console.log("一个端口查看：pnpm preview  →  http://127.0.0.1:4173")
  }
} catch (err) {
  failed = true
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
} finally {
  restore()
  if (failed) process.exit(process.exitCode ?? 1)
}
