import { defineConfig } from "drizzle-kit";

// 本项目使用 PGlite (内存 PostgreSQL 模拟层)，不需要外部 PostgreSQL。
// drizzle-kit push / migrate 对 PGlite 无效 —— 表结构由 server/index.ts 的
// initDatabase() 通过原始 SQL 创建。若将来迁移到独立 PostgreSQL，设置
// DATABASE_URL 环境变量即可恢复 drizzle-kit 的正常工作流程。
const pgUrl = process.env.DATABASE_URL || "postgres://localhost:5432/pglite_dummy";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: pgUrl,
  },
});
