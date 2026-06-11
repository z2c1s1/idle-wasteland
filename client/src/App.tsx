import { Switch, Route } from "wouter";
import { R } from "@/lib/routes";
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
import Bounties from "@/pages/bounties";
import Pets from "@/pages/pets";
import Crafting from "@/pages/crafting";
import Gamble from "@/pages/gamble";

function Router() {
  return (
    <Switch>
      <Route path={R.dashboard} component={Dashboard} />
      <Route path={R.woodcutting} component={Woodcutting} />
      <Route path={R.mining} component={Mining} />
      <Route path={R.smelting} component={Smelting} />
      <Route path={R.fishing} component={Fishing} />
      <Route path={R.hunting} component={Hunting} />
      <Route path={R.combat} component={Combat} />
      <Route path={R.inventory} component={Inventory} />
      <Route path={R.materials} component={Materials} />
      <Route path={R.bounties} component={Bounties} />
      <Route path={R.smithing} component={Smithing} />
      <Route path={R.leatherworking} component={Leatherworking} />
      <Route path={R.jewelcrafting} component={Jewelcrafting} />
      <Route path={R.gems} component={Gems} />
      <Route path={R.thieving} component={Thieving} />
      <Route path={R.tools} component={Tools} />
      <Route path={R.talents} component={Talents} />
      <Route path={R.equipmentSynth} component={EquipmentSynth} />
      <Route path={R.shelter} component={Shelter} />
      <Route path={R.wastelandTech} component={WastelandTech} />
      <Route path={R.cooking} component={Cooking} />
      <Route path={R.alchemy} component={Alchemy} />
      <Route path={R.agility} component={Agility} />
      <Route path={R.prayer} component={Prayer} />
      <Route path={R.town} component={Town} />
      <Route path={R.exploration} component={Exploration} />
      <Route path={R.crafting} component={Crafting} />
      <Route path={R.gamble} component={Gamble} />
      <Route path={R.pets} component={Pets} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GameWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isError, refetch } = useGameState();
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
  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <p className="font-mono text-lg text-red-400 mb-3">⚠️ 终端连接失败</p>
          <p className="text-sm text-muted-foreground mb-4">无法连接到废土服务器，请检查网络后重试。</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-mono">
            重新连接
          </button>
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
