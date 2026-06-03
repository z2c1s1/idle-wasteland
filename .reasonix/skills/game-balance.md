---
name: game-balance
description: 游戏数值平衡：经济(Faucet/Sink)、经验曲线、掉落保底、难度锯齿波、测试指标
---
# Game Balancing Skill

当涉及游戏数值设计时激活：经济、经验曲线、掉落、难度、测试数据。

## 核心原则
1. Faucet → Sink：每有资源产出必有消耗出口
2. 平衡给中位数玩家（50%），高难给顶端10%
3. 奖励必须有"挣到"的感觉，不能太易太难
4. 测试数据 > 直觉
5. 每次只改一个变量，10-20% 幅度

## 经验曲线
`xp_required(level) = base_xp × level^exponent`
- exponent 1.5 = 轻度 / 2.0 = 标准MMO / 2.5 = 硬核

## 掉落
- 保底系统：N次未掉稀有 → 强制掉落
- 稀有度权重：Common 60 / Uncommon 25 / Rare 10 / Epic 4 / Legendary 1

## 难度曲线
锯齿波模型：新区域低→爬升→Boss+20%→下一区重置

## 测试指标
完成率<70%=太难 | >95%+0死=太易 | 玩家在前10%持有>80%财富=缺Sink
