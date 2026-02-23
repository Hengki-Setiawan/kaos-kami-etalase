import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Users, ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsBySeries } from '@/lib/data';

// Helper to check if a URL is a video
const isVideoUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
};

export const revalidate = 0;

export default async function AnimeMusicFusionPage() {
    const products = await getProductsBySeries('anime-music-fusion');

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Hero */}
            <section className="min-h-[70vh] flex flex-col justify-center px-6 pt-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff3366]/5 to-transparent" />
                <div className="absolute top-20 right-10 w-64 h-64 border border-[#ff3366]/10 rotate-45" />

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <Link href="/series" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/40 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        All Series
                    </Link>

                    <span className="text-xs font-bold tracking-widest text-[#ff3366] uppercase block mb-4">
                        アニメ音楽 · 애니메음악 ・ SERIES 03
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
                        ANIME ×<br />
                        <span className="text-[#ff3366]">MUSIC</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mb-8">
                        J-Pop, K-Pop, Lo-Fi vibes.
                        Koleksi yang terinspirasi dari harmoni musik dan visual anime.
                    </p>

                    <div className="flex gap-8 pt-8 border-t border-white/10">
                        <div>
                            <span className="text-3xl font-black text-white">{products.length}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">Products</span>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-[#ff3366]">QR</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">Label</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8">PRODUCTS</h2>

                    {products.length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                            Belum ada produk di series ini.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => {
                                const shopeeLink = product.purchase_links?.find(l => l.platform === 'Shopee')?.url;
                                const tiktokLink = product.purchase_links?.find(l => l.platform === 'TikTok Shop')?.url;

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="group card-urban overflow-hidden block"
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-[#ff3366]/5 to-transparent relative overflow-hidden">
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
                                                    <Users className="w-16 h-16 text-[#ff3366]/20 group-hover:text-[#ff3366]/40 transition-colors" strokeWidth={1} />
                                                </div>
                                            )}

                                            {product.images && product.images.length > 0 && (
                                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 text-xs text-white">
                                                    +{product.images.length} foto
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#ff3366] transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-white/40 mb-2 line-clamp-2">{product.description}</p>

                                            {product.sizes && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {product.sizes.split(',').filter(s => s).map(size => (
                                                        <span key={size} className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50">{size}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-lg font-bold text-[#ff3366] mb-4">
                                                Rp {product.price.toLocaleString()}
                                            </p>
                                            {/* Purchase links preview */}
                                            <div className="flex gap-2 mb-4">
                                                {shopeeLink && (
                                                    <span className="text-[10px] px-2 py-1 bg-[#ff6600]/20 text-[#ff6600] font-bold flex items-center gap-1 rounded-sm">
                                                        <Image src="/shopee-icon.png" alt="Shopee" width={12} height={12} className="w-3 h-3 object-contain" />
                                                        Shopee
                                                    </span>
                                                )}
                                                {tiktokLink && (
                                                    <span className="text-[10px] px-2 py-1 bg-[#ff0050]/20 text-[#ff0050] font-bold flex items-center gap-1 rounded-sm">
                                                        <Image src="/tiktok-icon.png" alt="TikTok" width={12} height={12} className="w-3 h-3 object-contain" />
                                                        TikTok
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#ff3366]">
                                                <span>Lihat Detail</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
