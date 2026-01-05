import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowUpRight, Users, Shirt, Music } from 'lucide-react';
import Link from 'next/link';

const series = [
    {
        id: 'kami-community',
        title: 'KAMI COMMUNITY',
        subtitle: 'コミュニティ · 커뮤니티',
        number: '01',
        description: 'Merchandise eksklusif untuk komunitas Kami. Desain simple dan authentic yang mencerminkan kebersamaan.',
        productCount: 0,
        href: '/series/kami-community',
        icon: Users,
        accentColor: '#bbff00',
    },
    {
        id: 'anime-streetwear',
        title: 'ANIME STREETWEAR',
        subtitle: 'ストリート · 스트릿',
        number: '02',
        description: 'Gaya streetwear urban dengan sentuhan anime. Bold, edgy, dan modern untuk kamu yang ingin tampil beda.',
        productCount: 0,
        href: '/series/anime-streetwear',
        icon: Shirt,
        accentColor: '#00d4ff',
    },
    {
        id: 'anime-music-fusion',
        title: 'ANIME × MUSIC',
        subtitle: 'アニメ音楽 · 애니메음악',
        number: '03',
        description: 'Kombinasi anime dan musik - J-Pop, K-Pop, Lo-Fi. Aesthetic retro dengan warna pastel yang memukau.',
        productCount: 0,
        href: '/series/anime-music-fusion',
        icon: Music,
        accentColor: '#ff3366',
    },
];

export default function SeriesPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-urban bg-grid-urban">
                <div className="max-w-7xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                        全コレクション · 모든 컬렉션
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-6">
                        ALL<br />
                        <span className="gradient-text">SERIES</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl">
                        Setiap series punya cerita dan karakternya sendiri.
                        Pilih yang paling cocok dengan style kamu.
                    </p>
                </div>
            </section>

            {/* Series List */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-6">
                        {series.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group block card-urban"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Left: Visual */}
                                    <div
                                        className="w-full md:w-80 aspect-square md:aspect-auto flex items-center justify-center p-8"
                                        style={{ background: `linear-gradient(135deg, ${item.accentColor}10 0%, transparent 50%)` }}
                                    >
                                        <item.icon
                                            className="w-24 h-24 opacity-30 group-hover:opacity-60 transition-opacity"
                                            style={{ color: item.accentColor }}
                                            strokeWidth={1}
                                        />
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span
                                                    className="text-xs font-bold tracking-widest"
                                                    style={{ color: item.accentColor }}
                                                >
                                                    {item.subtitle}
                                                </span>
                                                <span className="text-4xl font-black text-white/10">
                                                    {item.number}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 group-hover:text-white transition-colors">
                                                {item.title}
                                            </h2>
                                            <p className="text-white/50 max-w-lg">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                                            <span className="text-sm font-bold uppercase tracking-wider text-white/30">
                                                {item.productCount > 0 ? `${item.productCount} Products` : 'Coming Soon'}
                                            </span>
                                            <ArrowUpRight
                                                className="w-6 h-6 text-white/30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                                style={{ color: item.accentColor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
