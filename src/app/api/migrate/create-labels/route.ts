import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Create labels table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS labels (
                id TEXT PRIMARY KEY,
                code TEXT UNIQUE NOT NULL,
                product_id TEXT,
                name TEXT NOT NULL,
                image_url TEXT,
                images TEXT,
                size TEXT,
                price INTEGER DEFAULT 0,
                material TEXT,
                color TEXT,
                description TEXT,
                story TEXT,
                care_instructions TEXT,
                purchase_links TEXT,
                is_active INTEGER DEFAULT 1,
                scan_count INTEGER DEFAULT 0,
                last_scanned_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_labels_code ON labels(code)`);
        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_labels_product ON labels(product_id)`);

        // Create scan history table
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS label_scans (
                id TEXT PRIMARY KEY,
                label_id TEXT NOT NULL,
                ip_hash TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await turso.execute(`CREATE INDEX IF NOT EXISTS idx_label_scans_label ON label_scans(label_id)`);

        // Seed sample label
        const sampleCode = 'DEMO001';
        const existing = await turso.execute({
            sql: 'SELECT id FROM labels WHERE code = ?',
            args: [sampleCode]
        });

        if (existing.rows.length === 0) {
            await turso.execute({
                sql: `INSERT INTO labels (id, code, name, size, price, material, color, description, story, care_instructions, is_active) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    crypto.randomUUID(),
                    sampleCode,
                    'Kaos Kami - Anime Streetwear Edition',
                    'L',
                    150000,
                    'Cotton Combed 30s',
                    'Black',
                    'Kaos premium dengan desain eksklusif anime streetwear. Bahan nyaman dan sablon berkualitas tinggi.',
                    'Setiap kaos Kaos Kami memiliki cerita unik. Desain ini terinspirasi dari perpaduan budaya street Jepang dengan gaya urban modern.',
                    JSON.stringify([
                        { icon: 'wash-cold', text: 'Cuci dengan air dingin (max 30°C)' },
                        { icon: 'no-bleach', text: 'Jangan gunakan pemutih' },
                        { icon: 'no-dryer', text: 'Jangan gunakan mesin pengering' },
                        { icon: 'iron-low', text: 'Setrika suhu rendah, hindari sablon' },
                        { icon: 'hang-dry', text: 'Keringkan dengan digantung, jangan diperas' },
                        { icon: 'wash-inside', text: 'Cuci dengan bagian dalam keluar' }
                    ]),
                    1
                ]
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Labels tables created and seeded successfully',
            sampleUrl: `/label/${sampleCode}`
        });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
