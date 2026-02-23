import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Aggregate clicks by product and platform
        const query = `
            SELECT product_id, platform, COUNT(*) as click_count
            FROM product_clicks
            GROUP BY product_id, platform
            ORDER BY click_count DESC
        `;

        const result = await turso.execute({ sql: query, args: [] });

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
