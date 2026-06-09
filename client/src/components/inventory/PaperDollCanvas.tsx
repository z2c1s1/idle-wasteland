import React from "react";

// ─── Paper Doll Canvas ──────────────────────────────────────────────────
const SLOT_COORDS: Record<string, [number, number]> = {
  helmet: [623, 155],
  weapon: [242, 267], chest: [1004, 268],
  offhand: [242, 433], legs: [1005, 434],
  ring: [242, 600], neck: [1006, 599],
  gloves: [241, 765], boots: [1004, 764],
};
const PANEL_W = 1254, PANEL_H = 1254, ITEM_SIZE = 64;

export function PaperDollCanvas({ equipment, onUnequip }: { equipment: Record<string, any>; onUnequip: (slot: string) => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const bgImgRef = React.useRef<HTMLImageElement | null>(null);

  // Dynamic cursor: pointer only over slot areas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * PANEL_W / rect.width;
    const py = (e.clientY - rect.top) * PANEL_H / rect.height;
    let overSlot = false;
    for (const [, [cx, cy]] of Object.entries(SLOT_COORDS)) {
      if (Math.abs(px - cx) < ITEM_SIZE/2 && Math.abs(py - cy) < ITEM_SIZE/2) {
        overSlot = true; break;
      }
    }
    canvas.style.cursor = overSlot ? 'pointer' : 'default';
  };

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
        className="w-full block mx-auto"
        style={{ imageRendering: 'pixelated', cursor: 'default' }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}
