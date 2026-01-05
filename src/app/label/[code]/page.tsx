'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Droplets, ThermometerSnowflake, Ban, Sparkles, Wind, RotateCcw,
    ShoppingBag, ExternalLink, Check, ChevronLeft, ChevronRight,
    Tag, Ruler, Palette, Package, QrCode, Eye, Loader2, AlertCircle
} from 'lucide-react';

interface Label {
    id: string;
    code: string;
    name: string;
    image_url: string;
    images: string[];
    size: string;
    price: number;
    material: string;
    color: string;
    description: string;
    story: string;
    care_instructions: { icon: string; text: string }[];
    purchase_links: { platform: string; url: string }[];
    scan_count: number;
}

// Care instruction icon mapping
const careIcons: Record<string, React.ReactNode> = {
    'wash-cold': <ThermometerSnowflake className="w-6 h-6" />,
    'no-bleach': <Ban className="w-6 h-6" />,
    'no-dryer': <Wind className="w-6 h-6" />,
    'iron-low': <Sparkles className="w-6 h-6" />,
    'hang-dry': <Droplets className="w-6 h-6" />,
    'wash-inside': <RotateCcw className="w-6 h-6" />,
};

export default function LabelPage() {
    const params = useParams();
    const code = params.code as string;
    const [label, setLabel] = useState<Label | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const res = await fetch(`/api/labels/${code}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError('Label tidak ditemukan');
                    } else {
                        setError('Gagal memuat data');
                    }
                    return;
                }
                const data = await res.json();
                setLabel(data);
            } catch (err) {
                setError('Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchLabel();
        }
    }, [code]);

    const allImages = label ? [label.image_url, ...(label.images || [])].filter(Boolean) : [];

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Loading state
    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto text-[#00d4ff] animate-pulse mb-4" />
                    <p className="text-white/50">Memuat label digital...</p>
                </div>
            </main>
        );
    }

    // Error state
    if (error || !label) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 mx-auto text-[#ff3366] mb-4" />
                    <h1 className="text-2xl font-black uppercase mb-2">{error || 'Error'}</h1>
                    <p className="text-white/50 mb-6">QR code ini tidak valid atau sudah tidak aktif.</p>
                    <Link href="/" className="btn-urban">
                        Kembali ke Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Image */}
            <section className="relative">
                {allImages.length > 0 ? (
                    <div className="relative bg-[#141414]">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] md:aspect-[16/9] max-h-[600px] overflow-hidden">
                            <img
                                src={allImages[currentImage]}
                                alt={label.name}
                                className="w-full h-full object-contain animate-fade-in"
                            />

                            {/* Image navigation arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors rounded-full"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors rounded-full"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Thumbnail Navigation */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4">
                                <div className="flex justify-center gap-2 px-4 overflow-x-auto">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 overflow-hidden transition-all ${i === currentImage
                                                    ? 'border-[#00d4ff] opacity-100'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="aspect-square md:aspect-[16/9] max-h-[400px] bg-[#141414] flex items-center justify-center">
                        <Package className="w-24 h-24 text-white/10" strokeWidth={1} />
                    </div>
                )}

                {/* Authenticity Badge */}
                <div className="absolute top-4 right-4 bg-[#00d4ff]/20 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 border border-[#00d4ff]/30">
                    <Check className="w-4 h-4 text-[#00d4ff]" />
                    <span className="text-[10px] font-bold tracking-widest text-[#00d4ff] uppercase">Authentic</span>
                </div>
            </section>

            {/* Product Info */}
            <section className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Name & Price */}
                    <div className="animate-fade-up">
                        <span className="text-[10px] font-bold tracking-widest text-[#00d4ff] uppercase block mb-2">
                            デジタルラベル · 디지털 라벨
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3">
                            {label.name}
                        </h1>
                        <p className="text-2xl md:text-3xl font-bold text-[#bbff00]">
                            Rp {label.price.toLocaleString('id-ID')}
                        </p>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up delay-1">
                        {label.size && (
                            <div className="bg-white/5 border border-white/10 p-4 text-center">
                                <Ruler className="w-5 h-5 mx-auto mb-2 text-[#00d4ff]" />
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Size</span>
                                <span className="font-bold text-lg">{label.size}</span>
                            </div>
                        )}
                        {label.color && (
                            <div className="bg-white/5 border border-white/10 p-4 text-center">
                                <Palette className="w-5 h-5 mx-auto mb-2 text-[#ff3366]" />
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Color</span>
                                <span className="font-bold text-lg">{label.color}</span>
                            </div>
                        )}
                        {label.material && (
                            <div className="bg-white/5 border border-white/10 p-4 text-center">
                                <Tag className="w-5 h-5 mx-auto mb-2 text-[#bbff00]" />
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">Material</span>
                                <span className="font-bold text-sm">{label.material}</span>
                            </div>
                        )}
                        <div className="bg-white/5 border border-white/10 p-4 text-center">
                            <Eye className="w-5 h-5 mx-auto mb-2 text-white/50" />
                            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Scans</span>
                            <span className="font-bold text-lg">{label.scan_count}</span>
                        </div>
                    </div>

                    {/* Description */}
                    {label.description && (
                        <div className="animate-fade-up delay-2">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00d4ff] mb-3">
                                Description
                            </h2>
                            <p className="text-white/70 leading-relaxed">{label.description}</p>
                        </div>
                    )}

                    {/* Story */}
                    {label.story && (
                        <div className="bg-gradient-to-r from-[#00d4ff]/10 via-transparent to-[#ff3366]/10 border border-white/10 p-6 animate-fade-up delay-3">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#bbff00] mb-3">
                                Story
                            </h2>
                            <p className="text-white/60 leading-relaxed italic">{label.story}</p>
                        </div>
                    )}

                    {/* Care Instructions */}
                    {label.care_instructions && label.care_instructions.length > 0 && (
                        <div className="animate-fade-up delay-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ff3366] mb-4">
                                Petunjuk Perawatan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {label.care_instructions.map((instruction, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 p-4">
                                        <div className="w-10 h-10 flex-shrink-0 bg-[#ff3366]/10 flex items-center justify-center text-[#ff3366]">
                                            {careIcons[instruction.icon] || <Sparkles className="w-5 h-5" />}
                                        </div>
                                        <span className="text-sm text-white/70">{instruction.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Purchase Links */}
                    {label.purchase_links && label.purchase_links.length > 0 && (
                        <div className="animate-fade-up delay-5">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[#bbff00] mb-4">
                                Beli Lagi
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {label.purchase_links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#bbff00] hover:text-[#bbff00] transition-colors font-bold uppercase text-sm tracking-wider"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        {link.platform}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-white/30 mb-1">Label Code</p>
                            <p className="font-mono font-bold text-[#00d4ff]">{label.code}</p>
                        </div>
                        <Link
                            href="/"
                            className="btn-urban"
                        >
                            Explore More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Branding Footer */}
            <footer className="py-8 text-center border-t border-white/5">
                <Link href="/" className="inline-block">
                    <span className="text-xl font-black tracking-tight uppercase">
                        KAOS<span className="text-[#00d4ff]">KAMI</span>
                    </span>
                </Link>
                <p className="text-[10px] text-white/30 mt-2">
                    Digital Label System · Authenticated Product
                </p>
            </footer>
        </main>
    );
}
