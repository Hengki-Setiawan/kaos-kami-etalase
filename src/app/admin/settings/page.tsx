'use client';

import React from 'react';
import { Settings, Database, User } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminSettingsPage() {
    const { user } = useAdmin();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">Settings</h1>
                <p className="text-white/40 text-sm">設定 · 설정</p>
            </div>

            {/* Profile */}
            <div className="bg-[#141418] border border-white/5 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#00d4ff]" />
                    Admin Profile
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Email</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/10 text-white">
                            {user?.email || 'Not logged in'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">User ID</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/10 text-white/40 font-mono text-sm">
                            {user?.id || '-'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Database Info */}
            <div className="bg-[#141418] border border-white/5 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#bbff00]" />
                    Database
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Turso</span>
                        <span className="text-[#bbff00] text-sm font-bold">Connected</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Supabase</span>
                        <span className="text-[#bbff00] text-sm font-bold">Connected</span>
                    </div>
                </div>
            </div>

            {/* App Info */}
            <div className="bg-[#141418] border border-white/5 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#ff3366]" />
                    App Info
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Version</span>
                        <span className="text-white/40 text-sm">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Framework</span>
                        <span className="text-white/40 text-sm">Next.js 15</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-white/60">Theme</span>
                        <span className="text-white/40 text-sm">Streetwear Urban JP/KR</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
