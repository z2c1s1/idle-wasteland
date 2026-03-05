import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateLevel, formatNumber, levelProgress, xpForLevel } from "@/lib/game-utils";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

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
  actionStartTime?: string;
  cycleTime: number;
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
  actionStartTime,
  cycleTime,
}: SkillActionViewProps) {
  const [visualCount, setVisualCount] = useState(resourceCount);

  useEffect(() => {
    setVisualCount(resourceCount);
  }, [resourceCount]);

  useEffect(() => {
    if (!isActive || !actionStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(actionStartTime);
      const elapsed = (now.getTime() - start.getTime()) / 1000;
      const progress = (elapsed % cycleTime) / cycleTime;
      const baseCompletions = Math.floor(elapsed / cycleTime);
      setVisualCount(resourceCount + baseCompletions + progress);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, actionStartTime, cycleTime, resourceCount]);

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
          <span className="text-2xl font-display font-bold">
            {isActive ? visualCount.toFixed(2) : formatNumber(resourceCount)}
          </span>
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
