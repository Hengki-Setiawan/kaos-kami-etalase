'use client';

import { useState, useEffect } from 'react';

import { BarChart3, Users, Eye, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';

interface AnalyticsData {
    period: string;
    totalViews: number;
    uniqueVisitors: number;
    byPage: { page: string; views: number }[];
    byDay: { date: string; views: number }[];
    topProducts: { id: string; views: number }[];
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics?period=${period}`);
            const result = await res.json();
            if (result.error) {
                setMessage('Jalankan migration dulu: /api/migrate/create-analytics');
            } else {
                setData(result);
            }
        } catch (error) {
            setMessage('Error fetching analytics');
        } finally {
            setLoading(false);
        }
    };

    const initMigration = async () => {
        setLoading(true);
        try {
            await fetch('/api/migrate/create-analytics');
            await fetchAnalytics();
            setMessage('Migration berhasil!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Migration gagal');
        }
    };

    const maxViews = data?.byPage.length ? Math.max(...data.byPage.map(p => p.views)) : 1;
    const maxDayViews = data?.byDay.length ? Math.max(...data.byDay.map(d => d.views)) : 1;

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Analytics</h1>
                    <p className="text-white/40 text-sm">分析 · 분석</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-white/5 border border-white/10 px-4 py-2 text-sm text-white"
                    >
                        <option value="1d">Last 24h</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                    </select>
                    <button
                        onClick={initMigration}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Init
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-3 text-sm ${message.includes('berhasil') ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {message}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card-urban p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="w-5 h-5 text-[#00d4ff]" />
                                <span className="text-xs text-white/40 uppercase tracking-wider">Total Views</span>
                            </div>
                            <p className="text-3xl font-black text-[#00d4ff]">{data.totalViews.toLocaleString()}</p>
                        </div>
                        <div className="card-urban p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-5 h-5 text-[#bbff00]" />
                                <span className="text-xs text-white/40 uppercase tracking-wider">Unique Visitors</span>
                            </div>
                            <p className="text-3xl font-black text-[#bbff00]">{data.uniqueVisitors.toLocaleString()}</p>
                        </div>
                        <div className="card-urban p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="w-5 h-5 text-[#ff3366]" />
                                <span className="text-xs text-white/40 uppercase tracking-wider">Pages Tracked</span>
                            </div>
                            <p className="text-3xl font-black text-[#ff3366]">{data.byPage.length}</p>
                        </div>
                        <div className="card-urban p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-white" />
                                <span className="text-xs text-white/40 uppercase tracking-wider">Avg/Day</span>
                            </div>
                            <p className="text-3xl font-black">
                                {data.byDay.length ? Math.round(data.totalViews / data.byDay.length) : 0}
                            </p>
                        </div>
                    </div>

                    {/* Views by Day Chart */}
                    {data.byDay.length > 0 && (
                        <div className="bg-white/5 border border-white/10 p-6">
                            <h3 className="font-bold uppercase tracking-wider mb-4 text-[#00d4ff]">Views by Day</h3>
                            <div className="flex items-end gap-1 h-32">
                                {data.byDay.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-[#00d4ff]/50 hover:bg-[#00d4ff] transition-colors rounded-t"
                                            style={{ height: `${(day.views / maxDayViews) * 100}%`, minHeight: '4px' }}
                                            title={`${day.date}: ${day.views} views`}
                                        />
                                        <span className="text-[8px] text-white/30 truncate w-full text-center">
                                            {new Date(day.date as string).getDate()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Views by Page */}
                    {data.byPage.length > 0 && (
                        <div className="bg-white/5 border border-white/10 p-6">
                            <h3 className="font-bold uppercase tracking-wider mb-4 text-[#bbff00]">Top Pages</h3>
                            <div className="space-y-3">
                                {data.byPage.map((page, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-white/40 w-6">{i + 1}.</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium truncate">{page.page}</span>
                                                <span className="text-sm text-[#bbff00] font-bold">{page.views}</span>
                                            </div>
                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#bbff00]"
                                                    style={{ width: `${(page.views / maxViews) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.byPage.length === 0 && (
                        <div className="text-center py-12 text-white/40">
                            Belum ada data. Page views akan tercatat saat pengunjung membuka website.
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-white/40">
                    Klik Init untuk membuat tables analytics.
                </div>
            )}
        </div>
    );
}
