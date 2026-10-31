# @innate/domain-sqlite-admin

只读 SQLite 工作台，轨道 A domain。界面用 `@innate/ui`，查询打到本机 API。页面上填写数据库文件路径，或启动前设置 `SQLITE_DB_PATH`。已保存的 SQL 放在边车库里，不写进目标文件。

不是静态站，不进 GitHub Pages。

```bash
pnpm --filter @innate/domain-sqlite-admin dev:server
# → http://127.0.0.1:4030/api/sqlite-admin

pnpm --filter @innate/domain-sqlite-admin dev:standalone
# → http://127.0.0.1:4031/sqlite-admin
```
