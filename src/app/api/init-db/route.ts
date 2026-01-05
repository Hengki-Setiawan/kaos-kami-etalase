import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET /api/init-db - Initialize all database tables
// Visit this URL once to create tables: http://localhost:3000/api/init-db
export async function GET() {
    try {
        const results: string[] = [];

        // Drop and recreate tables for clean state
        // WARNING: This will delete all existing data!

        // Drop existing tables
        try {
            await turso.execute('DROP TABLE IF EXISTS codes');
            await turso.execute('DROP TABLE IF EXISTS accessories');
            await turso.execute('DROP TABLE IF EXISTS products');
            await turso.execute('DROP TABLE IF EXISTS series');
            results.push('🗑️ Dropped old tables');
        } catch (e) {
            console.log('Drop tables error (ok if not exist):', e);
        }

        // Series table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS series (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                description TEXT,
                theme_color TEXT DEFAULT '#0a0a0a',
                accent_color TEXT DEFAULT '#00d4ff',
                tagline TEXT,
                jp_name TEXT,
                kr_name TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        results.push('✅ Created series table');

        // Products table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                series TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                lore TEXT,
                price INTEGER DEFAULT 0,
                edition_total INTEGER DEFAULT 50,
                edition_sold INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        results.push('✅ Created products table');

        // Codes table (QR codes)
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS codes (
                id TEXT PRIMARY KEY,
                code TEXT UNIQUE NOT NULL,
                product_id TEXT,
                status TEXT DEFAULT 'active',
                scan_count INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        results.push('✅ Created codes table');

        // Accessories table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS accessories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT DEFAULT 'Ganci',
                price INTEGER DEFAULT 0,
                image_url TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        results.push('✅ Created accessories table');

        // Profiles table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS profiles (
                id TEXT PRIMARY KEY,
                user_id TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE,
                display_name TEXT,
                avatar_url TEXT,
                birthday TEXT,
                is_admin INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        results.push('✅ Created profiles table');

        // Insert sample series
        await turso.execute(`
            INSERT INTO series (id, name, slug, description, accent_color, jp_name, kr_name) VALUES
            ('ser_1', 'Kami Community', 'kami-community', 'Merchandise eksklusif untuk komunitas Kami', '#bbff00', 'コミュニティ', '커뮤니티'),
            ('ser_2', 'Anime Streetwear', 'anime-streetwear', 'Urban streetwear dengan sentuhan anime', '#00d4ff', 'ストリート', '스트릿'),
            ('ser_3', 'Anime × Music', 'anime-music-fusion', 'J-Pop, K-Pop, Lo-Fi vibes', '#ff3366', 'アニメ音楽', '애니메음악'),
            ('ser_4', 'Dellerium', 'dellerium', 'Dark surrealist nightmare collection', '#8b5cf6', 'デリリウム', '델레리움')
        `);
        results.push('✅ Inserted sample series');

        // Insert sample products
        await turso.execute(`
            INSERT INTO products (id, name, series, description, price) VALUES
            ('prod_1', 'Community Basic Tee', 'kami-community', 'Kaos basic dengan logo Kami Community', 150000),
            ('prod_2', 'Street Fighter Oversized', 'anime-streetwear', 'Oversized tee dengan desain anime streetwear', 189000),
            ('prod_3', 'Lofi Beats Hoodie', 'anime-music-fusion', 'Hoodie dengan artwork lofi aesthetic', 299000),
            ('prod_4', 'Nightmare Vision', 'dellerium', 'Dark surrealist artwork dengan tema mimpi buruk', 189000),
            ('prod_5', 'Delirium State', 'dellerium', 'Premium hoodie dengan desain psychedelic gelap', 299000)
        `);
        results.push('✅ Inserted sample products');

        // Insert sample accessories
        await turso.execute(`
            INSERT INTO accessories (id, name, description, category, price) VALUES
            ('acc_1', 'Kamito Keychain', 'Gantungan kunci karakter Kamito', 'Ganci', 35000),
            ('acc_2', 'Kami Logo Pin', 'Pin metal dengan logo Kaos Kami', 'Pin', 25000),
            ('acc_3', 'Sticker Pack Vol.1', 'Pack berisi 5 sticker vinyl', 'Sticker', 20000)
        `);
        results.push('✅ Inserted sample accessories');

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully! All tables recreated with fresh data.',
            results
        });

    } catch (error) {
        console.error('Database init error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
