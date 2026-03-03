import { Link, useLocation } from "wouter";
import { 
  Axe, 
  Pickaxe, 
  LayoutDashboard, 
  Swords, 
  Flame 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Woodcutting", url: "/woodcutting", icon: Axe },
  { title: "Mining", url: "/mining", icon: Pickaxe },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-white/10 bg-card">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
            <Swords className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-display tracking-wider">LITE IDLE</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-xs tracking-widest font-semibold mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        py-6 rounded-xl mb-1 transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5 hover:bg-primary/15' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                        <span className="font-semibold text-[15px]">{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
