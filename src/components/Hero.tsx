import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Scan } from 'lucide-react';

export function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center px-6 pt-20 bg-urban bg-grid-urban relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00d4ff]/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#ff3366]/5 blur-[100px] rounded-full" />

            {/* Content */}
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        {/* Japanese accent */}
                        <div className="flex items-center gap-4 mb-6 animate-fade-up">
                            <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase">
                                ストリートウェア · 스트릿웨어
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent max-w-32" />
                        </div>

                        {/* Main Title */}
                        <h1 className="display-text text-[clamp(3rem,10vw,8rem)] mb-6 animate-fade-up delay-1 leading-[0.85]">
                            <span className="block text-white">KAMI</span>
                            <span className="block gradient-text">URBAN</span>
                            <span className="block text-white">WEAR</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-white/60 max-w-md mb-8 animate-fade-up delay-2">
                            Website etalase official store grup komunitas <b>kami depresi</b>, <b>bahagia</b>, dan <b>skizo</b> di Facebook. <span className="italic text-white/80">Dari komunitas, untuk komunitas.</span>
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-3">
                            <Link href="#" className="btn-urban btn-tiktok bg-black hover:bg-black/80 border border-white/20 text-white">
                                <Image src="/tiktok-icon.png" alt="TikTok Shop" width={24} height={24} className="w-5 h-5 object-contain" />
                                TikTok Shop
                            </Link>
                            <Link href="#" className="btn-urban btn-shopee bg-[#ff6600] text-white hover:bg-[#ff5500]">
                                <Image src="/shopee-icon.png" alt="Shopee" width={24} height={24} className="w-5 h-5 object-contain" />
                                Shopee
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 mt-12 pt-8 border-t border-white/10 animate-fade-up delay-4">
                            <div>
                                <span className="text-4xl font-black block text-white">3</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Series</span>
                            </div>
                            <div>
                                <span className="text-4xl font-black block text-[#00d4ff]">∞</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Designs</span>
                            </div>
                            <div>
                                <span className="text-4xl font-black block text-[#ff3366]">QR</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Label</span>
                            </div>
                        </div>
                    </div>

                    {/* Mascot */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-up">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-[#00d4ff]/20 blur-[60px] rounded-full" />

                            {/* Mascot Image */}
                            <div className="relative animate-float">
                                <Image
                                    src="/kamito.png"
                                    alt="Kamito - Mascot Kaos Kami"
                                    width={500}
                                    height={500}
                                    className="w-80 lg:w-[450px] h-auto object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center">
                                <span className="text-xs font-bold tracking-widest text-white/30">
                                    MEET KAMITO
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
        </section>
    );
}
