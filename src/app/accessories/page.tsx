'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KeyRound, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image_url?: string;
    images?: string[];
    purchase_links?: { platform: string; url: string }[];
}

const accessoryCategories = ['All', 'Ganci', 'Pin', 'Sticker', 'Other'];

export default function AccessoriesPage() {
    const [accessories, setAccessories] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const res = await fetch('/api/accessories');
                const data = await res.json();
                setAccessories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching accessories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccessories();
    }, []);

    const filteredAccessories = filter === 'All'
        ? accessories
        : accessories.filter(a => a.category === filter);

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-12 px-6 bg-urban bg-grid-urban">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <KeyRound className="w-8 h-8 text-[#ff3366]" />
                        <span className="text-xs font-bold tracking-widest text-[#ff3366] uppercase">
                            アクセサリー · 액세서리
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-6">
                        ACCES<span className="gradient-text">SORIES</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl">
                        Lengkapi style kamu dengan aksesoris dari Kaos Kami.
                        Dari ganci hingga tote bag, semua ada di sini!
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="px-6 pb-8 sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto py-4">
                    <div className="flex flex-wrap gap-2">
                        {accessoryCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${filter === cat
                                        ? 'border-[#ff3366] bg-[#ff3366]/10 text-[#ff3366]'
                                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#ff3366]" />
                        </div>
                    ) : filteredAccessories.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            Belum ada aksesoris.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAccessories.map((item) => {
                                const shopeeLink = item.purchase_links?.find(l => l.platform === 'Shopee')?.url;
                                const tiktokLink = item.purchase_links?.find(l => l.platform === 'TikTok Shop')?.url;

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.id}`}
                                        className="group card-urban overflow-hidden block"
                                    >
                                        {/* Image */}
                                        <div className="aspect-square bg-[#141414] relative overflow-hidden">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles className="w-12 h-12 text-[#ff3366]/20 group-hover:text-[#ff3366]/40 transition-colors" strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Category Tag */}
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-[#ff3366]/80 text-white text-[10px] font-bold uppercase tracking-wider">
                                                {item.category}
                                            </div>

                                            {/* Image count */}
                                            {item.images && item.images.length > 0 && (
                                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-xs text-white">
                                                    +{item.images.length} foto
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold uppercase tracking-tight mb-1 group-hover:text-[#ff3366] transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-white/40 mb-2 line-clamp-1">
                                                {item.description}
                                            </p>
                                            <p className="text-sm font-bold text-[#ff3366] mb-2">
                                                Rp {item.price.toLocaleString()}
                                            </p>

                                            {/* Purchase badges */}
                                            <div className="flex gap-1 mb-2">
                                                {shopeeLink && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 font-bold">Shopee</span>
                                                )}
                                                {tiktokLink && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-pink-500/20 text-pink-400 font-bold">TikTok</span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#ff3366]">
                                                <span>Detail</span>
                                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
                        CARI <span className="text-[#00d4ff]">KAOS</span> JUGA?
                    </h2>
                    <p className="text-white/50 mb-8">
                        Jangan lupa lihat koleksi kaos streetwear kami!
                    </p>
                    <Link href="/series" className="btn-urban">
                        Lihat Koleksi
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
