'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
    Droplets,
    ThermometerSun,
    Wind,
    AlertTriangle,
    Check,
    Plus,
    History
} from 'lucide-react';

interface CareLog {
    date: string;
    type: 'wash' | 'dry' | 'iron';
}

interface ProductCare {
    id: string;
    name: string;
    serialNumber: string;
    material: string;
    washCount: number;
    maxWash: number;
    lastWash: string | null;
    careLog: CareLog[];
}

const mockProduct: ProductCare = {
    id: '1',
    name: 'Nightmare Vision',
    serialNumber: 'KK-DEL-2024-000012',
    material: '100% Cotton 30s Combed',
    washCount: 5,
    maxWash: 50,
    lastWash: '2024-12-22',
    careLog: [
        { date: '2024-12-22', type: 'wash' },
        { date: '2024-12-20', type: 'wash' },
        { date: '2024-12-18', type: 'wash' },
        { date: '2024-12-15', type: 'wash' },
        { date: '2024-12-12', type: 'wash' },
    ]
};

const careInstructions = [
    { icon: Droplets, title: 'Cuci', desc: 'Cuci dengan air dingin (30°C max)', color: 'text-blue-500' },
    { icon: ThermometerSun, title: 'Jemur', desc: 'Jangan jemur langsung di bawah matahari', color: 'text-yellow-500' },
    { icon: Wind, title: 'Setrika', desc: 'Setrika suhu rendah, balik bagian dalam', color: 'text-purple-500' },
];

const dontDo = [
    'Jangan gunakan pemutih',
    'Jangan dry clean',
    'Jangan peras terlalu kencang',
    'Jangan dicuci dengan pakaian berwarna lain (terutama untuk warna terang)',
];

export default function CarePage() {
    const [logAdded, setLogAdded] = useState(false);

    const handleAddWash = () => {
        setLogAdded(true);
        setTimeout(() => setLogAdded(false), 2000);
    };

    const healthPercentage = ((mockProduct.maxWash - mockProduct.washCount) / mockProduct.maxWash) * 100;

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <span className="text-sm tracking-[0.2em] uppercase text-[var(--muted)] block mb-2">
                            Care Instructions
                        </span>
                        <h1 className="text-3xl font-light">{mockProduct.name}</h1>
                        <p className="text-[var(--muted)] text-sm">{mockProduct.material}</p>
                    </div>

                    {/* Health Bar */}
                    <div className="p-6 border border-[var(--border)] mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium">Fabric Health</span>
                            <span className="text-sm text-[var(--muted)]">
                                {mockProduct.maxWash - mockProduct.washCount} washes remaining
                            </span>
                        </div>
                        <div className="h-3 bg-[var(--subtle)] rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${healthPercentage > 70 ? 'bg-green-500' :
                                        healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${healthPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-2">
                            Sudah dicuci {mockProduct.washCount}x dari estimasi {mockProduct.maxWash}x
                        </p>
                    </div>

                    {/* Care Instructions */}
                    <div className="mb-8">
                        <h2 className="text-sm font-medium uppercase tracking-wider mb-4">
                            Cara Perawatan
                        </h2>
                        <div className="grid gap-3">
                            {careInstructions.map((item, i) => (
                                <div key={i} className="p-4 border border-[var(--border)] flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full bg-[var(--subtle)] flex items-center justify-center ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-medium block">{item.title}</span>
                                        <span className="text-sm text-[var(--muted)]">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Don't Do */}
                    <div className="mb-8 p-6 bg-red-500/5 border border-red-500/20">
                        <h3 className="font-medium mb-4 flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            Jangan Lakukan
                        </h3>
                        <ul className="space-y-2">
                            {dontDo.map((item, i) => (
                                <li key={i} className="text-sm text-[var(--muted)] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Wash Log */}
                    <div className="p-6 border border-[var(--border)]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Wash Log
                            </h3>
                            <button
                                onClick={handleAddWash}
                                className="btn-minimal text-xs"
                            >
                                {logAdded ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        Added!
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3 h-3" />
                                        Log Wash
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {mockProduct.careLog.slice(0, 5).map((log, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0"
                                >
                                    <span className="text-sm flex items-center gap-2">
                                        <Droplets className="w-3 h-3 text-blue-500" />
                                        Wash #{mockProduct.washCount - i}
                                    </span>
                                    <span className="text-xs text-[var(--muted)]">
                                        {new Date(log.date).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
