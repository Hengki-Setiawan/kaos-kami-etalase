import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight, Users, Shirt, Music, Flame } from 'lucide-react';
import { getBestSellers } from '@/lib/data';

// Helper to check if a URL is a video
const isVideoUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
};

export async function BestSellers() {
    const products = await getBestSellers(4);

    if (products.length === 0) {
        return null; // Don't show the section if there are no products
    }

    return (
        <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#ff3366] uppercase mb-4">
                            <Flame className="w-4 h-4" />
                            ベストセラー · Bestsellers
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                            KAOS<br />
                            <span className="text-[#ff3366]">PALING LARIS</span>
                        </h2>
                    </div>
                    <Link
                        href="/series"
                        className="text-sm font-bold uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        Lihat Semua
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const shopeeLink = product.purchase_links?.find(l => l.platform === 'Shopee')?.url;
                        const tiktokLink = product.purchase_links?.find(l => l.platform === 'TikTok Shop')?.url;

                        // Identify icon color based on series
                        let accentColor = '#bbff00';
                        if (product.series === 'anime-streetwear') accentColor = '#00d4ff';
                        if (product.series === 'anime-music-fusion') accentColor = '#ff3366';

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group card-urban overflow-hidden block"
                            >
                                <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                                    {product.image_url ? (
                                        isVideoUrl(product.image_url) ? (
                                            <video
                                                src={product.image_url}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                                muted
                                                loop
                                                playsInline
                                                autoPlay
                                            />
                                        ) : (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Shirt className="w-16 h-16 text-white/10 group-hover:text-white/20 transition-colors" strokeWidth={1} />
                                        </div>
                                    )}

                                    {/* Fire badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-[10px] font-bold text-[#ff3366] flex items-center gap-1 uppercase tracking-widest backdrop-blur-md">
                                        <Flame className="w-3 h-3" /> Terlaris
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col justify-between" style={{ minHeight: '200px' }}>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-white transition-colors text-white/90 line-clamp-2" style={{ ':hover': { color: accentColor } } as any}>
                                            {product.name}
                                        </h3>
                                        
                                        {/* Sizes */}
                                        {product.sizes && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {product.sizes.split(',').filter(s => s).slice(0, 3).map(size => (
                                                    <span key={size} className="text-[9px] px-1 py-0.5 bg-white/10 text-white/50">{size}</span>
                                                ))}
                                                {product.sizes.split(',').filter(s => s).length > 3 && (
                                                    <span className="text-[9px] px-1 py-0.5 bg-white/5 text-white/30">+{product.sizes.split(',').filter(s => s).length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <p className="text-base font-bold text-white mb-4" style={{ color: accentColor }}>
                                            Rp {product.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Purchase links preview */}
                                        <div className="flex gap-2 mb-4">
                                            {shopeeLink && (
                                                <span className="text-[9px] px-2 py-1 bg-[#ff6600]/20 text-[#ff6600] font-bold flex items-center gap-1 rounded-sm">
                                                    <Image src="/shopee-icon.png" alt="Shopee" width={10} height={10} className="w-2.5 h-2.5 object-contain" />
                                                    Shopee
                                                </span>
                                            )}
                                            {tiktokLink && (
                                                <span className="text-[9px] px-2 py-1 bg-[#ff0050]/20 text-[#ff0050] font-bold flex items-center gap-1 rounded-sm">
                                                    <Image src="/tiktok-icon.png" alt="TikTok" width={10} height={10} className="w-2.5 h-2.5 object-contain" />
                                                    TikTok
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
                                            <span>Lihat Detail</span>
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
