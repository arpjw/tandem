"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Users },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/communication", label: "Communication", icon: MessageSquare },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="hidden md:flex justify-between items-center p-4">
         {/* Logo is in header for md+, but can be here for always visible logo in sidebar */}
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={item.label}
                className={cn(
                  "justify-start",
                   pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className="justify-start">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help" className="justify-start">
              <Link href="/help">
                <LifeBuoy className="h-5 w-5" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
