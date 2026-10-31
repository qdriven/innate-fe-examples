# @innate/domain-feed

从 `apps/innate-wip` 迁来的 **Feed** 模块，轨道 A 就地 domain。UI 只消费 `@innate/ui`。

```bash
bun tools/innate-fe-cli/src/index.ts dev --profile wip
# → http://localhost:4020  侧栏 Feed

pnpm --filter @innate/domain-feed dev:standalone
# → http://localhost:4021
```
