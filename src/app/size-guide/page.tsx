'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Ruler, Check, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const sizeChart = {
    S: { chest: 48, length: 68, weight: '45-55 kg', height: '155-165 cm' },
    M: { chest: 50, length: 70, weight: '55-65 kg', height: '165-172 cm' },
    L: { chest: 52, length: 72, weight: '65-75 kg', height: '170-178 cm' },
    XL: { chest: 54, length: 74, weight: '75-85 kg', height: '175-183 cm' },
    XXL: { chest: 56, length: 76, weight: '85-95 kg', height: '180-190 cm' },
};

type SizeKey = keyof typeof sizeChart;

export default function SizeGuidePage() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [recommendedSize, setRecommendedSize] = useState<SizeKey | null>(null);
    const [preference, setPreference] = useState<'fitted' | 'regular' | 'oversized'>('regular');

    const calculateSize = () => {
        const h = parseInt(height);
        const w = parseInt(weight);

        if (!h || !w) return;

        let size: SizeKey = 'M';

        // Basic calculation based on weight and height
        if (w < 55 && h < 165) size = 'S';
        else if (w < 65 && h < 172) size = 'M';
        else if (w < 75 && h < 178) size = 'L';
        else if (w < 85 && h < 183) size = 'XL';
        else size = 'XXL';

        // Adjust for preference
        if (preference === 'oversized') {
            const sizes: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];
            const idx = sizes.indexOf(size);
            if (idx < sizes.length - 1) size = sizes[idx + 1];
        } else if (preference === 'fitted') {
            const sizes: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];
            const idx = sizes.indexOf(size);
            if (idx > 0) size = sizes[idx - 1];
        }

        setRecommendedSize(size);
    };

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Ruler className="w-10 h-10 mx-auto mb-4" strokeWidth={1} />
                        <h1 className="text-4xl font-light mb-4">Size Guide</h1>
                        <p className="text-[var(--muted)]">
                            Temukan size yang tepat untuk kamu
                        </p>
                    </div>

                    {/* Size Calculator */}
                    <div className="p-6 border border-[var(--border)] mb-12">
                        <h2 className="font-medium mb-6">Size Recommendation</h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm text-[var(--muted)] block mb-2">
                                    Tinggi Badan (cm)
                                </label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="170"
                                    className="w-full px-4 py-3 border border-[var(--border)] bg-transparent focus:border-[var(--foreground)] outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[var(--muted)] block mb-2">
                                    Berat Badan (kg)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="65"
                                    className="w-full px-4 py-3 border border-[var(--border)] bg-transparent focus:border-[var(--foreground)] outline-none"
                                />
                            </div>
                        </div>

                        {/* Preference */}
                        <div className="mb-6">
                            <label className="text-sm text-[var(--muted)] block mb-2">
                                Preferensi Fit
                            </label>
                            <div className="flex gap-2">
                                {(['fitted', 'regular', 'oversized'] as const).map((pref) => (
                                    <button
                                        key={pref}
                                        onClick={() => setPreference(pref)}
                                        className={`flex-1 py-2 border text-sm capitalize transition-colors ${preference === pref
                                                ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                                                : 'border-[var(--border)]'
                                            }`}
                                    >
                                        {pref}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={calculateSize}
                            className="w-full btn-filled"
                            disabled={!height || !weight}
                        >
                            Get Recommendation
                        </button>

                        {/* Result */}
                        {recommendedSize && (
                            <div className="mt-6 p-6 bg-[var(--subtle)] text-center">
                                <span className="text-sm text-[var(--muted)] block mb-2">
                                    Recommended Size
                                </span>
                                <span className="text-5xl font-light block mb-2">{recommendedSize}</span>
                                <span className="text-sm text-[var(--muted)]">
                                    {sizeChart[recommendedSize].chest} × {sizeChart[recommendedSize].length} cm
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Size Chart Table */}
                    <div className="mb-12">
                        <h2 className="font-medium mb-4">Size Chart (cm)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-[var(--border)]">
                                <thead>
                                    <tr className="bg-[var(--subtle)]">
                                        <th className="p-3 text-left text-sm font-medium border-b border-[var(--border)]">Size</th>
                                        <th className="p-3 text-left text-sm font-medium border-b border-[var(--border)]">Lebar Dada</th>
                                        <th className="p-3 text-left text-sm font-medium border-b border-[var(--border)]">Panjang</th>
                                        <th className="p-3 text-left text-sm font-medium border-b border-[var(--border)]">Berat</th>
                                        <th className="p-3 text-left text-sm font-medium border-b border-[var(--border)]">Tinggi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Object.keys(sizeChart) as SizeKey[]).map((size) => (
                                        <tr
                                            key={size}
                                            className={`${recommendedSize === size ? 'bg-purple-500/10' : ''
                                                }`}
                                        >
                                            <td className="p-3 border-b border-[var(--border)] font-medium">
                                                {size}
                                                {recommendedSize === size && (
                                                    <Check className="w-4 h-4 text-purple-500 inline ml-2" />
                                                )}
                                            </td>
                                            <td className="p-3 border-b border-[var(--border)] text-sm">{sizeChart[size].chest}</td>
                                            <td className="p-3 border-b border-[var(--border)] text-sm">{sizeChart[size].length}</td>
                                            <td className="p-3 border-b border-[var(--border)] text-sm text-[var(--muted)]">{sizeChart[size].weight}</td>
                                            <td className="p-3 border-b border-[var(--border)] text-sm text-[var(--muted)]">{sizeChart[size].height}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shop CTA */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <a
                            href="https://shopee.co.id/kaoskami"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-6 border border-[var(--border)] hover:border-orange-500 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-medium block mb-1">Beli di Shopee</span>
                                    <span className="text-sm text-[var(--muted)]">Gratis ongkir & cashback</span>
                                </div>
                                <ExternalLink className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                        <a
                            href="https://www.tiktok.com/@kaoskami/shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-6 border border-[var(--border)] hover:border-pink-500 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-medium block mb-1">Beli di TikTok Shop</span>
                                    <span className="text-sm text-[var(--muted)]">Live shopping & promo</span>
                                </div>
                                <ExternalLink className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
