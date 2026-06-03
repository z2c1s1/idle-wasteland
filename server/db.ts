import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "@shared/schema";
import { mkdirSync } from "fs";

// 确保持久化目录存在（PGlite 不自动创建父目录）
mkdirSync(".data/pglite", { recursive: true });

// dataDir 用于持久化到 .data/pglite，生产环境不会丢失游戏进度。
// PGlite 在浏览器/边缘环境会自动回退到内存模式，无需额外处理。
export const client = new PGlite({ dataDir: ".data/pglite" });
export const db = drizzle(client, { schema });
