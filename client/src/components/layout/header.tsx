import { useGameState, useStartAction } from "@/hooks/use-game";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, Power, TreePine, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Header() {
  const { data: state } = useGameState();
  const { mutate: startAction, isPending } = useStartAction();

  if (!state) return null;

  const isActive = state.activeAction !== 'idle';
  
  const stopAction = () => {
    startAction('idle');
  };

  const getActionDetails = () => {
    switch(state.activeAction) {
      case 'woodcutting':
        return { name: 'Woodcutting', icon: TreePine, color: 'text-emerald-400', bg: 'bg-emerald-400' };
      case 'mining':
        return { name: 'Mining', icon: Gem, color: 'text-amber-400', bg: 'bg-amber-400' };
      default:
        return { name: 'Idle', icon: Power, color: 'text-muted-foreground', bg: 'bg-muted-foreground' };
    }
  };

  const details = getActionDetails();
  const ActionIcon = details.icon;

  return (
    <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex flex-col">
          <h1 className="font-display font-bold text-lg text-foreground">Active Hero</h1>
          <p className="text-xs text-muted-foreground">Level 1 Adventurer</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card/50 border border-white/5 px-4 py-2 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {isActive && (
              <motion.div 
                className={`absolute inset-0 rounded-full opacity-40 blur-sm ${details.bg}`}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <ActionIcon className={`w-5 h-5 relative z-10 ${details.color}`} />
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Current Activity
            </span>
            <span className={`text-sm font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {details.name}
            </span>
          </div>
        </div>

        {isActive && (
          <div className="ml-4 pl-4 border-l border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={stopAction}
              disabled={isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
            >
              Stop
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
