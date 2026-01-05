import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Create analytics tables
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS page_views (
                id TEXT PRIMARY KEY,
                page TEXT NOT NULL,
                path TEXT NOT NULL,
                referrer TEXT,
                user_agent TEXT,
                ip_hash TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await turso.execute(`
            CREATE TABLE IF NOT EXISTS product_views (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create index for faster queries
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page)`);
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(created_at)`);
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_product_views_product ON product_views(product_id)`);

        return NextResponse.json({
            success: true,
            message: 'Analytics tables created successfully'
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
