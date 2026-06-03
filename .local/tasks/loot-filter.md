# 战利品品质筛选（Loot Filter）

## What & Why
在战斗自动掉落装备时，允许玩家设定"最低保留品质"阈值：
- 低于阈值的装备自动分解（返还一定金币）而非进入背包
- 解决背包快速被低品质垃圾装填满的问题
- 设定在背包页面，实时生效，无需重启战斗

## Done looks like
- 背包页面顶部出现"自动筛选"设置区：一排品质按钮（普通/良品/稀有/史诗/传说），点击设定最低保留品质
- 当前筛选阈值高亮显示，配有颜色标识（对应品质颜色）
- 战斗中掉落低于阈值的装备时，自动分解并获得少量金币补偿（不进入背包）
- 分解金币收益在战斗日志或提示中显示
- 筛选设置持久保存（写入数据库），重新加载游戏后生效

## Out of scope
- 按装备类型/词缀精细筛选
- 装备名称关键词黑名单
- 背包现有物品的批量分解

## Steps
1. **Schema 扩展** — 在 `shared/schema.ts` 新增 `lootFilter` 列（text，默认 `"common"`），取值为品质枚举 `common|uncommon|rare|epic|legendary`，运行 `db:push` 应用变更。
2. **服务端筛选逻辑** — 在 `server/storage.ts` 战斗 tick 生成掉落装备时，读取 `lootFilter` 值，若新掉落物品品质低于阈值则不加入 `lootBag`，改为将分解金币（按品质：普通=5, 良品=15, 稀有=40, 史诗=100金）累加到 `gold`。新增 `setLootFilter(rarity)` 方法供 API 调用。
3. **API 路由** — 在 `server/routes.ts` 新增 `POST /api/game/loot-filter` 端点，接受 `{ rarity }` 更新筛选设置，在 `shared/routes.ts` 同步路由类型定义。
4. **背包 UI** — 在 `client/src/pages/inventory.tsx` 顶部新增"自动筛选"面板：5个品质按钮（颜色对应品质），当前阈值高亮，点击触发 mutation 更新设置；`client/src/hooks/use-game.ts` 新增 `useSetLootFilter` hook。

## Relevant files
- `shared/schema.ts`
- `shared/routes.ts`
- `server/storage.ts:200-330`
- `server/routes.ts`
- `client/src/pages/inventory.tsx:297-360`
- `client/src/hooks/use-game.ts`
