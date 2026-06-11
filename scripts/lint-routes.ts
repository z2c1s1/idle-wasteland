/**
 * 🔒 Route integrity linter — catches URL drift at dev/build time.
 *
 * Validates:
 *  1. Every R constant has a corresponding <Route> in App.tsx
 *  2. Every zone path in zones.ts references an existing R constant
 *  3. No bare string paths in navigate/href/url/setLocation calls
 *  4. Every sidebar NavItem url references an existing R constant
 *
 * Run:  npx tsx scripts/lint-routes.ts
 */

import * as fs from "fs";
import * as path from "path";

const CLIENT_SRC = path.resolve("client/src");
const ROUTES_FILE = path.join(CLIENT_SRC, "lib", "routes.ts");
const APP_FILE = path.join(CLIENT_SRC, "App.tsx");
const ZONES_FILE = path.join(CLIENT_SRC, "components", "wasteland", "zones.ts");
const SIDEBAR_FILE = path.join(CLIENT_SRC, "components", "layout", "app-sidebar.tsx");

let errors = 0;

function err(msg: string) {
  console.error("❌ " + msg);
  errors++;
}

// ── Extract R constant keys from routes.ts ────────────────────────────────────
const routesSrc = fs.readFileSync(ROUTES_FILE, "utf-8");
const rKeys = new Set<string>();
const rKeyRe = /^\s+(\w+):\s+"\/[\w-]*"/gm;
let m: RegExpExecArray | null;
while ((m = rKeyRe.exec(routesSrc)) !== null) {
  rKeys.add(m[1]);
}
console.log(`📋 R constants: ${rKeys.size}`);

// ── 1. Every R key must appear in App.tsx as <Route path={R.xxx}> ─────────────
const appSrc = fs.readFileSync(APP_FILE, "utf-8");
const appRouteRe = /<Route\s+path=\{R\.(\w+)\}/g;
const appRouteKeys = new Set<string>();
while ((m = appRouteRe.exec(appSrc)) !== null) {
  appRouteKeys.add(m[1]);
}

// Exclude "dashboard" — it's the catch-all fallback handled differently
for (const key of rKeys) {
  if (key === "dashboard") continue; // "/" is the root, always handled
  if (!appRouteKeys.has(key)) {
    err(`R.${key} defined in routes.ts but NO <Route path={R.${key}}> in App.tsx`);
  }
}
for (const key of appRouteKeys) {
  if (!rKeys.has(key)) {
    err(`App.tsx uses R.${key} but key not found in routes.ts`);
  }
}

// ── 2. Every zone path in zones.ts must use an R constant ──────────────────────
const zonesSrc = fs.readFileSync(ZONES_FILE, "utf-8");
const zonesRouteRe = /path:\s*R\.(\w+)/g;
const zonesRouteKeys = new Set<string>();
while ((m = zonesRouteRe.exec(zonesSrc)) !== null) {
  if (!rKeys.has(m[1])) {
    err(`zones.ts references R.${m[1]} but key not found in routes.ts`);
  }
  zonesRouteKeys.add(m[1]);
}

// Check which R keys are missing from zones
for (const key of rKeys) {
  if (key === "dashboard") continue; // root path not in zones
  if (!zonesRouteKeys.has(key)) {
    console.warn(`⚠️  R.${key} in routes.ts has NO zone entry in zones.ts — unreachable via ZoneNav`);
  }
}

// ── 3. No bare string paths in navigate/href/url/setLocation ───────────────────
function walkFiles(dir: string, cb: (filePath: string, content: string) => void) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      walkFiles(full, cb);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      cb(full, fs.readFileSync(full, "utf-8"));
    }
  }
}

// Patterns that look like hardcoded client-side paths
const barePathRe = /(?:navigate|setLocation|go)\s*\(\s*"(?!\/api\/|#|\$|\+)[^"]*"/g;
const bareHrefRe = /href\s*=\s*"(?!\/api\/|#|https?:\/\/|\/\/)[^"]*"/g;
const bareUrlRe = /\burl\s*=\s*"(?!\/api\/|#|https?:\/\/)[^"]*"/g;

walkFiles(CLIENT_SRC, (filePath, content) => {
  // Skip routes.ts itself and files that use R constants
  if (filePath.endsWith("routes.ts")) return;
  if (filePath.endsWith("routes.tsx")) return;

  const lines = content.split("\n");

  // Check for bare navigate/setLocation/go calls
  let bm: RegExpExecArray | null;
  while ((bm = barePathRe.exec(content)) !== null) {
    // Check if the file already imports R
    if (content.includes("from \"@/lib/routes\"")) {
      err(`${path.relative(CLIENT_SRC, filePath)}: bare path \`${bm[0]}\` — should use R.* constant`);
    }
  }

  // Check for bare href
  while ((bm = bareHrefRe.exec(content)) !== null) {
    if (!bm[0].includes("#") && content.includes("from \"@/lib/routes\"")) {
      err(`${path.relative(CLIENT_SRC, filePath)}: bare href \`${bm[0]}\` — should use R.* constant`);
    }
  }

  // Check for bare url (in NavItem-like components)
  // Only check files that already import R
  if (content.includes("from \"@/lib/routes\"")) {
    while ((bm = bareUrlRe.exec(content)) !== null) {
      err(`${path.relative(CLIENT_SRC, filePath)}: bare url \`${bm[0]}\` — should use R.* constant`);
    }
  }
});

// ── 4. Every sidebar NavItem url must reference R ──────────────────────────────
const sidebarSrc = fs.readFileSync(SIDEBAR_FILE, "utf-8");
const sidebarUrlRe = /url=\{(?:R\.(\w+)|\`\$\{R\.(\w+)\}[^`]*\`)\}/g;
while ((m = sidebarUrlRe.exec(sidebarSrc)) !== null) {
  const key = m[1] || m[2];
  if (key && !rKeys.has(key)) {
    err(`sidebar NavItem references R.${key} but key not found in routes.ts`);
  }
}

// ── Summary ────────────────────────────────────────────────────────────────────
if (errors > 0) {
  console.log(`\n🔴 ${errors} route integrity error(s) found.`);
  process.exit(1);
} else {
  console.log("\n✅ All route integrity checks passed.");
  process.exit(0);
}
