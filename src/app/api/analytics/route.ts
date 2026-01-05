import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Simple hash function for IP anonymization
function hashIP(ip: string): string {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// POST - Track page view
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { page, path } = body;

        if (!page || !path) {
            return NextResponse.json({ error: 'page and path required' }, { status: 400 });
        }

        const referrer = request.headers.get('referer') || '';
        const userAgent = request.headers.get('user-agent') || '';
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const ipHash = hashIP(ip);

        await turso.execute({
            sql: `INSERT INTO page_views (id, page, path, referrer, user_agent, ip_hash) VALUES (?, ?, ?, ?, ?, ?)`,
            args: [crypto.randomUUID(), page, path, referrer, userAgent.substring(0, 200), ipHash]
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '7d';

        let days = 7;
        if (period === '30d') days = 30;
        if (period === '1d') days = 1;

        // Total views
        const totalResult = await turso.execute({
            sql: `SELECT COUNT(*) as total FROM page_views WHERE created_at >= datetime('now', ?)`,
            args: [`-${days} days`]
        });

        // Views by page
        const byPageResult = await turso.execute({
            sql: `SELECT page, COUNT(*) as views FROM page_views 
                  WHERE created_at >= datetime('now', ?) 
                  GROUP BY page ORDER BY views DESC LIMIT 10`,
            args: [`-${days} days`]
        });

        // Views by day
        const byDayResult = await turso.execute({
            sql: `SELECT DATE(created_at) as date, COUNT(*) as views 
                  FROM page_views 
                  WHERE created_at >= datetime('now', ?) 
                  GROUP BY DATE(created_at) ORDER BY date`,
            args: [`-${days} days`]
        });

        // Unique visitors (by ip_hash)
        const uniqueResult = await turso.execute({
            sql: `SELECT COUNT(DISTINCT ip_hash) as unique_visitors FROM page_views 
                  WHERE created_at >= datetime('now', ?)`,
            args: [`-${days} days`]
        });

        // Top products viewed
        const productsResult = await turso.execute({
            sql: `SELECT product_id, COUNT(*) as views FROM product_views 
                  WHERE created_at >= datetime('now', ?) 
                  GROUP BY product_id ORDER BY views DESC LIMIT 5`,
            args: [`-${days} days`]
        });

        return NextResponse.json({
            period,
            totalViews: Number(totalResult.rows[0]?.total) || 0,
            uniqueVisitors: Number(uniqueResult.rows[0]?.unique_visitors) || 0,
            byPage: byPageResult.rows.map(r => ({ page: r.page, views: Number(r.views) })),
            byDay: byDayResult.rows.map(r => ({ date: r.date, views: Number(r.views) })),
            topProducts: productsResult.rows.map(r => ({ id: r.product_id, views: Number(r.views) }))
        });
    } catch (error: any) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
