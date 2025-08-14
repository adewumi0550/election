'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Users, Vote, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    const menuItems = [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/elections', label: 'Elections', icon: Vote },
      { href: '/admin/candidates', label: 'Candidates', icon: Users },
      { href: '/admin/manifesto-writer', label: 'Manifesto Writer', icon: FileText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);


    if (loading || !user) {
      const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register' || pathname === '/admin/forgot-password';
      if (isAuthPage) {
        return <>{children}</>
      }
      return (
         <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
              <AppLogo />
              <Skeleton className="h-8 w-48" />
              <p className="text-muted-foreground">Loading & Verifying User...</p>
          </div>
        </div>
      );
    }

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    }
  
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
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
                        <LogOut />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
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
