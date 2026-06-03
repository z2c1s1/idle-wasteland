// SVG tool icons with tier-based coloring
// Colors: bronze=#CD7F32 iron=#C0C0C0 steel=#5588CC mithril=#E8E8FF adamant=#FFD700 rune=#FF4444 dragon=linear-gradient

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32', iron: '#C0C0C0', steel: '#5588CC',
  mithril: '#D8D8FF', adamant: '#FFD700', rune: '#FF4444', dragon: 'url(#dragonGrad)',
};

function getTierColor(toolId: string): string {
  if (toolId.includes('bronze') || toolId.includes('bone') || toolId.includes('basic')) return TIER_COLORS.bronze;
  if (toolId.includes('oak')) return '#8B7355';
  if (toolId.includes('iron')) return TIER_COLORS.iron;
  if (toolId.includes('steel')) return TIER_COLORS.steel;
  if (toolId.includes('mithril')) return TIER_COLORS.mithril;
  if (toolId.includes('adamant')) return TIER_COLORS.adamant;
  if (toolId.includes('rune')) return TIER_COLORS.rune;
  if (toolId.includes('dragon')) return TIER_COLORS.dragon;
  return '#888';
}

export function AxeIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B"/><stop offset="25%" stopColor="#FFD93D"/>
          <stop offset="50%" stopColor="#6BCB77"/><stop offset="75%" stopColor="#4D96FF"/>
          <stop offset="100%" stopColor="#FF6B6B"/>
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x="12" y="10" width="2.5" height="14" rx="1.25" fill="#C4A46C" />
      {/* Axe blade — curved, wraps left around handle */}
      <path d="M12 5 Q12 2 8 2 Q4 2 2 6 Q1 9 3 11 Q5 12 12 13 L12 5Z" fill={color} stroke="#333" strokeWidth="0.5" />
      {/* Blade cutting edge highlight */}
      <path d="M2 6 Q1.5 8 2.5 10" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" fill="none" />
      {/* Top of axe head */}
      <ellipse cx="10" cy="2.5" rx="3.5" ry="1.5" fill={color} stroke="#333" strokeWidth="0.5" />
    </svg>
  );
}

export function PickIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B"/><stop offset="25%" stopColor="#FFD93D"/>
          <stop offset="50%" stopColor="#6BCB77"/><stop offset="75%" stopColor="#4D96FF"/>
          <stop offset="100%" stopColor="#FF6B6B"/>
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x="12" y="6" width="2" height="16" rx="1" fill="#8B6914" transform="rotate(15,13,14)" />
      {/* Pick head */}
      <path d="M8 4 L18 2 L16 6 L6 8Z" fill={color} stroke="#333" strokeWidth="0.5" />
      {/* Pick point left */}
      <path d="M6 8 L2 10 L4 6Z" fill={color} stroke="#333" strokeWidth="0.5" />
      {/* Pick point right */}
      <path d="M16 6 L20 3 L18 8Z" fill={color} stroke="#333" strokeWidth="0.5" />
    </svg>
  );
}

export function RodIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B"/><stop offset="25%" stopColor="#FFD93D"/>
          <stop offset="50%" stopColor="#6BCB77"/><stop offset="75%" stopColor="#4D96FF"/>
          <stop offset="100%" stopColor="#FF6B6B"/>
        </linearGradient>
      </defs>
      {/* Rod body */}
      <line x1="4" y1="20" x2="18" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Handle */}
      <line x1="3" y1="20" x2="6" y2="18" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
      {/* Tip */}
      <circle cx="18" cy="4" r="1.5" fill={color === 'url(#dragonGrad)' ? '#FFD93D' : color} />
      {/* Line from tip */}
      <path d="M18 4 Q20 8 16 12" stroke="#999" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export function KnifeIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dragonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B"/><stop offset="25%" stopColor="#FFD93D"/>
          <stop offset="50%" stopColor="#6BCB77"/><stop offset="75%" stopColor="#4D96FF"/>
          <stop offset="100%" stopColor="#FF6B6B"/>
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x="10" y="14" width="3" height="8" rx="1" fill="#8B6914" />
      {/* Blade */}
      <path d="M10 4 L14 2 L14 14 L10 14Z" fill={color} stroke="#333" strokeWidth="0.5" />
      {/* Edge highlight */}
      <line x1="10" y1="6" x2="10" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      {/* Guard */}
      <rect x="8" y="13" width="8" height="2" rx="0.5" fill="#666" />
    </svg>
  );
}

// Main component: picks the right SVG based on tool ID
export function ToolIcon({ toolId, size = 20 }: { toolId: string; size?: number }) {
  const color = getTierColor(toolId);
  if (toolId.includes('axe') || toolId.includes('Axe')) return <AxeIcon color={color} size={size} />;
  if (toolId.includes('pick') || toolId.includes('Pick') || toolId.includes('镐')) return <PickIcon color={color} size={size} />;
  if (toolId.includes('rod') || toolId.includes('Rod') || toolId.includes('竿')) return <RodIcon color={color} size={size} />;
  if (toolId.includes('knife') || toolId.includes('Knife') || toolId.includes('刀')) return <KnifeIcon color={color} size={size} />;
  return <AxeIcon color={color} size={size} />;
}
