'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Users, Vote, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

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

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const menuItems = [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/elections', label: 'Elections', icon: Vote },
      { href: '/admin/candidates', label: 'Candidates', icon: Users },
      { href: '/admin/manifesto-writer', label: 'Manifesto Writer', icon: FileText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];
  
    React.useEffect(() => {
        if (!loading && !user) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/admin/login' && currentPath !== '/admin/register' && currentPath !== '/admin/forgot-password') {
                router.push('/admin/login');
            }
        }
    }, [user, loading, router]);


    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    // Render login/register/forgot-password pages without the main layout
    if (!user) {
        return <>{children}</>
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
             <SidebarMenuItem>
                <Button onClick={signOut} variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2" />
                    Sign Out
                </Button>
            </SidebarMenuItem>
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
