# 废土生存RPG — Unity UGUI UI工程方案

> Unity 2022+ UGUI | Sprite Atlas | Addressables | 1920×1080 (16:9)  
> 风格：末世废土 / Fallout / 生存建造 / 旧工业文明遗迹  
> 材质：生锈钢板 · 铆钉金属框 · 磨损铜铁 · 暗色皮革 · 旧电子设备

---

## 1. UI结构树 (完整层级)

```
Canvas (1920×1080, Screen Space Overlay)
│
├── TopBar (顶部状态栏, y=0, h=120)
│   ├── PlayerInfo (左侧)
│   │   ├── Avatar (玩家头像, 80×80)
│   │   ├── PlayerName (TMP)
│   │   └── LevelBadge (等级)
│   ├── StatusBars (中部, 3条)
│   │   ├── HPBar (红色, 400×16)
│   │   ├── StaminaBar (黄色, 400×16)
│   │   └── RadiationBar (辐射绿, 400×16)
│   ├── Resources (右侧, 7项横排)
│   │   ├── GoldDisplay (💰)
│   │   ├── ScrapDisplay
│   │   ├── WoodDisplay
│   │   ├── OreDisplay
│   │   ├── FoodDisplay
│   │   ├── WaterDisplay
│   │   └── GemsDisplay
│   └── SystemButtons (最右, 4个)
│       ├── Btn_Map
│       ├── Btn_Inventory
│       ├── Btn_Achievement
│       └── Btn_Settings
│
├── LeftSkillPanel (左侧技能栏, x=0, y=120, w=250)
│   └── ScrollView
│       └── SkillRow ×16 (垂直列表)
│           ├── SkillIcon (40×40)
│           ├── SkillName (TMP)
│           ├── Level (TMP)
│           └── ProgressBar (120×6)
│
├── CenterArea (中央区域, x=250, y=120, w=700)
│   ├── CharacterDisplay (角色3D立绘, 500×600)
│   ├── EquipmentSlots (环绕角色)
│   │   ├── Slot_Helmet (顶部)
│   │   ├── Slot_Weapon (左侧)
│   │   ├── Slot_Offhand (右侧)
│   │   ├── Slot_ChestArmor (中间)
│   │   ├── Slot_Gloves (左中)
│   │   ├── Slot_Leggings (右中)
│   │   ├── Slot_Boots (底部左)
│   │   ├── Slot_Necklace (底部中)
│   │   └── Slot_Ring (底部右)
│   └── QuickEquipBar (底部, 4槽)
│
├── BackpackPanel (中央右侧, x=950, y=120, w=650)
│   ├── TitleBar (背包 456/990)
│   ├── ScrollView (8列网格)
│   │   └── ItemSlot ×N (56×56)
│   │       ├── ItemIcon (48×48)
│   │       ├── StackCount (TMP)
│   │       └── RarityBorder
│   └── CapacityBar (底部)
│
├── RightTopArea (右上, x=1600, y=120)
│   ├── MiniMapPanel (圆形, Ø300)
│   │   ├── MiniMap (RenderTexture)
│   │   ├── Btn_ZoomIn
│   │   ├── Btn_ZoomOut
│   │   └── Btn_Locate
│   └── SkillOverview (技能总览网格)
│       └── SkillCard ×16 (3列×6行)
│           ├── SkillIcon (32×32)
│           └── Level (TMP)
│
├── RightMidArea (右侧中部, x=1600, y=520)
│   ├── QuestPanel (任务面板, h=200)
│   │   ├── QuestHeader
│   │   └── ScrollView
│   │       └── QuestCard
│   │           ├── QuestName
│   │           ├── Description
│   │           └── ProgressBar
│   └── AchievementPanel (成就面板, h=200)
│       ├── AchievementHeader
│       └── ScrollView
│           └── AchievementCard
│               ├── AchievementIcon
│               ├── Title
│               ├── Description
│               └── Reward
│
├── BottomArea (底部, y=870, h=210)
│   ├── CombatPanel (左下, w=500)
│   │   ├── StyleSelector (3按钮: Melee/Ranged/Magic)
│   │   ├── MonsterDisplay
│   │   │   ├── MonsterPortrait (150×150)
│   │   │   ├── MonsterHPBar (300×16)
│   │   │   └── MonsterLevel (TMP)
│   │   └── AutoCombatButton
│   ├── PrayerPanel (中下)
│   │   └── BuffGrid (Buff图标 ×N, 支持激活态)
│   ├── MagicBookPanel (中右)
│   │   └── SkillGrid (技能图标, 分页)
│   └── ChatPanel (右下, w=400)
│       ├── TabBar (World/Clan/Trade/System)
│       ├── ChatLog (ScrollView)
│       └── InputField
│
├── BottomActionBar (最底部, y=1020, h=56)
│   └── ActionSlot ×12
│       ├── SlotIcon
│       ├── HotkeyLabel (1-0, Q, E)
│       └── CooldownOverlay
│
├── SettingsPanel (弹出层)
│   ├── Slider_Music
│   ├── Slider_SFX
│   ├── Slider_Brightness
│   └── Slider_UIScale
│
└── ModalLayer (顶层)
    ├── ToastNotification
    ├── ConfirmDialog
    └── ItemTooltipPopup
```

---

## 2. 页面/面板模板

| 模板 | 实例 | 说明 |
|------|------|------|
| **SkillRow** | ×16 | 左侧技能列表行 |
| **ItemSlot** | ×N | 背包网格/快捷栏通用 |
| **EquipmentSlot** | ×10 | 装备槽(环绕角色) |
| **ResourceDisplay** | ×7 | 顶部资源栏 |
| **SkillCard** | ×16 | 右侧技能总览卡片 |
| **QuestCard** | ×N | 任务列表 |
| **AchievementCard** | ×N | 成就列表 |
| **ActionSlot** | ×12 | 底部快捷栏 |
| **BuffIcon** | ×N | 祈祷Buff |
| **MagicSkillIcon** | ×N | 魔法书技能 |

---

## 3. 资源清单

### 面板背景 (9-Slice)
| 资源名 | 尺寸 | 用途 |
|--------|------|------|
| panel_topbar_bg | 1920×120 | 顶部状态栏 |
| panel_skill_bg | 250×960 | 左侧技能栏 |
| panel_backpack_bg | 650×750 | 背包面板 |
| panel_minimap_bg | 320×320 | 小地图底板 |
| panel_quest_bg | 320×200 | 任务面板 |
| panel_achievement_bg | 320×200 | 成就面板 |
| panel_combat_bg | 500×150 | 战斗面板 |
| panel_prayer_bg | 300×100 | 祈祷面板 |
| panel_chat_bg | 400×150 | 聊天面板 |
| panel_actionbar_bg | 1920×56 | 底部快捷栏 |
| panel_settings_bg | 400×300 | 设置弹窗 |
| panel_modal_bg | 480×240 | 通用弹窗 |

### 按钮 (统一复用4态)
| 资源名 | 尺寸 | 状态 |
|--------|------|------|
| btn_metal_normal/hover/pressed/disabled | 120×40 | 主按钮 |
| btn_small_normal/hover/pressed | 80×32 | 小按钮 |
| btn_icon_normal/hover | 40×40 | 图标按钮 |
| btn_tab_normal/selected | 80×28 | Tab切换 |
| btn_style_melee/ranged/magic | 100×40 | 战斗风格 |

### 插槽
| 资源名 | 尺寸 | 用途 |
|--------|------|------|
| slot_equipment | 72×72 | 装备槽(环绕角色) |
| slot_equipment_empty | 72×72 | 空装备槽 |
| slot_backpack | 56×56 | 背包格 |
| slot_skill | 48×48 | 技能列表槽 |
| slot_quick | 48×48 | 快捷栏槽 |
| slot_action | 48×48 | 底部动作槽 |

### 进度条
| 资源名 | 尺寸 | 颜色 |
|--------|------|------|
| bar_hp_bg/fill | 400×16 | 红 #C84A3A |
| bar_stamina_bg/fill | 400×16 | 黄 #A67C45 |
| bar_radiation_bg/fill | 400×16 | 绿 #7EFF4A |
| bar_skill_bg/fill | 120×6 | 黄铜 #A67C45 |
| bar_quest_bg/fill | 200×10 | 黄铜 |

### 稀有度边框
| 稀有度 | 颜色 | Hex |
|--------|------|-----|
| common | 灰白 | #9CA3AF |
| uncommon | 蓝 | #60A5FA |
| rare | 紫 | #C084FC |
| epic | 黄 | #FACC15 |
| legendary | 橙 | #FB923C |
| mythic | 红 | #F87171 |
| unique | 琥珀 | #FBBF24 |
| set | 青 | #2DD4BF |

### 装饰元素
| 资源名 | 用途 |
|--------|------|
| deco_metal_frame_rust | 生锈钢板边框 |
| deco_rivet (×4尺寸) | 铆钉 |
| deco_corner_rust (×4) | 锈蚀角标 |
| deco_divider_h/v | 分割线 |
| deco_minimap_ring | 小地图圆环边框 |
| deco_gear_bg | 齿轮装饰底纹 |
| deco_warning_stripe | 警戒条纹 |

### 图标 (31个技能/通用图标)

---

## 4. 9-Slice配置

```json
[
  {"name":"panel_topbar_bg","slice":{"l":32,"r":32,"t":20,"b":20}},
  {"name":"panel_skill_bg","slice":{"l":20,"r":8,"t":16,"b":16}},
  {"name":"panel_backpack_bg","slice":{"l":24,"r":24,"t":24,"b":24}},
  {"name":"panel_minimap_bg","slice":{"l":60,"r":60,"t":60,"b":60}},
  {"name":"panel_quest_bg","slice":{"l":16,"r":16,"t":16,"b":16}},
  {"name":"panel_combat_bg","slice":{"l":16,"r":16,"t":12,"b":12}},
  {"name":"panel_chat_bg","slice":{"l":16,"r":16,"t":12,"b":12}},
  {"name":"panel_actionbar_bg","slice":{"l":32,"r":32,"t":8,"b":8}},
  {"name":"panel_settings_bg","slice":{"l":24,"r":24,"t":24,"b":24}},
  {"name":"btn_metal_normal","slice":{"l":16,"r":16,"t":10,"b":10}}
]
```

---

## 5. Sprite Atlas规划

| Atlas | 内容 | 加载 | 预估 |
|-------|------|------|------|
| **Atlas_MainUI** | 面板(12), 按钮(20), 装饰(10), 插槽(6), 进度条(12) | **常驻** | ~3MB |
| **Atlas_Icons** | 技能图标(15), 资源图标(7), 装备图标, 稀有度边框(8) | **常驻** | ~2MB |
| **Atlas_Combat** | 怪物头像(50), 战斗风格图标(3), AutoCombat按钮, 战斗特效 | 按需 | ~2MB |
| **Atlas_Map** | 小地图纹理, 地图图标, 缩放/定位按钮 | 按需 | ~1MB |
| **Atlas_Pets** | 宠物图标(11), 成就图标 | 按需 | ~0.5MB |

**总计 5 个 Atlas，常驻 ~5MB，按需 ~3.5MB。**

---

## 6. Prefab结构

### 通用组件 (12个)

```
Button_Metal.prefab        — Image(9-Slice, 4态) + TMP + Button
Button_Tab.prefab          — Image(swap normal/selected) + TMP
Button_Icon.prefab         — Image(2态) + Button
ProgressBar.prefab         — Image(bg) + Image(fill, Filled) + TMP
SkillRow.prefab            — SkillIcon + SkillName + Level + ProgressBar
ItemSlot.prefab            — Image(slot) + RarityBorder + ItemIcon + StackCount + Button
EquipmentSlot.prefab       — Image(slot_equipment) + RarityBorder + ItemIcon + EmptyOverlay
ResourceDisplay.prefab     — Icon + Count (TMP)
SkillCard.prefab           — SkillIcon + Level (TMP)
QuestCard.prefab           — QuestName + Description + ProgressBar
AchievementCard.prefab     — Icon + Title + Description + Reward
ActionSlot.prefab          — Icon + HotkeyLabel + CooldownOverlay
Toast.prefab               — Image(panel_modal) + Title + Message + Animator
```

### 面板 Prefab (10个)

```
TopBar.prefab
├── PlayerInfo (Avatar + Name + Level)
├── StatusBars (HPBar + StaminaBar + RadiationBar)
├── Resources (ResourceDisplay ×7)
└── SystemButtons (Button_Icon ×4)

LeftSkillPanel.prefab
├── TitleBar ("技能")
└── ScrollView
    └── SkillRow ×16 (垂直列表, 对象池)

CenterArea.prefab
├── CharacterDisplay (3D Model RenderTexture)
├── EquipmentSlots (环绕布局, 10个 EquipmentSlot)
└── QuickEquipBar (4个 ItemSlot)

BackpackPanel.prefab
├── TitleBar (背包 + 计数 + 排序按钮)
├── FilterBar (3行: 部位/稀有度/属性)
├── ScrollView (8列网格, 虚拟滚动)
│   └── ItemSlot ×N (对象池)
└── CapacityBar

MiniMapPanel.prefab
├── MiniMap (RenderTexture, 圆形遮罩)
└── Buttons (ZoomIn/ZoomOut/Locate)

RightPanels.prefab
├── SkillOverview (SkillCard ×16, 3×6网格)
├── QuestPanel (ScrollView → QuestCard)
└── AchievementPanel (ScrollView → AchievementCard)

CombatPanel.prefab
├── StyleSelector (Button ×3: Melee/Ranged/Magic)
├── MonsterDisplay (Portrait + HPBar + Level)
└── AutoCombatButton

PrayerPanel.prefab
└── BuffGrid (BuffIcon ×N, 激活态高亮)

ChatPanel.prefab
├── TabBar (Button_Tab ×4)
├── ChatLog (ScrollView + TMP)
└── InputField

SettingsPanel.prefab
├── Slider_Music
├── Slider_SFX
├── Slider_Brightness
└── Slider_UIScale
```

---

## 7. 资源复用

| 组件 | 复用次数 |
|------|---------|
| SkillRow | ×16 |
| ItemSlot | ×N (背包+快捷栏+装备栏) |
| EquipmentSlot | ×10 |
| ResourceDisplay | ×7 |
| SkillCard | ×16 |
| ProgressBar | ×N (HP/Stamina/Radiation/技能/任务) |
| Button_Metal | 全局 |
| rarity边框 (8种) | 所有装备/物品 |
| 面板9-Slice (12种) | 各自复用 |

**22个 Prefab 覆盖全部界面。**

---

## 8. 性能优化

- **DrawCall**: 同 Atlas 合批; TMP 独立层级; 装饰合并到面板; 控制 50 DrawCall 以内
- **Atlas**: ASTC 6×6 压缩; 单张 ≤ 2048×2048; 常驻 5MB
- **ScrollView**: 背包(8列×N行) / 技能列表(16行) / 任务 / 聊天 — 均使用对象池 + RectMask2D
- **Minimap**: RenderTexture 256×256, 低帧率更新(2fps)
- **3D 角色**: 独立 Camera → RenderTexture, 低分辨率(512×512)
- **Addressables**: Atlas_Combat / Atlas_Map / Atlas_Pets 按需加载, 30s 延迟卸载
- **对象池**: ItemSlot(200), SkillRow(16), QuestCard(20), ChatMessage(50), Toast(3)

---

## 9. 颜色 & 字体规范

### 主色调
| 用途 | Hex |
|------|-----|
| 背景深灰 | #1C1C1C |
| 铁锈棕 | #4B3326 |
| 黄铜色 | #A67C45 |
| 辐射绿 | #7EFF4A |
| 警示红 | #C84A3A |

### 稀有度颜色
| 稀有度 | Hex |
|--------|-----|
| 普通 | #9CA3AF |
| 魔法 | #60A5FA |
| 稀有 | #C084FC |
| 神圣 | #FACC15 |
| 独特 | #FB923C |
| 神话 | #F87171 |

### 字体
| 用途 | 字体 | 大小 |
|------|------|------|
| 标题 | Roboto Bold / 思源黑体 Bold | 24pt |
| 正文 | Roboto Regular | 16pt |
| 数字 | Roboto Mono Medium | 14pt |
| 标签 | Roboto Regular | 10pt |

---

## 10. 技能系统 (16技能)

所有技能使用统一 `SkillRow.prefab`：

| 技能 | 图标 | 产物 |
|------|------|------|
| Woodcutting | ico_woodcutting | Wood_0~Wood_9 |
| Mining | ico_mining | Ore_0~Ore_9 |
| Smelting | ico_smelting | Bar_0~Bar_9 |
| Fishing | ico_fishing | Fish_0~Fish_9 |
| Hunting | ico_hunting | Hide_0~Hide_9 |
| Thieving | ico_thieving | Gold + 掉落 |
| Smithing | ico_smithing | 锻造装备 |
| Leatherworking | ico_leatherworking | 皮甲装备 |
| Jewelcrafting | ico_jewelcrafting | 戒指/项链 |
| Combat | ico_combat | XP + 掉落 |
| Agility | ico_agility | 敏捷经验 |
| Exploration | ico_exploration | 探索经验 |
| Cooking | ico_cooking | 食物 |
| Alchemy | ico_alchemy | 药水 |
| Prayer | ico_prayer | Buff |
| Homestead | ico_homestead | 建筑 |

---

## 11. 构建清单

| 类别 | 数量 |
|------|------|
| 面板 Prefab | 10 |
| 通用组件 Prefab | 13 |
| 列表项 Prefab | 6 |
| Sprite Atlas | 5 |
| 9-Slice 资源 | 10 |
| 按钮资源 | 5套(~20张含状态) |
| 插槽资源 | 6 |
| 进度条资源 | 6套(12张) |
| 稀有度边框 | 8 |
| 装饰资源 | 10 |
| 图标资源 | 31 |
| **总 Prefab** | **22** |
| **预估纹理内存** | **~8.5MB (ASTC 6×6)** |
| **预估 DrawCall** | **< 50** |
