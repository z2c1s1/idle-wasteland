/**
 * 内网发布：监听 0.0.0.0，局域网内其他设备可通过本机 IP 访问。
 * 用法: node scripts/serve-intranet.mjs
 * 需先执行 npm run build
 */
process.env.NODE_ENV = "production";
process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "5000";

await import(new URL("../dist/index.cjs", import.meta.url));
