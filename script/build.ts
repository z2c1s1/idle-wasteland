import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, readdir } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
// Dependencies to bundle into the server build (reduces openat(2) syscalls).
// Only include packages actually listed in package.json.
const allowlist = [
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-session",
  "memorystore",
  "passport",
  "passport-local",
  "ws",
  "zod",
  "zod-validation-error",
];
// PGlite uses WASM — keep external to avoid bundling issues
const forceExternal = ["@electric-sql/pglite", "pg"];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  // Copy PGlite WASM files for production
  console.log("copying pglite wasm...");
  const { copyFile, mkdir } = await import("fs/promises");
  await mkdir("dist/node_modules/@electric-sql/pglite/dist", { recursive: true });
  const pgliteDir = "node_modules/@electric-sql/pglite/dist";
  const files = await readdir(pgliteDir);
  for (const f of files) {
    if (f.endsWith(".wasm") || f.endsWith(".data") || f === "postgresql.conf") {
      await copyFile(`${pgliteDir}/${f}`, `dist/node_modules/@electric-sql/pglite/dist/${f}`);
    }
  }

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = [...new Set([...allDeps.filter((dep) => !allowlist.includes(dep)), ...forceExternal])];

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
