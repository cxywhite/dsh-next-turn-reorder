# dsh-next-turn-reorder 发布清单

社区插件 `dsh-next-turn-reorder`：为 DSH 的 next-turn 队列提供重排能力。

## 1. 本地质量检查

```sh
cd dsh-next-turn-reorder
node --check index.js && node --check client.js     # 语法
node -e "JSON.parse(require('fs').readFileSync('package.json'))"   # manifest
node -e "JSON.parse(require('fs').readFileSync('locale/en.json')); JSON.parse(require('fs').readFileSync('locale/zh.json'))"
# icon.svg：有效 SVG、≤256 KiB、路径留在包内（本包为包内 icon.svg，无外部引用）
```

已通过：handler 逻辑单测（重排/越界/缺失/方向/空输入/单条 等 9 个用例，见 `/tmp/test-handler.mjs`）。

## 2. 发布到 GitHub

1. 新建仓库 `cxywhite/dsh-next-turn-reorder`，`public`（开源分享）。
2. 仓库 Topics 加上 **`dsh-plugin`**（社区发现插件的关键标签）。
3. `README.md` 保留「Known limitation」一节（`remove + splice` 的 goal caveat + 指向上游提案）。
4. 许可证：`MIT`（`package.json` 已声明，补一份 `LICENSE` 文件）。

## 3. 发布到 npm

```sh
cd dsh-next-turn-reorder
npm publish --access public
# 或先 dry-run： npm publish --dry-run
```

- 包名 `dsh-next-turn-reorder` 需在 npm 上可用（如被占用改 `@cxywhite/dsh-next-turn-reorder`）。
- `engines.dsh: ">=0.2.0 <0.3.0"` 已声明版本兼容范围。
- `files` 已包含 index.js / client.js / cordis.patch.yml / locale / docs / icon.svg / README。

## 4. 安装验证（已在本 dev 实例完成）

```sh
dsh plugin --profile dev add ./dsh-next-turn-reorder
# profile 的 package.json 已确认：dependencies 链接 + bundles 追加 dsh-next-turn-reorder
# dump-config 确认 bundle 层 insert 了 id: next-turn-reorder
```

发布后用户安装：`dsh plugin --profile <name> add dsh-next-turn-reorder`。

## 5. 上线后待办（依赖上游）

- 上游一旦落地核心 `Inbox.move`，把 `index.js` 的 `remove + splice` 换成 `inbox.move(...)`，
  并移除 README 里的 goal caveat。
- 在官方 Discussions 提案里回填插件 npm/GitHub 链接，形成「社区先行 + 核心跟进」闭环。

## 6. 已知限制（必须在 README 中声明，已声明）

- 只能重排 `next-turn`，`next-step` 不可重排。
- stopgap 用 `remove + splice`，会发 `agent/inbox/discarded`，goal 排队消息场景有副作用，
  待核心 `Inbox.move` 落地后消除。
