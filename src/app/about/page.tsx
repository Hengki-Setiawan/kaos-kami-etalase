'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Users, MapPin, Phone, Instagram, MessageCircle, Heart, Sparkles, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';

type PageContent = Record<string, Record<string, string>>;

export default function AboutPage() {
    const [content, setContent] = useState<PageContent>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/page-content?page=about');
                const data = await res.json();
                setContent(data.about || {});
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const get = (section: string, key: string, fallback: string = '') => {
        return content[section]?.[key] || fallback;
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#bbff00]" />
            </main>
        );
    }

    const whatsappNumber = get('contact', 'whatsapp', '+62 812-3456-7890').replace(/[^0-9]/g, '');
    const location = get('contact', 'location', 'Bandung, Jawa Barat, Indonesia');
    const locationParts = location.split(',');

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#bbff00]/5 via-transparent to-[#00d4ff]/5" />
                <div className="absolute top-40 right-20 w-96 h-96 border border-[#bbff00]/10 rotate-45 hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <span className="text-xs font-bold tracking-widest text-[#bbff00] uppercase block mb-4">
                        私たちについて · 우리에 대해
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-6">
                        {get('hero', 'title', 'ABOUT KAOS KAMI').split(' ').map((word, i) => (
                            <span key={i} className={i === 0 ? '' : 'text-[#bbff00]'}>{word} </span>
                        ))}
                    </h1>
                    <p className="text-base md:text-lg text-white/50 max-w-2xl">
                        {get('hero', 'description', 'Lebih dari sekadar kaos.')}
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-12 md:py-20 px-4 md:px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                                Our Story
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-6">
                                {get('story', 'title', 'DARI KOMUNITAS, UNTUK KOMUNITAS').split(',').map((part, i) => (
                                    <span key={i}>
                                        {i > 0 && <br />}
                                        <span className={i > 0 ? 'text-[#00d4ff]' : ''}>{part.trim()}</span>
                                    </span>
                                ))}
                            </h2>
                            <div className="space-y-4 text-white/60 text-sm md:text-base">
                                <p>{get('story', 'description', 'Kaos Kami lahir dari kecintaan terhadap budaya pop.')}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#00d4ff]/10 to-[#bbff00]/10 aspect-square flex items-center justify-center border border-white/10">
                            <Users className="w-24 md:w-32 h-24 md:h-32 text-white/10" strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mascot - Kamito */}
            <section className="py-12 md:py-20 px-4 md:px-6 bg-[#141418] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 lg:order-1 bg-gradient-to-br from-[#ff3366]/10 to-[#bbff00]/10 aspect-square flex items-center justify-center border border-white/10">
                            <Sparkles className="w-24 md:w-32 h-24 md:h-32 text-[#bbff00]/30" strokeWidth={1} />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-xs font-bold tracking-widest text-[#ff3366] uppercase block mb-4">
                                Meet Our Mascot
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                                <span className="text-[#bbff00]">{get('mascot', 'name', 'KAMITO')}</span>
                            </h2>
                            <div className="space-y-4 text-white/60 text-sm md:text-base">
                                <p>{get('mascot', 'description', 'Kamito adalah maskot resmi Kaos Kami.')}</p>
                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-[#ff3366]" />
                                        <span className="text-sm">Friendly</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-[#bbff00]" />
                                        <span className="text-sm">Creative</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-[#00d4ff]" />
                                        <span className="text-sm">Adventurous</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Location */}
            <section className="py-12 md:py-20 px-4 md:px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                            CONTACT <span className="text-[#00d4ff]">US</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group card-urban p-4 md:p-6 text-center hover:border-green-500/50 transition-colors"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-green-500/10 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-1 md:mb-2 text-xs md:text-sm group-hover:text-green-500 transition-colors">
                                WhatsApp
                            </h3>
                            <p className="text-[10px] md:text-sm text-white/40">{get('contact', 'whatsapp', '+62 812-3456-7890')}</p>
                        </a>

                        {/* Phone */}
                        <a
                            href={`tel:${get('contact', 'phone', '+62 812-3456-7890').replace(/[^0-9+]/g, '')}`}
                            className="group card-urban p-4 md:p-6 text-center hover:border-[#00d4ff]/50 transition-colors"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-[#00d4ff]/10 flex items-center justify-center">
                                <Phone className="w-6 h-6 md:w-8 md:h-8 text-[#00d4ff]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-1 md:mb-2 text-xs md:text-sm group-hover:text-[#00d4ff] transition-colors">
                                Phone
                            </h3>
                            <p className="text-[10px] md:text-sm text-white/40">{get('contact', 'phone', '+62 812-3456-7890')}</p>
                        </a>

                        {/* Instagram */}
                        <a
                            href={`https://instagram.com/${get('contact', 'instagram', '@kaoskami').replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group card-urban p-4 md:p-6 text-center hover:border-[#ff3366]/50 transition-colors"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-[#ff3366]/10 flex items-center justify-center">
                                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-[#ff3366]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-1 md:mb-2 text-xs md:text-sm group-hover:text-[#ff3366] transition-colors">
                                Instagram
                            </h3>
                            <p className="text-[10px] md:text-sm text-white/40">{get('contact', 'instagram', '@kaoskami')}</p>
                        </a>

                        {/* Location */}
                        <div className="group card-urban p-4 md:p-6 text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-[#bbff00]/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-[#bbff00]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-1 md:mb-2 text-xs md:text-sm text-[#bbff00]">
                                Location
                            </h3>
                            <p className="text-[10px] md:text-sm text-white/40">
                                {locationParts[0]}<br />
                                {locationParts.slice(1).join(',')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-r from-[#bbff00]/10 via-transparent to-[#00d4ff]/10 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
                        JOIN THE <span className="text-[#bbff00]">COMMUNITY</span>
                    </h2>
                    <p className="text-white/50 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
                        Jadilah bagian dari keluarga Kaos Kami.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                        <Link href="/series" className="btn-urban text-sm md:text-base">
                            Explore Collections
                        </Link>
                        <a
                            href={`https://instagram.com/${get('contact', 'instagram', '@kaoskami').replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-white/20 text-xs md:text-sm font-bold uppercase tracking-wider hover:border-[#ff3366] hover:text-[#ff3366] transition-colors"
                        >
                            Follow Instagram
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
