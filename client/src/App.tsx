import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { useGameState } from "./hooks/use-game";
import { AppSidebar } from "./components/layout/app-sidebar";
import { Header } from "./components/layout/header";

import Dashboard from "./pages/dashboard";
import Woodcutting from "./pages/woodcutting";
import Mining from "./pages/mining";
import Smelting from "./pages/smelting";
import Fishing from "./pages/fishing";
import Hunting from "./pages/hunting";
import Crafting from "./pages/crafting";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/woodcutting" component={Woodcutting} />
      <Route path="/mining" component={Mining} />
      <Route path="/smelting" component={Smelting} />
      <Route path="/fishing" component={Fishing} />
      <Route path="/hunting" component={Hunting} />
      <Route path="/crafting" component={Crafting} />
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
      <TooltipProvider>
        <GameWrapper>
          <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto">
                <Router />
              </main>
            </div>
          </div>
        </GameWrapper>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
