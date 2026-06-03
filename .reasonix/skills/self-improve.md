---
name: self-improve
description: 记录错误/学习/特性需求到 .learnings/ 并晋升重要教训到项目记忆
---
# Self-Improvement Skill

记录学习内容、错误和修正，实现持续改进。

## 触发条件

| 场景 | 记录到 |
|------|--------|
| 命令/操作失败 | `.learnings/ERRORS.md` |
| 用户纠正你 | `.learnings/LEARNINGS.md`，类别 `correction` |
| 发现更好的做法 | `.learnings/LEARNINGS.md`，类别 `best_practice` |
| 知识过时 | `.learnings/LEARNINGS.md`，类别 `knowledge_gap` |

## 记录格式

### 学习条目
```markdown
## [LRN-YYYYMMDD-XXX] category
**Priority**: low | medium | high | critical
**Status**: pending | resolved | promoted
**Area**: frontend | backend | infra | tests | docs | config
### Summary
一句话描述
### Details
完整上下文
### Suggested Action
具体修复方案
### Metadata
- Source: conversation | error | user_feedback
- Related Files: path/to/file.ext
```

### 晋升
当学习具有普遍意义时，用 `remember` 工具写入项目 MEMORY.md：
- `type: "project"`, `scope: "project"`, `priority: "high"`
- 提炼成简洁规则而非长文
