'use client';

import React, { useState, useEffect } from 'react';
import { Package, QrCode, Layers, KeyRound, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    products: number;
    series: number;
    codes: number;
    accessories: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ products: 0, series: 0, codes: 0, accessories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats || { products: 0, series: 0, codes: 0, accessories: 0 });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: Package, color: 'from-[#00d4ff] to-blue-600', href: '/admin/products' },
        { label: 'Series', value: stats.series, icon: Layers, color: 'from-[#bbff00] to-green-600', href: '/admin/series' },
        { label: 'QR Codes', value: stats.codes, icon: QrCode, color: 'from-[#ff3366] to-pink-600', href: '/admin/codes' },
        { label: 'Accessories', value: stats.accessories, icon: KeyRound, color: 'from-purple-500 to-violet-600', href: '/admin/accessories' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white">Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1">ダッシュボード · 대시보드</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <Link key={index} href={stat.href} className="block group">
                        <div className="bg-[#141418] border border-white/5 p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-[#bbff00]" />
                            </div>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/products" className="bg-[#141418] border border-white/5 p-5 hover:border-[#00d4ff]/50 transition-colors group">
                    <h3 className="font-bold text-white mb-1 group-hover:text-[#00d4ff] transition-colors">Manage Products</h3>
                    <p className="text-sm text-white/40">Add, edit, or remove products</p>
                </Link>
                <Link href="/admin/codes" className="bg-[#141418] border border-white/5 p-5 hover:border-[#ff3366]/50 transition-colors group">
                    <h3 className="font-bold text-white mb-1 group-hover:text-[#ff3366] transition-colors">Generate QR Codes</h3>
                    <p className="text-sm text-white/40">Create QR codes for products</p>
                </Link>
                <Link href="/admin/series" className="bg-[#141418] border border-white/5 p-5 hover:border-[#bbff00]/50 transition-colors group">
                    <h3 className="font-bold text-white mb-1 group-hover:text-[#bbff00] transition-colors">Manage Series</h3>
                    <p className="text-sm text-white/40">Create and edit series</p>
                </Link>
            </div>
        </div>
    );
}
