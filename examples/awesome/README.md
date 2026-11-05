# @innate/domain-awesome

从 `apps/innate-wip` 迁来的 **Awesome** 模块，轨道 A 就地 domain。UI 只消费 `@innate/ui`。

```bash
pnpm dev --profile pages   # examples 仓根；Awesome 在 pages profile 里
# → http://localhost:4020  侧栏 Awesome

pnpm --filter @innate/domain-awesome dev:standalone
# → http://localhost:4022
```
