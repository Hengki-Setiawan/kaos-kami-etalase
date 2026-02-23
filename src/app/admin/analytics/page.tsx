import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { turso } from '@/lib/turso';
import { getProductById } from '@/lib/data';
import { BarChart3, TrendingUp } from 'lucide-react';

export const revalidate = 0; // Disable cache for real-time analytics

export default async function AdminAnalyticsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Fetch aggregate clicks
    const query = `
        SELECT product_id, platform, COUNT(*) as click_count
        FROM product_clicks
        GROUP BY product_id, platform
        ORDER BY click_count DESC
    `;
    const result = await turso.execute({ sql: query, args: [] });

    // Group by product
    const stats: Record<string, { total: number; shopee: number; tiktok: number }> = {};

    result.rows.forEach(row => {
        const pId = row.product_id as string;
        const platform = row.platform as string;
        const count = Number(row.click_count);

        if (!stats[pId]) {
            stats[pId] = { total: 0, shopee: 0, tiktok: 0 };
        }

        stats[pId].total += count;
        if (platform === 'shopee') stats[pId].shopee += count;
        if (platform === 'tiktok') stats[pId].tiktok += count;
    });

    // Resolve product details
    const analyticsData = await Promise.all(
        Object.entries(stats).map(async ([productId, data]) => {
            const product = await getProductById(productId);
            return {
                product,
                productId,
                ...data
            };
        })
    );

    // Sort by total clicks descending
    analyticsData.sort((a, b) => b.total - a.total);

    const totalShopee = analyticsData.reduce((sum, item) => sum + item.shopee, 0);
    const totalTiktok = analyticsData.reduce((sum, item) => sum + item.tiktok, 0);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Kinerja Marketplace</h1>
                    <p className="text-white/40 mt-1">Lacak jumlah interaksi klik audiens ke Shopee dan TikTok Shop</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#141418] p-6 border border-[#00d4ff]/20 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[#00d4ff]/60 font-bold uppercase tracking-wider text-xs">Total Klik Semua</span>
                        <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
                    </div>
                    <span className="text-4xl font-black text-white">{totalShopee + totalTiktok}</span>
                </div>
                <div className="bg-[#141418] p-6 border border-[#ff6600]/20 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[#ff6600]/60 font-bold uppercase tracking-wider text-xs">Klik Shopee</span>
                        <TrendingUp className="w-5 h-5 text-[#ff6600]" />
                    </div>
                    <span className="text-4xl font-black text-[#ff6600]">{totalShopee}</span>
                </div>
                <div className="bg-[#141418] p-6 border border-[#ff0050]/20 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[#ff0050]/60 font-bold uppercase tracking-wider text-xs">Klik TikTok</span>
                        <TrendingUp className="w-5 h-5 text-[#ff0050]" />
                    </div>
                    <span className="text-4xl font-black text-[#ff0050]">{totalTiktok}</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#141418] border border-white/5 overflow-hidden rounded-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs font-bold tracking-wider text-white/40 uppercase bg-black/40">
                                <th className="px-6 py-4">Produk</th>
                                <th className="px-6 py-4 text-center">Shopee</th>
                                <th className="px-6 py-4 text-center">TikTok</th>
                                <th className="px-6 py-4 text-center">Total Klik</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                                        Belum ada data klik. Klik akan tercatat saat pengunjung menekan tombol beli di halaman produk.
                                    </td>
                                </tr>
                            ) : (
                                analyticsData.map((item) => (
                                    <tr key={item.productId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black overflow-hidden flex-shrink-0 border border-white/10">
                                                    {item.product?.image_url ? (
                                                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-white/5"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold uppercase leading-tight text-white">{item.product?.name || 'Produk Dihapus / Unknown'}</div>
                                                    <div className="text-xs text-white/40 truncate w-32 md:w-auto">{item.product?.series || item.productId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-[#ff6600] font-bold">{item.shopee}</td>
                                        <td className="px-6 py-4 text-center text-[#ff0050] font-bold">{item.tiktok}</td>
                                        <td className="px-6 py-4 text-center text-[#00d4ff] font-black">{item.total}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
