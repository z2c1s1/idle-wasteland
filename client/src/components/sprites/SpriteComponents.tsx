// ═══════════════════════════════════════════════════════════════════════════════
// SVG 精灵组件 — 零依赖纯 SVG
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  ENEMY_ARCHETYPE_MAP, ARCHETYPE_COLORS, type EnemyArchetype,
  SLOT_SHAPE, EQUIPMENT_SPRITES, RARITY_GLOW,
  SKILL_SPRITES, type SkillIconName,
  GEM_COLORS, RESOURCE_SPRITES, type ResourceType,
  DECORATION,
  detectWeaponShape, tierColor,
  type SpriteDef,
} from "./spriteData";

// ─── 通用 SVG 渲染器 ─────────────────────────────────────────────────────────

function SpriteSvg({ def, color, size = 32, className = "" }: {
  def: SpriteDef; color?: string; size?: number; className?: string;
}) {
  return (
    <svg viewBox={def.viewBox} width={size} height={size}
      className={className} style={{ color, display: "block" }}
    >
      {def.paths.map((p, i) => (
        <path key={i} d={p.d}
          fill={p.fill ?? (p.stroke ? "none" : "currentColor")}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
}

// ─── EnemySprite ──────────────────────────────────────────────────────────────

interface EnemySpriteProps { enemyId: string; size?: number; className?: string; }

export function EnemySprite({ enemyId, size = 48, className = "" }: EnemySpriteProps) {
  const arch = ENEMY_ARCHETYPE_MAP[enemyId] ?? 'humanoid';
  const c = ARCHETYPE_COLORS[arch];

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className}
      style={{ display: "block", filter: `drop-shadow(0 2px 2px ${c.secondary}44)` }}
    >
      {/* Body */}
      <EnemyBody arch={arch} color={c} />
      {/* Eyes */}
      <circle cx="18" cy="16" r="3" fill={c.eye} />
      <circle cx="30" cy="16" r="3" fill={c.eye} />
      {/* Mouth */}
      {arch === 'mutant' && <path d="M16 26 Q24 32 32 26" fill="none" stroke={c.primary} strokeWidth="2" />}
      {arch === 'dragon' && <path d="M16 26 L24 30 L32 26" fill="none" stroke="#ff8800" strokeWidth="2" />}
      {arch === 'undead' && <path d="M16 26 L24 28 L32 26" fill="none" stroke={c.eye} strokeWidth="1.5" />}
    </svg>
  );
}

function EnemyBody({ arch, color }: { arch: EnemyArchetype; color: { primary: string; secondary: string } }) {
  switch (arch) {
    case 'insect':
      return <>
        <ellipse cx="24" cy="22" rx="14" ry="10" fill={color.primary} />
        <ellipse cx="24" cy="20" rx="12" ry="8" fill={color.secondary} />
        <path d="M8 18 Q4 10 10 8 M40 18 Q44 10 38 8" fill="none" stroke={color.primary} strokeWidth="2" />
      </>;
    case 'rodent':
      return <>
        <ellipse cx="24" cy="24" rx="12" ry="10" fill={color.primary} />
        <ellipse cx="24" cy="28" rx="8" ry="6" fill={color.secondary} />
        <circle cx="12" cy="22" r="5" fill={color.primary} />
        <circle cx="12" cy="22" r="3" fill={color.secondary} />
      </>;
    case 'humanoid':
      return <>
        <rect x="14" y="8" width="20" height="24" rx="6" fill={color.primary} />
        <rect x="16" y="12" width="16" height="16" rx="4" fill={color.secondary} />
        <circle cx="24" cy="6" r="8" fill={color.primary} />
        <rect x="6" y="18" width="8" height="3" rx="1" fill={color.primary} />
        <rect x="34" y="18" width="8" height="3" rx="1" fill={color.primary} />
      </>;
    case 'mutant':
      return <>
        <ellipse cx="24" cy="24" rx="16" ry="12" fill={color.primary} />
        <ellipse cx="24" cy="22" rx="13" ry="9" fill={color.secondary} />
        <circle cx="24" cy="8" r="9" fill={color.primary} />
        <path d="M6 20 Q2 18 4 14 M42 20 Q46 18 44 14" fill="none" stroke={color.primary} strokeWidth="3" />
      </>;
    case 'mech':
      return <>
        <rect x="10" y="10" width="28" height="26" rx="4" fill={color.primary} />
        <rect x="14" y="14" width="20" height="18" rx="2" fill={color.secondary} />
        <rect x="16" y="16" width="16" height="4" rx="1" fill={color.eye} />
        <rect x="4" y="18" width="6" height="10" rx="2" fill={color.primary} />
        <rect x="38" y="18" width="6" height="10" rx="2" fill={color.primary} />
        <rect x="16" y="36" width="6" height="6" rx="1" fill={color.primary} />
        <rect x="26" y="36" width="6" height="6" rx="1" fill={color.primary} />
      </>;
    case 'dragon':
      return <>
        <path d="M24 4 L36 16 L32 28 L40 36 L30 40 L24 32 L18 40 L8 36 L16 28 L12 16 Z" fill={color.primary} />
        <path d="M18 18 L24 24 L30 18 L24 28 Z" fill={color.secondary} />
        <path d="M6 20 L10 16 L10 24 Z" fill={color.primary} />
        <path d="M42 20 L38 16 L38 24 Z" fill={color.primary} />
      </>;
    case 'undead':
      return <>
        <path d="M16 6 Q24 2 32 6 L36 16 L34 34 L24 38 L14 34 L12 16 Z" fill={color.primary} />
        <path d="M18 12 L24 18 L30 12 M20 10 L24 6 L28 10" fill="none" stroke={color.secondary} strokeWidth="1.5" />
        <rect x="8" y="18" width="6" height="12" rx="2" fill={color.primary} opacity="0.6" />
        <rect x="34" y="18" width="6" height="12" rx="2" fill={color.primary} opacity="0.6" />
      </>;
    case 'boss':
      return <>
        <path d="M12 10 Q24 0 36 10 L40 20 L36 38 Q24 44 12 38 L8 20 Z" fill={color.primary} />
        <path d="M16 14 Q24 10 32 14 L34 20 Q24 28 14 20 Z" fill={color.secondary} />
        <circle cx="16" cy="24" r="3" fill={color.eye} />
        <circle cx="32" cy="24" r="3" fill={color.eye} />
        <path d="M14 8 L24 2 L34 8" fill="none" stroke={color.secondary} strokeWidth="3" />
        <path d="M8 30 L4 28 M40 30 L44 28" fill="none" stroke={color.primary} strokeWidth="3" />
      </>;
    default:
      return <circle cx="24" cy="24" r="16" fill={color.primary} />;
  }
}

// ─── ItemSprite ───────────────────────────────────────────────────────────────

interface ItemSpriteProps {
  slot: string;
  baseId?: string;
  rarity?: string;
  ilvl?: number;
  size?: number;
  className?: string;
}

export function ItemSprite({ slot, baseId, rarity = 'common', ilvl = 5, size = 32, className = "" }: ItemSpriteProps) {
  const shape = slot === 'weapon' && baseId
    ? detectWeaponShape(baseId)
    : (SLOT_SHAPE[slot] ?? 'sword');

  const def = EQUIPMENT_SPRITES[shape];
  const color = tierColor(ilvl);
  const glow = RARITY_GLOW[rarity] ?? RARITY_GLOW.common;

  if (!def) {
    return <SpriteSvg def={EQUIPMENT_SPRITES.sword} color={color} size={size} className={className} />;
  }

  return (
    <svg viewBox={def.viewBox} width={size} height={size} className={className}
      style={{ display: "block", filter: glow.glow, color }}
    >
      {/* Rarity border glow ring */}
      {rarity !== 'common' && (
        <rect x="1" y="1" width="30" height="30" rx="4"
          fill="none" stroke={glow.stroke} strokeWidth="1.5" opacity="0.6" />
      )}
      {def.paths.map((p, i) => (
        <path key={i} d={p.d}
          fill={p.fill ?? (p.stroke ? "none" : "currentColor")}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
}

// ─── GemSprite ────────────────────────────────────────────────────────────────

interface GemSpriteProps { gemKey: string; size?: number; className?: string; }

export function GemSprite({ gemKey, size = 24, className = "" }: GemSpriteProps) {
  const color = GEM_COLORS[gemKey] ?? '#ccc';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}
      style={{ display: "block", filter: `drop-shadow(0 0 3px ${color}66)` }}
    >
      <path d="M12 2 L18 8 L12 14 L6 8 Z" fill={color} opacity="0.8" />
      <path d="M12 14 L18 8 L20 18 L12 22 L4 18 L6 8 Z" fill={color} opacity="0.5" />
      <path d="M12 14 L18 8 L20 18 L12 22" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ─── SkillSprite ──────────────────────────────────────────────────────────────

interface SkillSpriteProps { skill: SkillIconName; size?: number; className?: string; }

export function SkillSprite({ skill, size = 20, className = "" }: SkillSpriteProps) {
  const def = SKILL_SPRITES[skill];
  if (!def) return <SpriteSvg def={SKILL_SPRITES.dashboard} size={size} className={className} />;
  return <SpriteSvg def={def} size={size} className={className} />;
}

// ─── ResourceIcon ─────────────────────────────────────────────────────────────

interface ResourceIconProps { type: ResourceType; size?: number; className?: string; }

export function ResourceIcon({ type, size = 20, className = "" }: ResourceIconProps) {
  const def = RESOURCE_SPRITES[type];
  if (!def) return <SpriteSvg def={RESOURCE_SPRITES.wood} size={size} className={className} />;
  return <SpriteSvg def={def} size={size} className={className} />;
}

// ─── 装饰精灵 ─────────────────────────────────────────────────────────────────

export function RadiationIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <SpriteSvg def={DECORATION.radiation} color="#ffcc00" size={size} className={className} />;
}

export function SparkIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <SpriteSvg def={DECORATION.spark} color="#ffcc00" size={size} className={className} />;
}

export function SkullIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return <SpriteSvg def={DECORATION.skull} color="#cc3333" size={size} className={className} />;
}
