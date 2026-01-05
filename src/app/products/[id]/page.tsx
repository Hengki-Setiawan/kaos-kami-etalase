'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight, Package, Ruler, Tag, Layers } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    series: string;
    category: string;
    description: string;
    lore?: string;
    price: number;
    image_url?: string;
    images?: string[];
    model?: string;
    material?: string;
    sizes?: string;
    stock?: number;
    purchase_links?: { platform: string; url: string }[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState('');

    // Get all images (main + additional)
    const allImages = product ? [product.image_url, ...(product.images || [])].filter(Boolean) : [];

    // Auto-rotate images
    // Auto-rotate images removed as per request
    // useEffect(() => {
    //     if (allImages.length <= 1) return;
    //
    //     const interval = setInterval(() => {
    //         setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    //     }, 3000); // Change image every 3 seconds
    //
    //     return () => clearInterval(interval);
    // }, [allImages.length]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    const found = data.find((p: Product) => p.id === id);
                    if (found) {
                        setProduct(found);
                    } else {
                        setError('Produk tidak ditemukan');
                    }
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Gagal memuat produk');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white/40">Loading...</div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                    <p className="text-white/40 mb-4">{error || 'Produk tidak ditemukan'}</p>
                    <Link href="/series" className="text-[#00d4ff] hover:underline">
                        Kembali ke Series
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const sizesArray = product.sizes ? product.sizes.split(',').filter(s => s) : [];
    const shopeeLink = product.purchase_links?.find(l => l.platform === 'Shopee')?.url;
    const tiktokLink = product.purchase_links?.find(l => l.platform === 'TikTok Shop')?.url;

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <section className="pt-24 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <Link href="/series" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/40 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div>
                            <div className="relative aspect-square bg-[#141418] overflow-hidden mb-4">
                                {allImages.length > 0 ? (
                                    <>
                                        <img
                                            src={allImages[currentImageIndex] as string}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-opacity duration-500"
                                        />

                                        {/* Navigation arrows */}
                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronLeft className="w-6 h-6 text-white" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronRight className="w-6 h-6 text-white" />
                                                </button>
                                            </>
                                        )}

                                        {/* Image counter */}
                                        {allImages.length > 1 && (
                                            <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 text-sm text-white">
                                                {currentImageIndex + 1} / {allImages.length}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-24 h-24 text-white/10" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail row */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-20 h-20 border-2 transition-colors ${idx === currentImageIndex ? 'border-[#00d4ff]' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={img as string} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <span className="text-xs font-bold tracking-widest text-[#00d4ff] uppercase block mb-2">
                                {product.series.replace(/-/g, ' ')}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-bold text-[#00d4ff] mb-6">
                                Rp {product.price.toLocaleString()}
                            </p>

                            {/* Stock info */}
                            {product.stock !== undefined && product.stock > 0 && (
                                <p className="text-sm text-green-400 mb-4">
                                    ✓ Stock tersedia: {product.stock} pcs
                                </p>
                            )}

                            <p className="text-white/60 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Specs */}
                            <div className="space-y-4 mb-8 border-t border-white/10 pt-6">
                                {product.category && (
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-5 h-5 text-white/40" />
                                        <span className="text-white/40 w-24">Kategori</span>
                                        <span className="text-white font-medium">{product.category}</span>
                                    </div>
                                )}

                                {product.model && (
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-5 h-5 text-white/40" />
                                        <span className="text-white/40 w-24">Model</span>
                                        <span className="text-white font-medium">{product.model}</span>
                                    </div>
                                )}

                                {product.material && (
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-white/40" />
                                        <span className="text-white/40 w-24">Bahan</span>
                                        <span className="text-white font-medium">{product.material}</span>
                                    </div>
                                )}

                                {sizesArray.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Ruler className="w-5 h-5 text-white/40 mt-1" />
                                        <span className="text-white/40 w-24">Ukuran</span>
                                        <div className="flex flex-wrap gap-2">
                                            {sizesArray.map(size => (
                                                <span key={size} className="px-3 py-1 bg-white/10 text-white text-sm font-medium">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Purchase Buttons */}
                            <div className="space-y-3">
                                {shopeeLink && (
                                    <a
                                        href={shopeeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 py-4 w-full text-lg font-bold uppercase tracking-wider bg-[#EE4D2D] text-white hover:bg-[#EE4D2D]/90 transition-colors"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Beli di Shopee
                                    </a>
                                )}

                                {tiktokLink && (
                                    <a
                                        href={tiktokLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 py-4 w-full text-lg font-bold uppercase tracking-wider bg-[#FF0050] text-white hover:bg-[#FF0050]/90 transition-colors"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Beli di TikTok Shop
                                    </a>
                                )}

                                {!shopeeLink && !tiktokLink && (
                                    <div className="py-4 text-center text-white/40 border border-white/10">
                                        Link pembelian belum tersedia
                                    </div>
                                )}
                            </div>

                            {/* Lore/Story */}
                            {product.lore && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-3">Story</h3>
                                    <p className="text-white/60 italic">{product.lore}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
