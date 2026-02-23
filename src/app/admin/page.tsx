'use client';

import React, { useState, useEffect } from 'react';
import {
    Package, QrCode, Layers, KeyRound, TrendingUp, RefreshCw, Loader2,
    Tag, Eye, Scan, MessageSquare, BarChart3, ArrowUpRight,
    Clock, Activity, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface Stats {
    products: number;
    series: number;
    codes: number;
    accessories: number;
}

interface RecentLabel {
    id: string;
    name: string;
    code: string;
    scan_count: number;
    last_scanned_at: string | null;
    created_at: string;
}

interface RecentTestimonial {
    id: string;
    name: string;
    content: string;
    rating: number;
    created_at: string;
}

export default function AdminDashboard() {
    const { user } = useUser();
    const [stats, setStats] = useState<Stats>({ products: 0, series: 0, codes: 0, accessories: 0 });
    const [labels, setLabels] = useState<RecentLabel[]>([]);
    const [testimonials, setTestimonials] = useState<RecentTestimonial[]>([]);
    const [totalLabels, setTotalLabels] = useState(0);
    const [totalScans, setTotalScans] = useState(0);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [statsRes, labelsRes, testimonialsRes, summaryRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/labels'),
                fetch('/api/testimonials'),
                fetch('/api/admin/analytics')
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.stats || { products: 0, series: 0, codes: 0, accessories: 0 });
            }

            if (labelsRes.ok) {
                const labelsData = await labelsRes.json();
                const labelsList = Array.isArray(labelsData) ? labelsData : [];
                setLabels(labelsList.slice(0, 5));
                setTotalLabels(labelsList.length);
                setTotalScans(labelsList.reduce((sum: number, l: any) => sum + (l.scan_count || 0), 0));
            }

            if (testimonialsRes.ok) {
                const testimonialsData = await testimonialsRes.json();
                setTestimonials(Array.isArray(testimonialsData) ? testimonialsData.slice(0, 3) : []);
            }

            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                setAiSummary(summaryData.summary || 'Tidak ada insight saat ini.');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Products', value: stats.products, icon: Package, color: '#00d4ff', gradient: 'from-[#00d4ff]/20 to-[#00d4ff]/5', href: '/admin/products' },
        { label: 'Series', value: stats.series, icon: Layers, color: '#bbff00', gradient: 'from-[#bbff00]/20 to-[#bbff00]/5', href: '/admin/series' },
        { label: 'Labels', value: totalLabels, icon: Tag, color: '#ff3366', gradient: 'from-[#ff3366]/20 to-[#ff3366]/5', href: '/admin/labels' },
        { label: 'Accessories', value: stats.accessories, icon: KeyRound, color: '#a855f7', gradient: 'from-purple-500/20 to-purple-500/5', href: '/admin/accessories' },
        { label: 'QR Codes', value: stats.codes, icon: QrCode, color: '#f97316', gradient: 'from-orange-500/20 to-orange-500/5', href: '/admin/codes' },
        { label: 'Total Scans', value: totalScans, icon: Scan, color: '#06b6d4', gradient: 'from-cyan-500/20 to-cyan-500/5', href: '/admin/analytics' },
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                        Welcome, {user?.firstName || 'Admin'}
                    </h1>
                    <p className="text-white/40 text-sm">ダッシュボード · 대시보드</p>
                </div>
                <button
                    onClick={fetchAll}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className={`group relative p-4 bg-gradient-to-br ${card.gradient} border border-white/5 hover:border-white/20 transition-all`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <card.icon className="w-5 h-5" style={{ color: card.color }} />
                            <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                        </div>
                        <div className="text-2xl font-black text-white">{card.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: card.color + '80' }}>
                            {card.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Labels - Takes 2 columns */}
                <div className="lg:col-span-2 bg-[#141418] border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#ff3366]" />
                            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Recent Labels</h2>
                        </div>
                        <Link href="/admin/labels" className="text-xs text-white/40 hover:text-[#00d4ff] transition-colors">
                            View All →
                        </Link>
                    </div>

                    {labels.length === 0 ? (
                        <div className="p-8 text-center text-white/30 text-sm">
                            No labels yet. Create your first label →
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {labels.map((label) => (
                                <div key={label.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#ff3366]/20 to-[#ff3366]/5 flex items-center justify-center flex-shrink-0">
                                            <Tag className="w-4 h-4 text-[#ff3366]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-sm truncate">{label.name}</p>
                                            <p className="text-[10px] text-white/30 font-mono">{label.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Scan className="w-3 h-3 text-cyan-400" />
                                                <span className="text-white/60 font-bold">{label.scan_count}</span>
                                            </div>
                                            {label.last_scanned_at && (
                                                <p className="text-[10px] text-white/30">
                                                    {new Date(label.last_scanned_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-[#141418] border border-white/5 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-[#bbff00]" />
                            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Overview</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded">
                                <span className="text-xs text-white/50">Total Products</span>
                                <span className="text-sm font-bold text-white">{stats.products}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded">
                                <span className="text-xs text-white/50">Active Labels</span>
                                <span className="text-sm font-bold text-[#bbff00]">{totalLabels}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded">
                                <span className="text-xs text-white/50">Total Scans</span>
                                <span className="text-sm font-bold text-[#00d4ff]">{totalScans}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded">
                                <span className="text-xs text-white/50">Avg Scans/Label</span>
                                <span className="text-sm font-bold text-[#ff3366]">
                                    {totalLabels > 0 ? (totalScans / totalLabels).toFixed(1) : '0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AI Analytics Summary */}
                    <div className="bg-[#141418] border border-[#bbff00]/20 p-4 relative overflow-hidden rounded-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#bbff00]/10 blur-3xl rounded-full pointer-events-none" />
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <Sparkles className="w-4 h-4 text-[#bbff00]" />
                            <h2 className="font-bold text-[#bbff00] text-sm uppercase tracking-wider">AI Review Insights</h2>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm text-white/80 leading-relaxed">
                                {aiSummary || 'Belum ada data ulasan untuk diringkas.'}
                            </p>
                        </div>
                    </div>

                    {/* Recent Testimonials */}
                    <div className="bg-[#141418] border border-white/5 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#a855f7]" />
                                <h2 className="font-bold text-white text-sm uppercase tracking-wider">Reviews</h2>
                            </div>
                            <Link href="/admin/testimonials" className="text-xs text-white/40 hover:text-[#00d4ff] transition-colors">
                                View All →
                            </Link>
                        </div>

                        {testimonials.length === 0 ? (
                            <div className="p-6 text-center text-white/30 text-sm">
                                No reviews yet
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {testimonials.map((t) => (
                                    <div key={t.id} className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-yellow-400 text-xs">
                                                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/60 line-clamp-2 mb-2">"{t.content}"</p>
                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{t.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 p-4 bg-[#141418] border border-white/5 hover:border-[#00d4ff]/30 transition-colors group"
                    >
                        <Package className="w-5 h-5 text-[#00d4ff]" />
                        <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Add Product</span>
                    </Link>
                    <Link
                        href="/admin/labels"
                        className="flex items-center gap-3 p-4 bg-[#141418] border border-white/5 hover:border-[#ff3366]/30 transition-colors group"
                    >
                        <Tag className="w-5 h-5 text-[#ff3366]" />
                        <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Create Label</span>
                    </Link>
                    <Link
                        href="/admin/codes"
                        className="flex items-center gap-3 p-4 bg-[#141418] border border-white/5 hover:border-orange-500/30 transition-colors group"
                    >
                        <QrCode className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Generate QR</span>
                    </Link>
                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 p-4 bg-[#141418] border border-white/5 hover:border-[#bbff00]/30 transition-colors group"
                    >
                        <BarChart3 className="w-5 h-5 text-[#bbff00]" />
                        <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">View Analytics</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
