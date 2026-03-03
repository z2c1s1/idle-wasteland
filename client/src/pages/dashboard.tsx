import { useGameState } from "@/hooks/use-game";
import { calculateLevel, formatNumber } from "@/lib/game-utils";
import { Card } from "@/components/ui/card";
import { Axe, Pickaxe, TreePine, Gem, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: state } = useGameState();

  if (!state) return null;

  const stats = [
    {
      title: "Woodcutting Level",
      value: calculateLevel(state.woodcuttingXp),
      icon: Axe,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-500/20"
    },
    {
      title: "Mining Level",
      value: calculateLevel(state.miningXp),
      icon: Pickaxe,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-500/20"
    },
    {
      title: "Wood Gathered",
      value: formatNumber(state.woodCount),
      icon: TreePine,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      title: "Copper Ore",
      value: formatNumber(state.copperOreCount),
      icon: Gem,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground text-lg">Here is your current progress in the realm.</p>
      </div>

      {state.activeAction !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-primary/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Action in Progress</h3>
              <p className="text-sm text-muted-foreground capitalize">Currently {state.activeAction}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 bg-card border-white/5 hover:border-white/10 transition-colors shadow-xl rounded-3xl h-full flex flex-col justify-between">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.border} border`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
                <h4 className="text-4xl font-display font-bold text-foreground">{stat.value}</h4>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
