import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGameState } from "./hooks/use-game";
import { AppSidebar } from "./components/layout/app-sidebar";
import { Header } from "./components/layout/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
import Homestead from "@/pages/homestead";
import Cooking from "@/pages/cooking";
import Alchemy from "@/pages/alchemy";
import Agility from "@/pages/agility";
import Prayer from "@/pages/prayer";
import Town from "@/pages/town";
import Exploration from "@/pages/exploration";
import WastelandTech from "@/pages/wasteland-tech";

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
      <Route path="/smithing" component={Smithing} />
      <Route path="/leatherworking" component={Leatherworking} />
      <Route path="/jewelcrafting" component={Jewelcrafting} />
      <Route path="/gems" component={Gems} />
      <Route path="/thieving" component={Thieving} />
      <Route path="/tools" component={Tools} />
      <Route path="/talents" component={Talents} />
      <Route path="/equipment-synth" component={EquipmentSynth} />
      <Route path="/homestead" component={Homestead} />
      <Route path="/wasteland-tech" component={WastelandTech} />
      <Route path="/cooking" component={Cooking} />
      <Route path="/alchemy" component={Alchemy} />
      <Route path="/agility" component={Agility} />
      <Route path="/prayer" component={Prayer} />
      <Route path="/town" component={Town} />
      <Route path="/exploration" component={Exploration} />
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
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
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
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <main className="flex-1 overflow-y-auto p-2 md:p-4">
                <Router />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </GameWrapper>
        <Toaster />
      </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
