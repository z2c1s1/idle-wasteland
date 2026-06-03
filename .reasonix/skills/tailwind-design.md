---
name: tailwind-design
description: Tailwind CSS Design System: 配色Token、组件规范、响应式布局、间距统一
---
# Tailwind Design System

When building UI components, apply these principles:

## Design Tokens
- Colors: semantic naming (primary, destructive, muted, accent — not blue-500)
- Spacing: consistent scale (p-2 p-3 p-4, not arbitrary values)
- Border radius: sm for inputs, md for cards, lg for modals, full for pills

## Component Patterns
- Cards: bg-card border border-border rounded-xl p-4
- Buttons: consistent height (h-8 sm h-9 md), same padding (px-3 or px-4)
- Progress: h-2 with [&>div]:bg-*color* for dynamic colors

## Responsive
- mobile-first: default styles for mobile, sm: md: lg: for larger
- max-w containers: max-w-4xl for wide pages, max-w-2xl for forms

## Dark Theme
- bg-card (not bg-gray-800), border-border (not border-gray-700)
- text-muted-foreground for secondary text
- hover:bg-muted/20 for interactive elements

## Animation
- transition-colors duration-200 on all interactive elements
- animate-pulse for loading/active states
- ease-in-out for accordions/collapsible
