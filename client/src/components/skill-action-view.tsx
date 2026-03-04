import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateLevel, formatNumber, levelProgress, xpForLevel } from "@/lib/game-utils";
import type { LucideIcon } from "lucide-react";

interface SkillActionViewProps {
  title: string;
  description: string;
  level: number;
  xp: number;
  resourceName: string;
  resourceCount: number;
  isActive: boolean;
  isGlobalActive: boolean;
  icon: LucideIcon;
  themeColorClass: string;
  themeGlowClass: string;
  onToggle: () => void;
  isPending: boolean;
  disabled?: boolean;
}

export function SkillActionView({
  title,
  description,
  level,
  xp,
  resourceName,
  resourceCount,
  isActive,
  isGlobalActive,
  icon: Icon,
  themeColorClass,
  themeGlowClass,
  onToggle,
  isPending,
  disabled,
}: SkillActionViewProps) {
  const progress = levelProgress(xp);
  const nextXp = xpForLevel(level + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-4 ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <Card className="p-6 bg-card border-white/5 shadow-xl rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
        {isActive && (
          <motion.div 
            className={`absolute inset-0 opacity-10 ${themeColorClass.replace('text-', 'bg-')}`}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        
        <Icon className={`w-12 h-12 mb-4 ${isActive ? themeColorClass : 'text-muted-foreground'}`} />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex flex-col items-center mb-4">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Stockpile</span>
          <span className="text-2xl font-display font-bold">{formatNumber(resourceCount)}</span>
        </div>

        <Button
          onClick={onToggle}
          disabled={isPending || (isGlobalActive && !isActive) || disabled}
          variant={isActive ? "destructive" : "default"}
          className="w-full rounded-xl"
        >
          {isActive ? 'Stop' : disabled ? 'Locked' : 'Start'}
        </Button>
      </Card>
    </motion.div>
  );
}
