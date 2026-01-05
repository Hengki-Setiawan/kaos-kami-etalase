import Link from 'next/link';
import { ArrowUpRight, Users, Shirt, Music } from 'lucide-react';
import { turso } from '@/lib/turso';

async function getSeriesCounts() {
    try {
        const result = await turso.execute(`
            SELECT series, COUNT(*) as count 
            FROM products 
            GROUP BY series
        `);

        const counts: Record<string, number> = {};
        result.rows.forEach(row => {
            counts[row.series as string] = Number(row.count);
        });
        return counts;
    } catch (error) {
        console.error('Error fetching series counts:', error);
        return {};
    }
}

export async function Collections() {
    const counts = await getSeriesCounts();

    const collections = [
        {
            id: 'kami-community',
            title: 'KAMI COMMUNITY',
            subtitle: 'コミュニティ · 커뮤니티',
            description: 'Merchandise eksklusif untuk komunitas Kami',
            productCount: counts['kami-community'] || 0,
            href: '/series/kami-community',
            icon: Users,
            accentColor: '#bbff00',
            bgGradient: 'from-[#bbff00]/10 to-transparent',
        },
        {
            id: 'anime-streetwear',
            title: 'ANIME STREETWEAR',
            subtitle: 'ストリート · 스트릿',
            description: 'Urban streetwear dengan sentuhan anime',
            productCount: counts['anime-streetwear'] || 0,
            href: '/series/anime-streetwear',
            icon: Shirt,
            accentColor: '#00d4ff',
            bgGradient: 'from-[#00d4ff]/10 to-transparent',
        },
        {
            id: 'anime-music-fusion',
            title: 'ANIME × MUSIC',
            subtitle: 'アニメ音楽 · 애니메음악',
            description: 'J-Pop, K-Pop, Lo-Fi vibes',
            productCount: counts['anime-music-fusion'] || 0,
            href: '/series/anime-music-fusion',
            icon: Music,
            accentColor: '#ff3366',
            bgGradient: 'from-[#ff3366]/10 to-transparent',
        },
    ];

    return (
        <section id="collections" className="py-24 px-6 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                            コレクション · 컬렉션
                        </span>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
                            OUR<br />
                            <span className="gradient-text">SERIES</span>
                        </h2>
                    </div>
                    <Link
                        href="/series"
                        className="text-sm font-bold uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        View All
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Collections Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {collections.map((item, index) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group card-urban p-6 block"
                        >
                            {/* Top Row */}
                            <div className="flex items-start justify-between mb-8">
                                <div
                                    className="w-12 h-12 flex items-center justify-center border transition-colors"
                                    style={{ borderColor: item.accentColor, color: item.accentColor }}
                                >
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-white/30">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* Japanese Text */}
                            <span
                                className="text-xs font-bold tracking-widest block mb-2"
                                style={{ color: item.accentColor }}
                            >
                                {item.subtitle}
                            </span>

                            {/* Title */}
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-white transition-colors">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-white/50 mb-6">
                                {item.description}
                            </p>

                            {/* Bottom Row */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/30">
                                    {item.productCount > 0 ? `${item.productCount} Items` : 'Coming Soon'}
                                </span>
                                <ArrowUpRight
                                    className="w-5 h-5 text-white/30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                    style={{ color: item.accentColor }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Accessories Banner */}
                <Link
                    href="/accessories"
                    className="mt-8 block group card-urban p-8 bg-gradient-to-r from-[#ff3366]/5 to-[#00d4ff]/5"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-[#ff3366] uppercase block mb-2">
                                NEW ・ アクセサリー
                            </span>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                ACCESSORIES & MORE
                            </h3>
                            <p className="text-sm text-white/50 mt-2">
                                Ganci, pin, sticker, tote bag, dan lainnya
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-white/50 group-hover:text-[#ff3366] transition-colors">
                            Shop Now
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
