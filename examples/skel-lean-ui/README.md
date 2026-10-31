# @innate/skel-lean-ui — Skel × Lean 契约验证台

基于 innate-fe-base（Next.js 16 + `@innate/ui`）构建的整合演示 UI：把
[yorun-ai/skel-lean-demo](../../../../../yorun-ai/skel-lean-demo) 流水线的真实产物
渲染成产品经理与工程师都能看的验证看板，并提供**端到端 Playground**：
自然语言 → 生成 .skel → 生成 Lean / Go → 真实流水线验证 → 看板即刻展示。

```
自然语言描述 ──LLM/启发式──▶ .skel 契约（可编辑）
                               │ skelc check · skel2lean · lean 编译 · gen go
                               ▼
                     基线演示或你的契约 ──▶ 契约目录 / 规则卡片 / 变更影响 / 代码对照
```

## 页面

| 路由                  | 内容                                                        | 面向   |
| --------------------- | ----------------------------------------------------------- | ------ |
| `/playground`         | **端到端流程**：描述业务 → 生成契约 → 运行流水线 → 查看结果 | 所有人 |
| `/` 总览              | 验证链路、流水线状态、假定理被拒绝对照                      | 所有人 |
| `/contracts` 契约目录 | 限界上下文的全部声明（skelc schema snapshot 实时输出）      | 工程   |
| `/rules` 业务规则卡片 | 每条 Lean 定理 → 中文规则 + 验证徽章 + 对应 Go 测试         | 产品   |
| `/evolution` 变更影响 | BREAKING/DANGEROUS/COMPATIBLE 的业务后果翻译 + 证明失效实录 | 产品   |
| `/code` 代码对照      | 契约源 / 生成 Lean / 手写定理 / 生成 Go / 性质测试多视角    | 工程   |

## 使用

```bash
# 前置：skel-lean-demo 已运行过 ./run-demo.sh（生成 bin/ 与 .lake 构建产物）
pnpm --filter @innate/skel-lean-ui collect     # 刷新基线数据 → src/data/demo-snapshot.json
pnpm --filter @innate/skel-lean-ui dev         # http://localhost:4010
```

### Playground 的两种生成引擎

- **Kimi 引擎**（本机已登录时默认）：通过本地 Kimi CLI（`kimi -p` 非交互模式）
  生成契约，随后立即用 skelc check 验证，失败自动带诊断重试（最多 3 轮自修复）。
  探测路径：`KIMI_BIN` 环境变量 > `~/.kimi-code/bin/kimi` > `~/.local/bin/kimi`；
  登录态检查 `~/.kimi/credentials`。启用方式：
  ```bash
  kimi login   # 一次性设备码授权
  ```
- **本地启发式引擎**（兜底）：无外部依赖。从中文描述识别
  「实体（字段…）」句式与操作动词，内置常见字段词典
  （单价→unitPrice decimal、入库时间→storedAt timestamp 等）。
  识别不到的部分给出最小可编译模板 + notes，用户在编辑器里补全。

### API

| 路由                 | 作用                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| `POST /api/generate` | `{description}` → `{engine, skel, notes}`                                   |
| `POST /api/compile`  | `{skel}` → 沙箱执行 skelc check / skel2lean / lean 编译 / snapshot / gen go |
| `POST /api/reset`    | 清除 Playground 覆盖，看板恢复基线演示                                      |
| `GET /api/state`     | 当前模式、LLM 通道可用性、活动快照                                          |

## 结构

```
apps/skel-lean-ui/
├── scripts/collect-demo-data.mjs       # 基线数据采集（真实执行流水线）
├── src/data/demo-snapshot.json         # 基线采集产物（提交以便离线构建）
├── data/playground-state.json          # Playground 运行时状态（gitignore）
├── src/lib/pipeline-types.ts           # 流水线共享类型（客户端/服务端）
├── src/lib/snapshot.ts                 # 快照类型 + PM 话术翻译层
├── src/lib/view.ts                     # 视图适配：playground ↔ 基线快照（服务端）
├── src/lib/server/                     # paths / heuristic / llm / pipeline / store
├── src/app/api/{generate,compile,reset,state}/  # API 路由（Node runtime）
├── src/components/                     # AppShell / Playground 流 / 视图组件
└── src/app/                            # 六个页面（动态渲染）
```

## 安全边界

用户提交的 Skel 源在临时目录沙箱中处理：域名白名单校验（防路径穿越）、
拒绝 import（单 domain）、生成产物 realpath 校验；仅执行只读性质的
检查/生成命令，不运行生成的代码。

## 维护说明

- `@innate/ui` 为唯一组件来源（遵守仓库 PRIMITIVES_POLICY：语义 token、
  不在 app 内复制 primitive）。
- 数据结构变更时同步修改 `src/lib/snapshot.ts` 的 `DemoSnapshot` 类型与
  `scripts/collect-demo-data.mjs` 的产出字段。
