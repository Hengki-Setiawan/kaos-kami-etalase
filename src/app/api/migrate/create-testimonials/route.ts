import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Create testimonials table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT,
                content TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                image_url TEXT,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed sample testimonials
        const testimonials = [
            {
                name: 'Ahmad Rizki',
                role: 'Collector',
                content: 'Kualitas kaosnya bagus banget! Desainnya unik dan QR codenya keren. Pasti beli lagi!',
                rating: 5
            },
            {
                name: 'Dina Safitri',
                role: 'Customer',
                content: 'Suka banget sama konsep streetwear x anime nya. Bahan adem dan sablon awet.',
                rating: 5
            },
            {
                name: 'Budi Santoso',
                role: 'Reseller',
                content: 'Sudah jadi langganan. Customer suka sama kualitas dan desainnya. Recommended!',
                rating: 5
            }
        ];

        for (const t of testimonials) {
            await turso.execute({
                sql: `INSERT OR IGNORE INTO testimonials (id, name, role, content, rating, is_featured) VALUES (?, ?, ?, ?, ?, 1)`,
                args: [crypto.randomUUID(), t.name, t.role, t.content, t.rating]
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Testimonials table created and seeded'
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
