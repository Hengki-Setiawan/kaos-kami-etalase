import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Create page_content table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS page_content (
                id TEXT PRIMARY KEY,
                page TEXT NOT NULL,
                section TEXT NOT NULL,
                key TEXT NOT NULL,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(page, section, key)
            )
        `);

        // Seed default content for Home page
        const homeContent = [
            { page: 'home', section: 'hero', key: 'title', value: 'KAOS KAMI' },
            { page: 'home', section: 'hero', key: 'subtitle', value: 'カオスカミ · 카오스카미' },
            { page: 'home', section: 'hero', key: 'description', value: 'Streetwear dengan sentuhan anime & musik. Setiap kaos punya cerita, setiap label punya rahasia.' },
            { page: 'home', section: 'hero', key: 'cta_text', value: 'Explore Collections' },
        ];

        // Seed default content for About page
        const aboutContent = [
            { page: 'about', section: 'hero', key: 'title', value: 'ABOUT KAOS KAMI' },
            { page: 'about', section: 'hero', key: 'description', value: 'Lebih dari sekadar kaos. Kami adalah komunitas yang menghubungkan passion untuk anime, streetwear, dan musik dalam satu identitas yang unik.' },
            { page: 'about', section: 'story', key: 'title', value: 'DARI KOMUNITAS, UNTUK KOMUNITAS' },
            { page: 'about', section: 'story', key: 'description', value: 'Kaos Kami lahir dari kecintaan terhadap budaya pop Jepang, Korea, dan streetwear. Didirikan oleh sekelompok teman yang percaya bahwa pakaian bisa menjadi medium ekspresi diri.' },
            { page: 'about', section: 'mascot', key: 'name', value: 'KAMITO' },
            { page: 'about', section: 'mascot', key: 'description', value: 'Kamito adalah maskot resmi Kaos Kami. Nama "Kamito" berasal dari gabungan "Kami" (kami/kita) dan "-to" dari bahasa Jepang yang berarti teman.' },
            { page: 'about', section: 'contact', key: 'whatsapp', value: '+62 812-3456-7890' },
            { page: 'about', section: 'contact', key: 'phone', value: '+62 812-3456-7890' },
            { page: 'about', section: 'contact', key: 'instagram', value: '@kaoskami' },
            { page: 'about', section: 'contact', key: 'tiktok', value: '@kaoskami' },
            { page: 'about', section: 'contact', key: 'location', value: 'Bandung, Jawa Barat, Indonesia' },
        ];

        // Seed default content for Accessories page
        const accessoriesContent = [
            { page: 'accessories', section: 'hero', key: 'title', value: 'ACCESSORIES' },
            { page: 'accessories', section: 'hero', key: 'description', value: 'Lengkapi style kamu dengan aksesoris dari Kaos Kami. Dari ganci hingga tote bag, semua ada di sini!' },
        ];

        const allContent = [...homeContent, ...aboutContent, ...accessoriesContent];

        for (const item of allContent) {
            await turso.execute({
                sql: `INSERT OR IGNORE INTO page_content (id, page, section, key, value) VALUES (?, ?, ?, ?, ?)`,
                args: [crypto.randomUUID(), item.page, item.section, item.key, item.value]
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Page content table created and seeded successfully'
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
