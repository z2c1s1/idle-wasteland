# 辐射废土 — Idle RPG

基于 Melvor Idle 灵感的浏览器放置游戏。废土世界观，采集、制造、战斗、探索四大循环。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript, Vite 7, wouter 路由, TanStack React Query, Tailwind CSS 3, shadcn/ui 组件 |
| 后端 | Express 5 + TypeScript, tsx 运行时 |
| 数据库 | PGlite (嵌入式 PostgreSQL，持久化到 `.data/pglite/`) |
| ORM | Drizzle ORM |
| 验证 | Zod (API 入参 + 响应校验) |
| 构建 | esbuild (服务端打包), Vite (客户端打包) |
| 精灵 | 16×16 像素 SVG (纯代码，零图片依赖) |

## 核心文件结构

```
shared/
├── schema.ts          # Drizzle schema (game_states 表, ~160列)
├── game-data/         # 游戏数据定义 (模块化)
│   ├── index.ts       # Barrel export
│   ├── rarity-equipment.ts  # 稀有度/装备槽/词缀/技能
│   ├── items-crafting.ts    # 可制造物品、配方、掉落生成
│   ├── combat-world.ts      # 敌人、副本、战斗三角
│   ├── skills-meta.ts       # 工具、盗窃NPC、家园、炼金、成就、宠物
│   └── prayers.ts           # 祷言系统
├── game-data.ts       # 旧版数据文件 (逐步迁移中)
├── game-math.ts       # 等级公式、战斗属性、温度、敏捷加成
├── resources.ts       # 资源存取抽象 (resourceStore JSON)
├── game-state-parse.ts # JSON列解析工具
├── routes.ts          # API 路由定义 (Zod 校验)
├── messages.ts        # 统一错误消息
├── actions.ts         # 统一 action 字符串常量
├── trial-data.ts      # 试炼 buff/curse 数据
└── i18n/              # 多语言文案 (规划中)

server/
├── index.ts           # Express 入口、DB 初始化、迁移
├── storage.ts         # DatabaseStorage 协调层 (按 playerId 隔离)
├── db.ts              # PGlite 连接
├── routes.ts          # 路由注册
├── static.ts          # 生产环境静态文件
├── vite.ts            # 开发环境 Vite 中间件
├── lib/
│   └── route-handler.ts
└── storage/
    ├── combat.ts           # 三角战斗 (远程/魔法)
    ├── combat-actions.ts   # 副本/高塔/试炼/猎杀入口
    ├── consumables.ts      # 烹饪/炼金/种植
    ├── constants.ts        # 技能树数据、稀有度排序
    ├── equipment.ts        # 装备/卸装/合成/强化/腐化/宝石
    ├── helpers.ts          # 宝石合并、掉落池
    ├── homestead.ts        # 家园建筑、温度衰减
    ├── prayer.ts           # 祷言激活/停用/tick
    ├── skills.ts           # 动作管理、存档导入、快进
    ├── talents.ts          # 天赋树
    ├── world.ts            # NPC 来访、哨站
    ├── transaction.ts      # 事务工具
    └── tick/
        ├── _shared.ts      # 共享导入
        ├── _combat-shared.ts # 共享战斗计算
        ├── tick-action.ts  # 动作分发
        ├── gathering.ts    # 采集 tick
        ├── melee.ts        # 近战 tick
        ├── dungeon.ts      # 副本 tick
        ├── tower.ts        # 高塔 tick
        ├── trial.ts        # 试炼 tick
        ├── crafting.ts     # 制作 tick
        └── thieving.ts     # 盗窃 tick

client/src/
├── App.tsx                # 根组件 (SidebarProvider)
├── main.tsx               # 入口
├── index.css              # 全局样式 + Tailwind
├── lib/
│   ├── api.ts             # API 客户端 (x-player-id 头)
│   ├── game-utils.ts      # 等级/属性/资源计算
│   ├── text.ts            # 统一 UI 文案
│   └── queryClient.ts     # React Query 配置
├── hooks/
│   └── use-game.ts        # 所有游戏 API hooks
├── components/
│   ├── layout/
│   │   ├── app-sidebar.tsx # 侧边导航 (shadcn Sidebar)
│   │   └── header.tsx      # 顶部状态栏
│   ├── inventory/
│   │   ├── item-card.tsx   # 物品卡片
│   │   └── affix-row.tsx   # 词缀行
│   ├── skill-page.tsx      # 通用技能页面
│   ├── skill-action-view.tsx
│   ├── tool-icon.tsx       # 工具图标 (SVG)
│   ├── sprites/            # 像素精灵系统
│   │   ├── index.ts
│   │   ├── spriteData.ts   # 精灵像素矩阵数据
│   │   └── SpriteComponents.tsx
│   └── ui/                 # shadcn/ui 组件
└── pages/                  # 23 个页面组件
```

## 游戏系统

### 采集技能 (7 个 × 10 级)
伐木、采矿、冶炼、钓鱼、狩猎、搜刮（盗窃）、敏捷（纯经验）。
副产物：伐木→莓果、采矿→宝石+石料、狩猎→草药。

### 生产技能 (4 个)
锻造（锭→装备）、皮革制作（皮→装备）、珠宝制作（材料→饰品）、工具制作。

### 消耗品
烹饪（肉+莓果+草药→食物buff）、炼金（草药→药水）、种植（莓果种子→2x收获）。

### 战斗系统
- 122 种敌人 (LV.1–99)，战斗三角 (近战>远程>魔法>近战)
- 6 个副本 (LV.10–80)，高塔 (无限楼层)，辐射试炼 (7波递增)
- 世界层级 1–4，影响敌人 HP/攻击/掉落
- 猎杀任务系统，悬赏击杀奖励
- 温度系统 (家园燃料)，影响采集和战斗速度

### 装备系统
- 9 槽位：武器/副手/头盔/胸甲/腿甲/手套/靴子/项链/戒指
- 6 稀有度：普通/优良/稀有/史诗/传说/神话
- 词缀系统 (Diablo 风格)：力量/敏捷/体质/智力/护甲…
- 技能系统：吸血/荆棘/狂战/双击/闪避/淬毒/陨石…
- 宝石镶嵌、装备合成、强化、腐化

### 家园系统
建筑 (火炉/农田/工坊等)，温度管理 (燃料维持)，哨站 (探索解锁，被动产出)。

### 其他系统
- 天赋树 (3 职业 × 3 流派)，宠物收集，成就系统
- NPC 来访 (随机商人/任务)，城镇 (赌博)
- 存档导入/导出 (JSON)
- playerId 隔离 (localStorage，多玩家独立存档)

## 运行命令

```bash
npm run dev          # 开发服务器 (Express + Vite, port 5001)
npm run build        # 生产构建 (client + server → dist/)
npm run check        # TypeScript 类型检查
npm test             # 运行测试 (npx tsx --test)
npm run db:push      # Drizzle 迁移
```

## 测试文件

```
shared/game-math.test.ts
shared/game-state-parse.test.ts
shared/game-data-integrity.test.ts
shared/game-data-functions.test.ts
shared/resources.test.ts
server/storage/helpers.test.ts
server/storage/tick/_combat-shared.test.ts
server/storage/tick/gathering.test.ts
```

## 用户偏好
- 所有对话使用中文回复
- 更新术语："更新内网" = 本地 dev，"更新 Railway" = 推 GitHub → 部署
- 不要修改 shared/game-data.ts（旧文件正在逐步迁移到 shared/game-data/ 子模块）
