'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Instagram, Twitter, Mail, Scan } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const footerLinks = {
    shop: [
        { label: 'Kami Community', href: '/series/kami-community' },
        { label: 'Anime Streetwear', href: '/series/anime-streetwear' },
        { label: 'Anime × Music', href: '/series/anime-music-fusion' },
        { label: 'Aksesoris', href: '/accessories' },
    ],
    support: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'Care Guide', href: '/care' },
        { label: 'Scan QR', href: '/scanner' },
    ],
};

const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/kaoskami', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/kaoskami', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@kaoskami.com', label: 'Email' },
];

export function Footer() {
    const router = useRouter();
    const [clickCount, setClickCount] = useState(0);

    // Hidden admin trigger: Click logo 5 times
    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);
    };

    useEffect(() => {
        if (clickCount >= 5) {
            router.push('/admin/login');
            setClickCount(0);
        }

        // Reset after 3 seconds
        const timer = setTimeout(() => setClickCount(0), 3000);
        return () => clearTimeout(timer);
    }, [clickCount, router]);

    // Hidden admin trigger: Ctrl+Shift+A
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            router.push('/admin/login');
        }
    }, [router]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            {/* Logo - Click 5x for admin */}
                            <button
                                onClick={handleLogoClick}
                                className="w-12 h-12 rounded-full overflow-hidden bg-[#141414] border border-white/10 cursor-default flex items-center justify-center"
                            >
                                <img
                                    src="/logo-white.png"
                                    alt="Kaos Kami"
                                    className="w-10 h-10 object-contain"
                                />
                            </button>
                            <div>
                                <span className="text-lg font-black tracking-tight uppercase">
                                    KAOS<span className="text-[#00d4ff]">KAMI</span>
                                </span>
                                <span className="block text-[8px] text-white/30 tracking-widest">
                                    カオスカミ · 카오스카미
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-white/40 mb-6 max-w-xs">
                            Urban streetwear dengan sentuhan anime Jepang. Bold, edgy, authentic.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-[#00d4ff] hover:border-[#00d4ff] transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Marketplace */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">
                            Marketplace
                        </h4>
                        <div className="space-y-3">
                            <a
                                href="https://shopee.co.id/kaoskami"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 px-4 text-sm font-bold bg-[#EE4D2D]/10 text-[#EE4D2D] hover:bg-[#EE4D2D]/20 transition-colors"
                            >
                                Shopee
                            </a>
                            <a
                                href="https://tokopedia.com/kaoskami"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 px-4 text-sm font-bold bg-[#42B549]/10 text-[#42B549] hover:bg-[#42B549]/20 transition-colors"
                            >
                                Tokopedia
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/30">
                            © 2025 Kaos Kami. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/scanner"
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/30 hover:text-[#00d4ff] transition-colors"
                            >
                                <Scan className="w-3 h-3" />
                                Scan QR Label
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
