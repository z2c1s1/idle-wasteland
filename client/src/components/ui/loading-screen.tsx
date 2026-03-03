import { Swords } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      
      <motion.div 
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 border-2 border-primary/20 rounded-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-2xl">
            <Swords className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-display text-3xl font-bold tracking-widest text-foreground">LITE IDLE</h2>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-sm">Loading Realm...</p>
        </div>
      </motion.div>
    </div>
  );
}
