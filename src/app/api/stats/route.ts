import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Count products
        const productsResult = await turso.execute('SELECT COUNT(*) as count FROM products');
        const products = Number(productsResult.rows[0]?.count) || 0;

        // Count series
        const seriesResult = await turso.execute('SELECT COUNT(*) as count FROM series');
        const series = Number(seriesResult.rows[0]?.count) || 0;

        // Count codes
        const codesResult = await turso.execute('SELECT COUNT(*) as count FROM codes');
        const codes = Number(codesResult.rows[0]?.count) || 0;

        // Count accessories
        const accessoriesResult = await turso.execute('SELECT COUNT(*) as count FROM accessories');
        const accessories = Number(accessoriesResult.rows[0]?.count) || 0;

        return NextResponse.json({
            stats: {
                products,
                series,
                codes,
                accessories
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({
            stats: {
                products: 0,
                series: 0,
                codes: 0,
                accessories: 0
            }
        });
    }
}
