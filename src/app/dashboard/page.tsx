'use client';

import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Shield, ShoppingBag, Heart, ArrowRight, Scan, LogOut } from 'lucide-react';

export default function UserDashboard() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Check if user is admin (by email or metadata)
    const isAdmin = user?.publicMetadata?.role === 'admin' ||
        user?.emailAddresses?.some(e => ['hengkisetiawan461@gmail.com'].includes(e.emailAddress?.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#0a0a0c]">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0f0f12]">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: { avatarBox: 'w-12 h-12' }
                                }}
                            />
                            <div>
                                <h1 className="text-xl font-black text-white uppercase tracking-tight">
                                    {user?.firstName || user?.username || 'Welcome'}
                                </h1>
                                <p className="text-sm text-white/40">
                                    {user?.emailAddresses?.[0]?.emailAddress}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="text-sm text-white/40 hover:text-white transition-colors"
                        >
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Admin Banner */}
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="flex items-center justify-between p-5 mb-6 bg-gradient-to-r from-[#00d4ff]/10 to-[#ff3366]/10 border border-[#00d4ff]/30 hover:border-[#00d4ff]/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#ff3366] flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Admin Dashboard</h3>
                                <p className="text-xs text-white/40">Manage products, orders, and settings</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#00d4ff] transition-colors" />
                    </Link>
                )}

                {/* Quick Actions */}
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/series"
                        className="flex items-center gap-4 p-5 bg-[#141418] border border-white/5 hover:border-[#00d4ff]/30 transition-colors group"
                    >
                        <ShoppingBag className="w-8 h-8 text-[#00d4ff]" />
                        <div>
                            <h3 className="font-bold text-white group-hover:text-[#00d4ff] transition-colors">Browse Collections</h3>
                            <p className="text-xs text-white/40">Explore our series</p>
                        </div>
                    </Link>

                    <Link
                        href="/scanner"
                        className="flex items-center gap-4 p-5 bg-[#141418] border border-white/5 hover:border-[#bbff00]/30 transition-colors group"
                    >
                        <Scan className="w-8 h-8 text-[#bbff00]" />
                        <div>
                            <h3 className="font-bold text-white group-hover:text-[#bbff00] transition-colors">Scan QR Label</h3>
                            <p className="text-xs text-white/40">Verify authenticity</p>
                        </div>
                    </Link>

                    <Link
                        href="/accessories"
                        className="flex items-center gap-4 p-5 bg-[#141418] border border-white/5 hover:border-[#ff3366]/30 transition-colors group"
                    >
                        <Heart className="w-8 h-8 text-[#ff3366]" />
                        <div>
                            <h3 className="font-bold text-white group-hover:text-[#ff3366] transition-colors">Accessories</h3>
                            <p className="text-xs text-white/40">Pins, stickers & more</p>
                        </div>
                    </Link>
                </div>

                {/* Account Info */}
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
                    Account Info
                </h2>
                <div className="bg-[#141418] border border-white/5 p-6 space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm text-white/40">Name</span>
                        <span className="text-sm text-white font-medium">
                            {user?.fullName || user?.username || '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm text-white/40">Email</span>
                        <span className="text-sm text-white font-medium">
                            {user?.emailAddresses?.[0]?.emailAddress || '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm text-white/40">Member Since</span>
                        <span className="text-sm text-white font-medium">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-white/40">Role</span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${isAdmin ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/10 text-white/60'}`}>
                            {isAdmin ? 'Admin' : 'Member'}
                        </span>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-3 border border-white/10 text-white/50 hover:text-[#ff3366] hover:border-[#ff3366]/30 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
