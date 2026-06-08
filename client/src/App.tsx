import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGameState } from "./hooks/use-game";
import { WastelandShell } from "@/components/wasteland";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Woodcutting from "@/pages/woodcutting";
import Mining from "@/pages/mining";
import Smelting from "@/pages/smelting";
import Fishing from "@/pages/fishing";
import Hunting from "@/pages/hunting";
import Combat from "@/pages/combat";
import Inventory from "@/pages/inventory";
import Smithing from "@/pages/smithing-craft";
import Leatherworking from "@/pages/leatherworking";
import Jewelcrafting from "@/pages/jewelcrafting";
import Gems from "@/pages/gems";
import Thieving from "@/pages/thieving";
import Tools from "@/pages/tools";
import Talents from "@/pages/talents";
import EquipmentSynth from "@/pages/equipment-synth";
import Shelter from "@/pages/shelter";
import Cooking from "@/pages/cooking";
import Alchemy from "@/pages/alchemy";
import Agility from "@/pages/agility";
import Prayer from "@/pages/prayer";
import Town from "@/pages/town";
import Exploration from "@/pages/exploration";
import WastelandTech from "@/pages/wasteland-tech";
import Materials from "@/pages/materials";
import Pets from "@/pages/pets";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/woodcutting" component={Woodcutting} />
      <Route path="/mining" component={Mining} />
      <Route path="/smelting" component={Smelting} />
      <Route path="/fishing" component={Fishing} />
      <Route path="/hunting" component={Hunting} />
      <Route path="/combat" component={Combat} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/materials" component={Materials} />
      <Route path="/smithing" component={Smithing} />
      <Route path="/leatherworking" component={Leatherworking} />
      <Route path="/jewelcrafting" component={Jewelcrafting} />
      <Route path="/gems" component={Gems} />
      <Route path="/thieving" component={Thieving} />
      <Route path="/tools" component={Tools} />
      <Route path="/talents" component={Talents} />
      <Route path="/equipment-synth" component={EquipmentSynth} />
      <Route path="/shelter" component={Shelter} />
      <Route path="/wasteland-tech" component={WastelandTech} />
      <Route path="/cooking" component={Cooking} />
      <Route path="/alchemy" component={Alchemy} />
      <Route path="/agility" component={Agility} />
      <Route path="/prayer" component={Prayer} />
      <Route path="/town" component={Town} />
      <Route path="/exploration" component={Exploration} />
      <Route path="/pets" component={Pets} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GameWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGameState();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-sm text-[hsl(var(--crt-green))] crt-glow">BOOTING TERMINAL...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <TooltipProvider>
        <GameWrapper>
          <WastelandShell>
            <Router />
          </WastelandShell>
        </GameWrapper>
        <Toaster />
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
