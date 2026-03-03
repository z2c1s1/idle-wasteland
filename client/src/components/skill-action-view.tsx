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
}: SkillActionViewProps) {
  const progress = levelProgress(xp);
  const nextXp = xpForLevel(level + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto"
    >
      {/* Interaction Panel */}
      <div className="flex-1 bg-card border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-2xl">
        {/* Animated Background when active */}
        {isActive && (
          <motion.div 
            className={`absolute inset-0 opacity-10 ${themeColorClass.replace('text-', 'bg-')}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        
        {isActive && (
           <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none`} />
        )}

        <div className="z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-md mb-12">{description}</p>
          
          <div className="relative mb-12">
            {isActive && (
              <motion.div 
                className={`absolute inset-0 rounded-full blur-[40px] opacity-30 ${themeColorClass.replace('text-', 'bg-')}`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <motion.div 
              className={`
                p-12 rounded-full border-2 bg-background/50 backdrop-blur-xl relative z-10
                transition-all duration-500
                ${isActive ? `border-${themeColorClass.replace('text-', '')} shadow-lg ${themeGlowClass}` : 'border-white/10'}
              `}
              animate={isActive ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={`w-24 h-24 ${isActive ? themeColorClass : 'text-muted-foreground'} transition-colors duration-500`} />
            </motion.div>
          </div>

          <Button
            size="lg"
            variant={isActive ? "destructive" : "default"}
            onClick={onToggle}
            disabled={isPending || (isGlobalActive && !isActive)}
            className={`
              text-lg px-12 py-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold tracking-wide
              ${!isActive && !isGlobalActive ? `${themeColorClass.replace('text-', 'bg-')} hover:brightness-110 text-primary-foreground` : ''}
              ${isGlobalActive && !isActive ? 'opacity-50' : ''}
            `}
          >
            {isActive ? `Stop ${title}` : `Start ${title}`}
          </Button>
          
          {isGlobalActive && !isActive && (
            <p className="mt-4 text-sm text-destructive font-medium">
              You are already doing another action.
            </p>
          )}
        </div>
      </div>

      {/* Stats Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-6">
        <Card className="p-6 bg-card border-white/5 shadow-xl rounded-3xl">
          <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            Skill Progress
          </h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground font-medium">Current Level</span>
              <span className={`text-4xl font-display font-bold ${themeColorClass}`}>{level}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold text-foreground">{formatNumber(xp)} / {formatNumber(nextXp)} XP</span>
              </div>
              <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className={`absolute top-0 left-0 h-full ${themeColorClass.replace('text-', 'bg-')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-white/5 shadow-xl rounded-3xl flex-1">
          <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            Inventory
          </h3>
          
          <div className="flex flex-col items-center justify-center h-48 bg-background/50 rounded-2xl border border-white/5">
            <span className="text-muted-foreground font-medium mb-2">{resourceName}</span>
            <span className="text-5xl font-display font-bold text-foreground tracking-tight">
              {formatNumber(resourceCount)}
            </span>
            {isActive && (
              <span className={`text-sm mt-4 ${themeColorClass} animate-pulse font-medium`}>
                Gathering...
              </span>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
