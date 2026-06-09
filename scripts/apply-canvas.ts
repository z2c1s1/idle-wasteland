import fs from "fs";

let c = fs.readFileSync("client/src/pages/inventory.tsx", "utf-8").replace(/\r\n/g, "\n");

// 1. Replace equipment section (from "grid grid-cols" to the set progress closing)
const oldStart = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`;
const oldEnd = `        </div>

        {/* Loot Bag — dropped items */}`;

const newSection = `<div className="flex flex-col lg:flex-row gap-6">
        {/* Character Equipment — Canvas */}
        <div className="flex-shrink-0" style={{ width: 406, maxWidth: '100%' }}>
          <PaperDollCanvas equipment={equipment} onUnequip={handleUnequip} />
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-0">
          {/* Set progress */}
          {ITEM_SETS.filter(s => {
            const count = activeSets[s.id] ?? 0;
            return count > 0;
          }).map(set => {
            const count = activeSets[set.id] ?? 0;
            const total = set.pieces.length;
            return (
              <div key={set.id} className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3 space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300">{set.name}</span>
                  <span className="text-[10px] text-teal-400/70 bg-teal-500/10 px-1.5 py-0.5 rounded">
                    {count}/{total} 件已穿戴
                  </span>
                </div>
                <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: \`\${(count / total) * 100}%\` }} />
                </div>
                <div className="space-y-0.5">
                  {set.bonuses.map((bonus, i) => {
                    const active = count >= bonus.count;
                    return (
                      <div key={i} className={\`text-[10px] flex items-center gap-1.5 \${active ? 'text-teal-300' : 'text-muted-foreground/40'}\`}>
                        <span className={\`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] flex-shrink-0 \${active ? 'border-teal-400 bg-teal-400/20 text-teal-300' : 'border-border/40'}\`}>
                          {active ? '✓' : bonus.count}
                        </span>
                        <span className="font-medium">{bonus.count}件套：</span>
                        <span>{bonus.affixes.map(a => \`+\${a.value} \${AFFIX_LABEL[a.type] ?? a.type}\`).join('，')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Loot Bag — dropped items */}`;

// Find the start and end positions
const si = c.indexOf(oldStart);
const ei = c.indexOf(oldEnd, si);
if (si < 0 || ei < 0) { console.log("Could not find section boundaries"); process.exit(1); }

// Also need to eat the set progress section between grid start and loot bag
// The old equipment section had: grid > equipment card > stat summary > equip slots > set progress in card
// We need to find where the grid's closing div was
// Look for the set progress closing div
const oldCardEnd = "          })}\n        </div>\n";
const ci = c.indexOf(oldCardEnd, si);
if (ci < 0) { console.log("Could not find card end"); process.exit(1); }

// Replace from grid start to just before loot bag
const beforeEquipment = c.substring(si, ei + oldEnd.length);
c = c.replace(beforeEquipment, newSection);

// 2. Close the right column and flex at the end
// Find the loot bag closing div and add right column close + flex close
// The original structure:
//   </div>  ← loot bag card close
//   </div>  ← grid close
//   </div>  ← content area close
// Now needs:
//   </div>  ← loot bag card close
//   </div>  ← right column close
//   </div>  ← flex close
//   </div>  ← content area close

// Find the last </div></div> pattern before );
const closing = `
        </div>
        </div>
      </div>
    </div>
  );
}`;
const oldClosing = `
        </div>
      </div>
    </div>
  );
}`;
c = c.replace(oldClosing, closing);

// 3. Append PaperDollCanvas component at end
const canvasCode = `

// ─── Paper Doll Canvas ──────────────────────────────────────────────────
const SLOT_COORDS: Record<string, [number, number]> = {
  weapon: [47, 77], offhand: [47, 143], ring: [48, 211], gloves: [48, 278], boots: [48, 346],
  helmet: [361, 76], chest: [361, 143], legs: [361, 211], neck: [361, 279],
};
const PANEL_W = 406, PANEL_H = 450, ITEM_SIZE = 32;

function PaperDollCanvas({ equipment, onUnequip }: { equipment: Record<string, any>; onUnequip: (slot: string) => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const bgImgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = PANEL_W;
    canvas.height = PANEL_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const draw = async () => {
      if (!bgImgRef.current) {
        bgImgRef.current = new Image();
        bgImgRef.current.src = '/equip-panel.png';
        await new Promise(r => { bgImgRef.current!.onload = r; });
      }
      ctx.clearRect(0, 0, PANEL_W, PANEL_H);
      ctx.drawImage(bgImgRef.current, 0, 0);

      for (const [slot, [cx, cy]] of Object.entries(SLOT_COORDS)) {
        const item = equipment[slot];
        if (!item) continue;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(cx - ITEM_SIZE/2, cy - ITEM_SIZE/2, ITEM_SIZE, ITEM_SIZE);
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(slot, cx, cy);
      }
    };
    draw();
  }, [equipment]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = PANEL_W / rect.width;
    const scaleY = PANEL_H / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    for (const [slot, [cx, cy]] of Object.entries(SLOT_COORDS)) {
      if (Math.abs(px - cx) < ITEM_SIZE/2 && Math.abs(py - cy) < ITEM_SIZE/2) {
        if (equipment[slot]) onUnequip(slot);
        return;
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <canvas ref={canvasRef} className="w-full block cursor-pointer mx-auto" style={{ imageRendering: 'pixelated' }}
        onClick={handleClick} />
    </div>
  );
}
`;

c += canvasCode;
fs.writeFileSync("client/src/pages/inventory.tsx", c.replace(/\n/g, "\r\n"));
console.log("Done — inventory.tsx transformed");
