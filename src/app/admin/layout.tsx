'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Users, Vote } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/elections', label: 'Elections', icon: Vote },
      { href: '/admin/candidates', label: 'Candidates', icon: Users },
      { href: '/admin/manifesto-writer', label: 'Manifesto Writer', icon: FileText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];
  
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:h-auto md:border-none md:bg-transparent md:px-6">
              <div className="md:hidden">
                  <SidebarTrigger />
              </div>
          </header>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
      <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}
