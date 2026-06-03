---
name: frontend-ui-ux
description: 前端UI/UX设计：无需设计稿，自驱动生成高质量界面和交互
---
# Frontend UI/UX

## Design Without Mockups
- Start with layout skeleton (grid/flex structure)
- Pick a color temperature (warm/cool/neutral) and stick to it
- Use consistent spacing (4px grid: p-1=4, p-2=8, p-3=12, p-4=16)
- Respect visual hierarchy: title > subtitle > body > caption

## Component Polish
- Every interactive element needs: default, hover, active, focus states
- Micro-interactions: button press feedback, loading skeleton, empty state illustration
- Error states: not just red text — show recovery action
- Responsive first: mobile layout → scale up, not desktop → squeeze down

## Dark Theme (game default)
- bg-card + border-border for containers
- text-muted-foreground for secondary text
- hover:bg-muted/20 for interactive elements
- Colored accents: use /10 or /20 opacity backgrounds, not solid
