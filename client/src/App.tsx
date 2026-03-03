import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";

import { useGameState } from "./hooks/use-game";
import { LoadingScreen } from "./components/ui/loading-screen";
import { AppSidebar } from "./components/layout/app-sidebar";
import { Header } from "./components/layout/header";

import Dashboard from "./pages/dashboard";
import Woodcutting from "./pages/woodcutting";
import Mining from "./pages/mining";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/woodcutting" component={Woodcutting}/>
      <Route path="/mining" component={Mining}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function GameWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGameState();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameWrapper>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full bg-background text-foreground overflow-hidden selection:bg-primary/30">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Global subtle texture/gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none z-0" />
                
                <Header />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative z-10">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </GameWrapper>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
