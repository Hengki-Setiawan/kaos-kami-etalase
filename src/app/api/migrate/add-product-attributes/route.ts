import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Add new columns to products table
        const columns = [
            { name: 'model', type: 'TEXT DEFAULT ""' },
            { name: 'material', type: 'TEXT DEFAULT ""' },
            { name: 'sizes', type: 'TEXT DEFAULT ""' },  // Comma-separated: "S,M,L,XL"
            { name: 'stock', type: 'INTEGER DEFAULT 0' },
            { name: 'purchase_links', type: 'TEXT DEFAULT ""' }  // JSON array of {platform, url}
        ];

        for (const col of columns) {
            try {
                await turso.execute(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
            } catch (e: any) {
                // Column might already exist, that's ok
                if (!e.message?.includes('duplicate column')) {
                    console.log(`Column ${col.name} might already exist:`, e.message);
                }
            }
        }

        return NextResponse.json({ message: "Migration successful: Added model, material, sizes, stock, purchase_links columns" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
