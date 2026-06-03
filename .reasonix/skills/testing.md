---
name: testing
description: Vitest测试：组件/工具函数/API端点，覆盖率
---
# Testing

## Test structure
- `describe('ComponentName', () => { it('should do X', () => {}) })`
- AAA pattern: Arrange → Act → Assert
- One assertion concept per test

## What to test
- Pure utility functions: all branches
- React components: render output, user interactions
- API routes: success/error responses
- Edge cases: empty state, null values, boundary conditions

## When adding features
- Write test before or immediately after implementation
- If bug was found, write a regression test first
- Aim for: critical paths covered > edge case perfection
