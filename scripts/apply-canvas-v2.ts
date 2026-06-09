import fs from "fs";

const lines = fs.readFileSync("client/src/pages/inventory.tsx", "utf-8").split(/\r?\n/);

// Find boundaries
const gridStart = lines.findIndex(l => l.includes('grid grid-cols-1 lg:grid-cols-2 gap-6'));
const lootComment = lines.findIndex((l, i) => i > gridStart && l.includes('{/* Loot Bag'));
// Find the card end (before loot comment)
const cardEnd = lootComment - 1; // the </div> before Loot Bag comment

// New lines to insert
const newLines = [
  `      <div className="flex flex-col lg:flex-row gap-6">`,
  `        {/* Character Equipment — Canvas */}`,
  `        <div className="flex-shrink-0" style={{ width: 406, maxWidth: '100%' }}>`,
  `          <PaperDollCanvas equipment={equipment} onUnequip={handleUnequip} />`,
  `        </div>`,
  ``,
  `        {/* Right column */}`,
  `        <div className="flex-1 min-w-0">`,
];

// Keep set progress section (it was inside the equipment card)
// Find where set progress starts and ends
const setStart = lines.findIndex((l, i) => i > gridStart && l.includes('{/* Set progress'));
const setEnd = lines.findIndex((l, i) => i > setStart && l.includes('          })}\r') || l.includes('          })}\n'));

// Take set progress lines and add to newLines
if (setStart > 0 && setEnd > setStart) {
  const setLines = lines.slice(setStart, setEnd + 1);
  // Adjust indentation (they were inside the card, now at same level)
  newLines.push(...setLines);
}

// Build the result
const result = [
  ...lines.slice(0, gridStart),
  ...newLines,
  ...lines.slice(lootComment + 1), // Include loot comment line
];

// Close right column and flex after the loot bag section
// Find where the grid originally closed
const gridCloseIdx = result.findIndex((l, i) => i > gridStart + 100 && l.trim() === '</div>' && result[i+1]?.trim() === '</div>');
if (gridCloseIdx > 0) {
  // Insert right column close before flex close
  result.splice(gridCloseIdx, 0, '        </div>');
}

// Add PaperDollCanvas component at end
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
    canvas.width = PANEL_W; canvas.height = PANEL_H;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    (async () => {
      if (!bgImgRef.current) {
        bgImgRef.current = new Image();
        bgImgRef.current.src = '/equip-panel.png';
        await new Promise<void>(r => { bgImgRef.current!.onload = () => r(); });
      }
      ctx.clearRect(0, 0, PANEL_W, PANEL_H);
      ctx.drawImage(bgImgRef.current!, 0, 0);
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
    })();
  }, [equipment]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * PANEL_W / rect.width;
    const py = (e.clientY - rect.top) * PANEL_H / rect.height;
    for (const [slot, [cx, cy]] of Object.entries(SLOT_COORDS)) {
      if (Math.abs(px - cx) < ITEM_SIZE/2 && Math.abs(py - cy) < ITEM_SIZE/2) {
        if (equipment[slot]) onUnequip(slot);
        return;
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full block cursor-pointer mx-auto"
        style={{ imageRendering: 'pixelated' }}
        onClick={handleClick}
      />
    </div>
  );
}
`;

result.push(...canvasCode.split(/\r?\n/));

fs.writeFileSync("client/src/pages/inventory.tsx", result.join("\r\n"));
console.log("Lines:", result.length);
