import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { turso } from '@/lib/turso';
import { getProductById } from '@/lib/data';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Package, Heart } from 'lucide-react';
import { RemoveWishlistButton } from '@/components/RemoveWishlistButton';

export const metadata = {
    title: 'Wishlist Kamu | Kaos Kami',
    description: 'Daftar produk yang disukai',
};

export default async function WishlistPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const result = await turso.execute({
        sql: 'SELECT product_id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC',
        args: [userId]
    });

    const productIds = result.rows.map(row => row.product_id as string);
    const products = (await Promise.all(productIds.map(id => getProductById(id)))).filter(Boolean);

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-32 pb-20 px-6 min-h-[75vh]">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/40 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Lanjut Belanja
                </Link>

                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500/20" />
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                        Wishlist Saya
                    </h1>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 text-white/40 border border-white/5 bg-white/5 rounded-sm">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        Belum ada produk yang disimpan di Wishlist kamu.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div key={product!.id} className="flex items-center gap-4 bg-white/5 p-4 border border-white/10 hover:border-white/30 transition-colors rounded-sm group relative">
                                <Link href={`/products/${product!.id}`} className="absolute inset-0 z-0" />

                                <div className="w-20 h-20 md:w-24 md:h-24 bg-black overflow-hidden flex-shrink-0 relative z-10 border border-white/10">
                                    {product!.image_url ? (
                                        <img src={product!.image_url} alt={product!.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-8 h-8 m-auto mt-6 text-white/20" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 z-10 pointer-events-none">
                                    <h3 className="font-bold text-lg md:text-xl truncate uppercase">{product!.name}</h3>
                                    <p className="text-xs md:text-sm text-white/40 truncate uppercase tracking-widest">{product!.series.replace(/-/g, ' ')}</p>
                                    <p className="text-[#00d4ff] font-bold mt-2 text-lg">Rp {product!.price.toLocaleString()}</p>
                                </div>

                                <div className="z-10 relative ml-2">
                                    <RemoveWishlistButton productId={product!.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
