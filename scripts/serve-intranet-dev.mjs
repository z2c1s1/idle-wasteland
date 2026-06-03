/**
 * 内网开发模式（热更新）：监听 0.0.0.0
 * 用法: npx tsx scripts/serve-intranet-dev.mjs
 */
process.env.NODE_ENV = "development";
process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "5000";

await import(new URL("../server/index.ts", import.meta.url));
