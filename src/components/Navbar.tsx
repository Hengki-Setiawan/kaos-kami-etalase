'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Scan, ChevronDown, KeyRound } from 'lucide-react';

const seriesItems = [
    {
        id: 'kami-community',
        title: 'Kami Community',
        subtitle: 'コミュニティ / 커뮤니티',
        description: 'Merchandise komunitas',
        href: '/series/kami-community'
    },
    {
        id: 'anime-streetwear',
        title: 'Anime Streetwear',
        subtitle: 'ストリート / 스트릿',
        description: 'Urban streetwear × anime',
        href: '/series/anime-streetwear'
    },
    {
        id: 'anime-music-fusion',
        title: 'Anime × Music',
        subtitle: 'アニメ音楽 / 애니메음악',
        description: 'J-Pop, K-Pop, Lo-Fi',
        href: '/series/anime-music-fusion'
    },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [seriesOpen, setSeriesOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <nav className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-black tracking-tight uppercase">
                            KAOS<span className="text-[#00d4ff]">KAMI</span>
                        </span>
                        <span className="text-[10px] text-white/30 font-medium tracking-widest hidden sm:block">
                            カオスカミ · 카오스카미
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Series Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setSeriesOpen(!seriesOpen)}
                                onBlur={() => setTimeout(() => setSeriesOpen(false), 150)}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
                            >
                                Collections
                                <ChevronDown className={`w-4 h-4 transition-transform ${seriesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {seriesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-[#141414] border border-white/10 shadow-2xl">
                                    {seriesItems.map((item, index) => (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className="group block p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all"
                                            onClick={() => setSeriesOpen(false)}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] text-[#00d4ff] font-bold tracking-widest">
                                                    {item.subtitle}
                                                </span>
                                                <span className="text-[10px] text-white/30">
                                                    0{index + 1}
                                                </span>
                                            </div>
                                            <h4 className="font-bold uppercase tracking-wide group-hover:text-[#00d4ff] transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-white/40 mt-1">{item.description}</p>
                                        </Link>
                                    ))}
                                    <Link
                                        href="/series"
                                        className="block p-3 text-center text-xs font-bold uppercase tracking-wider text-white/50 hover:text-[#00d4ff] hover:bg-white/5 transition-all"
                                        onClick={() => setSeriesOpen(false)}
                                    >
                                        View All →
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/accessories"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-[#ff3366] transition-colors"
                        >
                            <KeyRound className="w-4 h-4" />
                            Aksesoris
                        </Link>

                        <Link
                            href="/scanner"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-[#bbff00] transition-colors"
                        >
                            <Scan className="w-4 h-4" />
                            Scan
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="lg:hidden py-8 border-t border-white/5">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-widest mb-2">
                                コレクション · 컬렉션
                            </span>
                            {seriesItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="py-3 text-xl font-black uppercase tracking-wide hover:text-[#00d4ff] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}

                            <div className="h-px bg-white/10 my-4" />

                            <Link
                                href="/accessories"
                                className="py-3 text-xl font-black uppercase tracking-wide flex items-center gap-3 hover:text-[#ff3366] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <KeyRound className="w-5 h-5" />
                                Aksesoris
                            </Link>

                            <Link
                                href="/scanner"
                                className="py-3 text-xl font-black uppercase tracking-wide flex items-center gap-3 hover:text-[#bbff00] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Scan className="w-5 h-5" />
                                Scan QR
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
