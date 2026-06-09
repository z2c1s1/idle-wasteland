import { useState } from "react";
import { SurvivalBar } from "./SurvivalBar";
import { ZoneNav } from "./ZoneNav";
import { ActionDock } from "./ActionDock";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUIText } from "@/lib/i18n";
import { OfflineRewardPopup } from "./OfflineRewardPopup";
import { WastelandBroadcast } from "./WastelandBroadcast";

interface WastelandShellProps {
  children: React.ReactNode;
}

export function WastelandShell({ children }: WastelandShellProps) {
  const t = useUIText();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background" style={{
      backgroundImage: 'url(/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <OfflineRewardPopup />
      <WastelandBroadcast />
      <ScanlineOverlay className="fixed inset-0 z-50 opacity-[0.025] pointer-events-none" />

      <SurvivalBar onOpenNav={() => setNavOpen(true)} />

      <div className="flex min-h-0 flex-1">
        <ZoneNav className="hidden w-[240px] flex-shrink-0 md:flex" />

        <main className="relative min-w-0 flex-1 overflow-y-auto p-2 md:p-4" style={{ zoom: 1.5 }}>
          {children}
        </main>
      </div>

      <ActionDock />

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="w-[280px] border-[hsl(var(--border-rust))] bg-[hsl(var(--surface))] p-0">
          <SheetHeader className="border-b border-[hsl(var(--border-rust))] px-4 py-3">
            <SheetTitle className="font-display text-[hsl(var(--brass))]">{t.shell.mobileNavTitle}</SheetTitle>
          </SheetHeader>
          <ZoneNav className="h-[calc(100%-3.5rem)] border-r-0" onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
