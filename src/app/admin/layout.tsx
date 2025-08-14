'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, FileText, Settings, Users, Vote, Loader2 } from 'lucide-react';

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
import { AuthProvider, useAuth } from '@/hooks/use-auth';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    
    const handleSignOut = async () => {
        await signOut();
        router.push('/admin-login');
    };

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/admin-login');
        }
    }, [user, loading, router]);


    const menuItems = [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/elections', label: 'Elections', icon: Vote },
      { href: '/admin/candidates', label: 'Candidates', icon: Users },
      { href: '/admin/manifesto-writer', label: 'Manifesto Writer', icon: FileText },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
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
             <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOut /> Sign Out
              </Button>
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
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
