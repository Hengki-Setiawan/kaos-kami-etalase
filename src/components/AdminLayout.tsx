'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import {
    LayoutDashboard,
    Package,
    QrCode,
    Layers,
    KeyRound,
    Settings,
    Menu,
    X,
    Home,
    FileText,
    MessageSquare,
    BarChart3,
    Tag,
    Users
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/labels', label: 'Labels', icon: Tag },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
    { href: '/admin/series', label: 'Series', icon: Layers },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/accessories', label: 'Accessories', icon: KeyRound },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/attributes', label: 'Attributes', icon: Settings },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Show loading state
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#0a0a0c]">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 w-64 bg-[#0f0f12] border-r border-white/5 z-50 
                transform transition-transform lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#ff3366] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="text-white font-bold">Admin</span>
                        </Link>
                        <button
                            className="lg:hidden text-white/40 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-[#00d4ff] text-black font-bold'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="p-4 border-t border-white/5 space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Member Profile
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Back to Store
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f0f12]">
                    <button
                        className="lg:hidden text-white/40 hover:text-white"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <span className="text-sm text-white/40">
                            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Admin'}
                        </span>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: 'w-8 h-8',
                                }
                            }}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
