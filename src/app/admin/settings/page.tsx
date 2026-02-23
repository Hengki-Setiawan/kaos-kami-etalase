'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Settings, Database, User, Cloud, Shield, Tag, Save, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
    const { user } = useUser();

    // Promo Settings State
    const [promoSettings, setPromoSettings] = useState({
        promo_active: false,
        promo_text: '',
        promo_link: '',
        promo_start_date: '',
        promo_end_date: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();

                setPromoSettings({
                    promo_active: data.promo_active || false,
                    promo_text: data.promo_text || '',
                    promo_link: data.promo_link || '',
                    promo_start_date: data.promo_start_date || '',
                    promo_end_date: data.promo_end_date || ''
                });
            } catch (err) {
                console.error('Failed to load settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSavePromo = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: promoSettings })
            });
            if (res.ok) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to save settings.');
            }
        } catch (error) {
            setMessage('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

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
                            {user?.emailAddresses?.[0]?.emailAddress || 'Not logged in'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Name</label>
                        <div className="px-4 py-3 bg-white/5 border border-white/10 text-white">
                            {user?.fullName || user?.username || '-'}
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

            {/* Promo & Announcements */}
            <div className="bg-[#141418] border border-white/5 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-[#bbff00]" />
                        Promo & Announcements
                    </h2>
                    <button
                        onClick={handleSavePromo}
                        disabled={saving || loading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#bbff00] text-black font-bold uppercase tracking-wider hover:bg-[#bbff00]/90 transition-colors disabled:opacity-50 text-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Promo
                    </button>
                </div>

                {message && (
                    <div className={`mb-4 p-3 text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-white/40 py-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings...
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 py-2 border-b border-white/5">
                            <label className="text-sm font-bold uppercase tracking-wider text-white/60">Active Banner</label>
                            <button
                                onClick={() => setPromoSettings({ ...promoSettings, promo_active: !promoSettings.promo_active })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${promoSettings.promo_active ? 'bg-[#bbff00]' : 'bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${promoSettings.promo_active ? 'translate-x-7 bg-black' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Banner Text</label>
                            <input
                                type="text"
                                value={promoSettings.promo_text}
                                onChange={(e) => setPromoSettings({ ...promoSettings, promo_text: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#bbff00] focus:outline-none"
                                placeholder="E.g. DISKON 50% IDUL FITRI! GUNAKAN KODE: KAMI50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Banner Link (Optional)</label>
                            <input
                                type="text"
                                value={promoSettings.promo_link}
                                onChange={(e) => setPromoSettings({ ...promoSettings, promo_link: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white placeholder-white/30 focus:border-[#bbff00] focus:outline-none"
                                placeholder="https://shopee.co.id/... (Optional)"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Start Date (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={promoSettings.promo_start_date}
                                    onChange={(e) => setPromoSettings({ ...promoSettings, promo_start_date: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white/60 focus:border-[#bbff00] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">End Date (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={promoSettings.promo_end_date}
                                    onChange={(e) => setPromoSettings({ ...promoSettings, promo_end_date: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1e] border border-white/10 text-white/60 focus:border-[#bbff00] focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Services Info */}
            <div className="bg-[#141418] border border-white/5 p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#bbff00]" />
                    Services
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#00d4ff]" />
                            <span className="text-white/60">Turso (Database)</span>
                        </div>
                        <span className="text-[#bbff00] text-sm font-bold">Connected</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#ff3366]" />
                            <span className="text-white/60">Clerk (Auth)</span>
                        </div>
                        <span className="text-[#bbff00] text-sm font-bold">Connected</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-purple-400" />
                            <span className="text-white/60">Cloudinary (Storage)</span>
                        </div>
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
                        <span className="text-white/40 text-sm">2.0.0</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Framework</span>
                        <span className="text-white/40 text-sm">Next.js 16</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Auth</span>
                        <span className="text-white/40 text-sm">Clerk</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-white/60">Storage</span>
                        <span className="text-white/40 text-sm">Cloudinary</span>
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
