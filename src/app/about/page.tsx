import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Users, MapPin, Phone, Instagram, MessageCircle, Heart, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#bbff00]/5 via-transparent to-[#00d4ff]/5" />
                <div className="absolute top-40 right-20 w-96 h-96 border border-[#bbff00]/10 rotate-45 hidden lg:block" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <span className="text-xs font-bold tracking-widest text-[#bbff00] uppercase block mb-4">
                        私たちについて · 우리에 대해
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
                        ABOUT<br />
                        <span className="text-[#bbff00]">KAOS KAMI</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl">
                        Lebih dari sekadar kaos. Kami adalah komunitas yang menghubungkan
                        passion untuk anime, streetwear, dan musik dalam satu identitas yang unik.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                                Our Story
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-6">
                                DARI KOMUNITAS,<br />
                                <span className="text-[#00d4ff]">UNTUK KOMUNITAS</span>
                            </h2>
                            <div className="space-y-4 text-white/60">
                                <p>
                                    <strong className="text-white">Kaos Kami</strong> lahir dari kecintaan terhadap
                                    budaya pop Jepang, Korea, dan streetwear. Didirikan oleh sekelompok teman
                                    yang percaya bahwa pakaian bisa menjadi medium ekspresi diri.
                                </p>
                                <p>
                                    Setiap desain kami terinspirasi dari anime, musik J-Pop dan K-Pop,
                                    serta estetika urban yang kami cintai. Kami tidak hanya menjual kaos —
                                    kami membangun komunitas.
                                </p>
                                <p>
                                    Dengan teknologi <strong className="text-[#bbff00]">QR Label</strong>,
                                    setiap produk terhubung dengan cerita unik dan memberikan pengalaman
                                    yang berbeda untuk setiap collector.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#00d4ff]/10 to-[#bbff00]/10 aspect-square flex items-center justify-center border border-white/10">
                            <Users className="w-32 h-32 text-white/10" strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mascot - Kamito */}
            <section className="py-20 px-6 bg-[#141418] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 bg-gradient-to-br from-[#ff3366]/10 to-[#bbff00]/10 aspect-square flex items-center justify-center border border-white/10">
                            <Sparkles className="w-32 h-32 text-[#bbff00]/30" strokeWidth={1} />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-xs font-bold tracking-widest text-[#ff3366] uppercase block mb-4">
                                Meet Our Mascot
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-6">
                                <span className="text-[#bbff00]">KAMITO</span>
                            </h2>
                            <div className="space-y-4 text-white/60">
                                <p>
                                    <strong className="text-[#bbff00]">Kamito</strong> adalah maskot resmi Kaos Kami.
                                    Nama "Kamito" berasal dari gabungan "<strong className="text-white">Kami</strong>" (kami/kita)
                                    dan "<strong className="text-white">-to</strong>" dari bahasa Jepang yang berarti teman.
                                </p>
                                <p>
                                    Kamito merepresentasikan semangat komunitas — friendly, kreatif, dan
                                    selalu siap untuk petualangan baru. Kamu bisa menemukan Kamito di
                                    berbagai desain dan merchandise kami!
                                </p>
                                <div className="flex items-center gap-4 pt-4">
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
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-4">
                            Get In Touch
                        </span>
                        <h2 className="text-4xl font-black uppercase tracking-tight">
                            CONTACT <span className="text-[#00d4ff]">US</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group card-urban p-6 text-center hover:border-green-500/50 transition-colors"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-2 group-hover:text-green-500 transition-colors">
                                WhatsApp
                            </h3>
                            <p className="text-sm text-white/40">+62 812-3456-7890</p>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:+6281234567890"
                            className="group card-urban p-6 text-center hover:border-[#00d4ff]/50 transition-colors"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-[#00d4ff]/10 flex items-center justify-center">
                                <Phone className="w-8 h-8 text-[#00d4ff]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-2 group-hover:text-[#00d4ff] transition-colors">
                                Phone
                            </h3>
                            <p className="text-sm text-white/40">+62 812-3456-7890</p>
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com/kaoskami"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group card-urban p-6 text-center hover:border-[#ff3366]/50 transition-colors"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-[#ff3366]/10 flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-[#ff3366]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-2 group-hover:text-[#ff3366] transition-colors">
                                Instagram
                            </h3>
                            <p className="text-sm text-white/40">@kaoskami</p>
                        </a>

                        {/* Location */}
                        <div className="group card-urban p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-[#bbff00]/10 flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-[#bbff00]" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider mb-2 text-[#bbff00]">
                                Location
                            </h3>
                            <p className="text-sm text-white/40">
                                Bandung, Jawa Barat<br />
                                Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-[#bbff00]/10 via-transparent to-[#00d4ff]/10 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
                        JOIN THE <span className="text-[#bbff00]">COMMUNITY</span>
                    </h2>
                    <p className="text-white/50 mb-8 max-w-xl mx-auto">
                        Jadilah bagian dari keluarga Kaos Kami. Follow kami di social media
                        untuk update terbaru dan exclusive drops!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/series" className="btn-urban">
                            Explore Collections
                        </Link>
                        <a
                            href="https://instagram.com/kaoskami"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-white/20 text-sm font-bold uppercase tracking-wider hover:border-[#ff3366] hover:text-[#ff3366] transition-colors"
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
