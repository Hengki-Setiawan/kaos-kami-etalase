'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQ[] = [
    {
        id: '1',
        question: 'Bagaimana cara verifikasi keaslian kaos?',
        answer: 'Setiap kaos Kaos Kami memiliki QR code dan NFC tag. Untuk verifikasi: 1) Scan QR code dengan kamera HP atau buka /scanner di website, atau 2) Tempelkan HP dengan NFC ke tag di dalam kaos (Android only).',
        category: 'verification',
    },
    {
        id: '2',
        question: 'Apa itu NFC dan bagaimana cara kerjanya?',
        answer: 'NFC (Near Field Communication) adalah teknologi wireless jarak dekat. Cukup tempelkan HP Android kamu ke tag NFC di dalam kaos, dan website akan otomatis terbuka untuk verifikasi.',
        category: 'verification',
    },
    {
        id: '3',
        question: 'Bagaimana cara unlock wallpaper eksklusif?',
        answer: 'Wallpaper ter-unlock otomatis saat kamu scan/verifikasi kaos yang kamu miliki. Login ke akun kamu, lalu pergi ke halaman Wallpapers untuk melihat koleksi yang sudah ter-unlock.',
        category: 'features',
    },
    {
        id: '4',
        question: 'Apa itu Digital Certificate?',
        answer: 'Digital Certificate adalah sertifikat kepemilikan digital yang membuktikan kamu adalah pemilik sah kaos tersebut. Certificate mencakup serial number, tanggal pembelian, dan verification code unik.',
        category: 'features',
    },
    {
        id: '5',
        question: 'Bagaimana cara mendapatkan badges?',
        answer: 'Badges didapat dengan mencapai milestone tertentu: First Scan (scan kaos pertama), Collector (punya 3+ kaos), True Fan (punya 5+ kaos), dan badges khusus untuk setiap series.',
        category: 'features',
    },
    {
        id: '6',
        question: 'Apakah bisa order custom size?',
        answer: 'Saat ini kami menyediakan size S, M, L, XL, dan XXL. Untuk custom size, silakan hubungi kami melalui WhatsApp untuk diskusi lebih lanjut.',
        category: 'order',
    },
    {
        id: '7',
        question: 'Berapa lama waktu pengiriman?',
        answer: 'Pengiriman dalam kota: 1-2 hari kerja. Luar kota: 2-5 hari kerja. Luar pulau Jawa: 5-7 hari kerja. Kami menggunakan ekspedisi terpercaya dengan tracking.',
        category: 'order',
    },
    {
        id: '8',
        question: 'Apakah bisa return/tukar?',
        answer: 'Ya, kami menerima return/tukar dalam 7 hari setelah barang diterima dengan kondisi: belum dicuci, tag masih ada, dan kemasan original. Biaya kirim return ditanggung pembeli.',
        category: 'order',
    },
];

const categories = [
    { key: 'all', label: 'All' },
    { key: 'verification', label: 'Verifikasi' },
    { key: 'features', label: 'Fitur' },
    { key: 'order', label: 'Order' },
];

export default function FAQPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [expanded, setExpanded] = useState<string | null>(null);

    const filteredFaqs = faqs.filter(faq => {
        const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === 'all' || faq.category === category;
        return matchSearch && matchCategory;
    });

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-light mb-4">
                            Frequently Asked <span className="gradient-text-purple">Questions</span>
                        </h1>
                        <p className="body-text mx-auto text-center">
                            Temukan jawaban untuk pertanyaan yang sering ditanyakan.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-[var(--border)] bg-transparent focus:border-[var(--foreground)] outline-none transition-colors"
                            placeholder="Cari pertanyaan..."
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 mb-8 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setCategory(cat.key)}
                                className={`text-sm px-4 py-2 border transition-colors ${category === cat.key
                                        ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                                        : 'border-[var(--border)] hover:border-[var(--foreground)]'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-3">
                        {filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
                            >
                                <button
                                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                                    className="w-full p-4 flex items-center justify-between text-left"
                                >
                                    <span className="font-medium pr-4">{faq.question}</span>
                                    {expanded === faq.id
                                        ? <ChevronUp className="w-5 h-5 shrink-0" />
                                        : <ChevronDown className="w-5 h-5 shrink-0" />
                                    }
                                </button>
                                {expanded === faq.id && (
                                    <div className="px-4 pb-4 pt-0 border-t border-[var(--border)]">
                                        <p className="text-[var(--muted)] pt-4 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[var(--muted)] mb-4">Tidak ada hasil yang ditemukan.</p>
                        </div>
                    )}

                    {/* Contact CTA */}
                    <div className="mt-12 p-8 border border-[var(--border)] text-center">
                        <MessageCircle className="w-8 h-8 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="text-xl font-light mb-2">Masih ada pertanyaan?</h3>
                        <p className="text-sm text-[var(--muted)] mb-6">
                            Hubungi kami langsung melalui WhatsApp atau email.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a href="https://wa.me/62xxx" target="_blank" rel="noopener noreferrer" className="btn-filled text-sm">
                                WhatsApp
                            </a>
                            <Link href="/contact" className="btn-minimal text-sm">
                                Contact Form
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
