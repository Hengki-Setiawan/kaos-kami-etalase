'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shirt, Calendar, MessageCircle, Tag, ShoppingBag, QrCode } from 'lucide-react';
import Link from 'next/link';

function LabelContent() {
    const searchParams = useSearchParams();

    const productName = searchParams.get('name') || 'Unknown Product';
    const series = searchParams.get('series') || 'unknown';
    const description = searchParams.get('desc') || '';
    const purchaseDate = searchParams.get('date') || '';
    const customMessage = searchParams.get('msg') || '';

    const seriesInfo: Record<string, { name: string; jp: string; color: string }> = {
        'kami-community': { name: 'Kami Community', jp: 'コミュニティ', color: '#bbff00' },
        'anime-streetwear': { name: 'Anime Streetwear', jp: 'ストリート', color: '#00d4ff' },
        'anime-music-fusion': { name: 'Anime × Music', jp: 'アニメ音楽', color: '#ff3366' },
    };

    const currentSeries = seriesInfo[series] || seriesInfo['kami-community'];

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-lg mx-auto">
                    {/* Label Card */}
                    <div className="border border-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 text-center border-b border-white/10" style={{ background: `linear-gradient(135deg, ${currentSeries.color}10 0%, transparent 100%)` }}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <QrCode className="w-4 h-4" style={{ color: currentSeries.color }} />
                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: currentSeries.color }}>
                                    Digital Label
                                </span>
                            </div>
                            <h1 className="text-xl font-black tracking-wider uppercase">KAOS KAMI</h1>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 space-y-6">
                            <div className="text-center pb-6 border-b border-white/10">
                                <Shirt className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: currentSeries.color }} strokeWidth={1} />
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{productName}</h2>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xs font-bold tracking-widest" style={{ color: currentSeries.color }}>
                                        {currentSeries.jp}
                                    </span>
                                    <span className="text-white/30">・</span>
                                    <span className="text-xs text-white/50">{currentSeries.name}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {description && (
                                    <div className="flex items-start gap-4">
                                        <Tag className="w-5 h-5 text-white/30 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Deskripsi</span>
                                            <p className="text-sm text-white/70">{description}</p>
                                        </div>
                                    </div>
                                )}

                                {purchaseDate && (
                                    <div className="flex items-start gap-4">
                                        <Calendar className="w-5 h-5 text-white/30 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Tanggal</span>
                                            <p className="text-sm text-white/70">{formatDate(purchaseDate)}</p>
                                        </div>
                                    </div>
                                )}

                                {customMessage && (
                                    <div className="flex items-start gap-4">
                                        <MessageCircle className="w-5 h-5 text-white/30 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Pesan</span>
                                            <p className="text-sm text-white/70 italic">&quot;{customMessage}&quot;</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 p-4 border border-white/10 text-center">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    ✓ Produk Asli Kaos Kami
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="p-6 bg-[#141414] border-t border-white/10">
                            <p className="text-xs text-white/40 text-center mb-4">
                                Suka produk ini? Cari koleksi lainnya!
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href="https://shopee.co.id/kaoskami"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider bg-[#EE4D2D]/10 text-[#EE4D2D] hover:bg-[#EE4D2D]/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Shopee
                                </a>
                                <Link
                                    href="/series"
                                    className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-white/30 transition-colors"
                                >
                                    Koleksi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default function LabelPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/40 text-sm uppercase tracking-wider">Loading...</p>
                </div>
            </main>
        }>
            <LabelContent />
        </Suspense>
    );
}
